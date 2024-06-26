import { Text, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
// @ts-ignore Can't find type declaration for module 'react-native-path'
import path from 'react-native-path';

import hljs from 'highlight.js';
import 'highlight.js/styles/panda-syntax-dark.css';
import { trpcClient } from '../utils/api';
import CustomKeyboardTextInput, {
    CustomKeyboardTextInputRef,
} from './CustomKeyboardTextInput';
import useWorkspace from '../utils/workspace/hooks/useWorkspace';
import {
    Highlighted,
    transformHtmlToHighlighted,
} from '../utils/htmlToHighlightedTransformation';
import getPositionFromCharPos from '../utils/getPositionFromCharPosition';
import getLastWordFromCharPos from 'utils/getLastWordFromCharPos';
import { z } from 'zod';
import { completionItemSchema } from '@/schemas/exportedSchemas';
import { KeyboardContext } from '../utils/keyboardContext';
import EditModeSwitcher from './EditModeSwitcher';
import useEditMode from '../utils/workspace/hooks/useEditMode';
import GestureBasedEditor from './GestureBasedEditor';
import useWatchFile from '../utils/workspace/hooks/useWatchFile';
import useCursorMove from '../utils/workspace/hooks/useCursorMove';
const ac = new AbortController();

export default function FileEditor({ file }: { file: string }) {
    const ref = React.useRef<CustomKeyboardTextInputRef>(null);
    const workspace = useWorkspace();
    const editMode = useEditMode();
    const keyboardContext = useContext(KeyboardContext);
    const [fileContent, setFileContent] = useState<string | undefined>(() =>
        workspace.getFileContent(file)
    );
    const [version, setVersion] = useState<number>(0);

    useEffect(() => {
        if (keyboardContext) {
            keyboardContext.setKeyboardItems([]);
        }
    }, []);

    const saveFile = async (content: string) => {
        const language = workspace.inferLanguageFromFile(file);
        if (!language) throw new Error('Language not found');
        void trpcClient.lsp.textDocument.didChange.query({
            language: language,
            workspaceID: workspace.id,
            options: {
                textDocument: {
                    uri: 'file://' + path.resolve(await workspace.dir(), file),
                    version: version + 1,
                },
                contentChanges: [
                    {
                        text: content,
                    },
                ],
            },
        });
        setFileContent(content);
        setVersion((prev) => prev + 1);

        await workspace.saveFile(file, content);
    };

    useWatchFile(file, (content) => {
        setFileContent(content);
    });

    useCursorMove(file, (line, character) => {
        if (ref.current) {
            ref.current.setCursorPosition(line, character);
        }
    });

    let displayContent: Highlighted[] | undefined;
    if (fileContent !== undefined) {
        let highlighted;

        const extension = path.extname(file).slice(1) ?? undefined;

        if (extension && hljs.getLanguage(extension) !== undefined) {
            highlighted = hljs.highlight(fileContent, {
                language: extension,
            });
        } else {
            try {
                highlighted = hljs.highlightAuto(fileContent);
            } catch (e) {
                highlighted = hljs.highlight('plaintext', fileContent);
            }
        }

        displayContent = transformHtmlToHighlighted(highlighted.value);
    } else {
        displayContent = undefined;
    }

    if (editMode === 'refactor')
        return (
            <View className='bg-[rgb(30,30,30)] p-5 flex-1'>
                <GestureBasedEditor
                    fileContent={fileContent}
                    displayContent={displayContent}
                    file={file}
                    saveFile={saveFile}
                />

                <EditModeSwitcher />
            </View>
        );

    return (
        <View className='bg-[rgb(30,30,30)] p-5 flex-1'>
            <CustomKeyboardTextInput
                ref={ref}
                onSelectionChange={async (e) => {
                    ac.abort();
                    const { start } = e.nativeEvent.selection;
                    const dir = await workspace.dir();
                    const { col, line } = getPositionFromCharPos(
                        fileContent ?? '',
                        start
                    );

                    try {
                        const language = workspace.inferLanguageFromFile(file);
                        if (!language) {
                            console.info('Language not found');
                            return;
                        }

                        //@ts-ignore known issue with zod
                        const keyBoardItems: z.infer<
                            typeof completionItemSchema
                        >[] =
                            await trpcClient.lsp.textDocument.completion.query(
                                {
                                    language,
                                    workspaceID: workspace.id,
                                    options: {
                                        textDocument: {
                                            uri:
                                                'file://' +
                                                path.resolve(dir, file),
                                        },
                                        position: {
                                            line,
                                            character: col,
                                        },
                                        context: {
                                            triggerKind: 1,
                                        },
                                    },
                                    lastWord: getLastWordFromCharPos(
                                        fileContent ?? '',
                                        start
                                    ),
                                },
                                { signal: ac.signal }
                            );

                        if (keyboardContext)
                            keyboardContext.setKeyboardItems(keyBoardItems);
                    } catch (e) {
                        console.error(e);
                    }
                }}
                onChangeText={saveFile}
                keyboard={'CodeKeyboard'}
                children={
                    displayContent === undefined ? (
                        <Text className={'text-white'}>{fileContent}</Text>
                    ) : (
                        displayContent.map((part, index) => {
                            return (
                                <Text key={index} className={part.className}>
                                    {part.value}
                                </Text>
                            );
                        })
                    )
                }
                text={fileContent}
            />
            <EditModeSwitcher />
        </View>
    );
}
