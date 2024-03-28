import { Text, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
// @ts-ignore Can't find type declaration for module 'react-native-path'
import path from 'react-native-path';

import hljs from 'highlight.js';
import 'highlight.js/styles/monokai.css';
import { trpcClient } from '../utils/api';
import CustomKeyboardTextInput from './CustomKeyboardTextInput';
import useWorkspace from '../utils/workspace/hooks/useWorkspace';
import { Highlighted, parseStringToObject } from '../utils/parseStringToObject';
import getPositionFromCharPos from '../utils/getPositionFromCharPosition';
import getLastWordFromCharPos from 'utils/getLastWordFromCharPos';
import { z } from 'zod';
import { completionItemSchema } from '@/schemas/exportedSchemas';
import { KeyboardContext } from '../utils/keyboardContext';

export default function FileEditor({ file }: { file: string }) {
    const workspace = useWorkspace();
    const keyboardContext = useContext(KeyboardContext);
    const [fileContent, setFileContent] = useState<string | undefined>(() =>
        workspace.getFileContent(file)
    );

    const saveFile = (content: string) => {
        setFileContent(content);
        void workspace.saveFile(file, content);
    };

    let displayContent: Highlighted[] | undefined;
    if (fileContent !== undefined) {
        let highlighted;

        const extension = path.extname(file).slice(1) ?? undefined;

        if (extension && hljs.getLanguage(extension) !== undefined) {
            highlighted = hljs.highlight(fileContent, {
                language: extension,
            });
        } else {
            highlighted = hljs.highlightAuto(fileContent);
        }

        displayContent = parseStringToObject(highlighted.value);
    } else {
        displayContent = undefined;
    }

    return (
        <View className='bg-[rgb(30,30,30)] p-5 flex-1'>
            <CustomKeyboardTextInput
                onSelectionChange={async (e) => {
                    const { start } = e.nativeEvent.selection;
                    const dir =
                        await trpcClient.projects.getProjectDirectory.query();
                    const { col, line } = getPositionFromCharPos(
                        fileContent ?? '',
                        start
                    );
                    console.log({ col, line });
                    try {
                        const language = workspace.inferLanguageFromFile(file);
                        if (!language) throw new Error('Language not found');

                        /*const x = await trpcClient.lsp.textDocument.hover.query(
                            {
                                language,
                                workspaceID: workspace.id,
                                options: {
                                    textDocument: {
                                        uri:
                                            'file://' + path.resolve(dir, file),
                                    },
                                    position: {
                                        line,
                                        character: col,
                                    },
                                },
                            }
                        );
                        console.log(x, 'hover', { start });
                        */
                        const keyBoardItems =
                            await trpcClient.lsp.textDocument.completion.query({
                                language,
                                workspaceID: workspace.id,
                                options: {
                                    textDocument: {
                                        uri:
                                            'file://' + path.resolve(dir, file),
                                    },
                                    position: {
                                        line,
                                        character: col,
                                    },
                                    context: {
                                        triggerKind: 1,
                                    },
                                },
                            });

                        const completionItems: z.infer<
                            typeof completionItemSchema
                        >[] = [];
                        if (keyBoardItems !== null) {
                            if (keyBoardItems instanceof Array) {
                                completionItems.push(...keyBoardItems);
                            } else {
                                completionItems.push(...keyBoardItems.items);
                            }
                            const sortedItems: z.infer<
                                typeof completionItemSchema
                            >[] = sortCompletionItems(
                                completionItems,
                                getLastWordFromCharPos(fileContent ?? '', start)
                            );

                            keyboardContext.setKeyboardItems(sortedItems);
                        }
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
        </View>
    );
}

function sortCompletionItems(
    completionItems: z.infer<typeof completionItemSchema>[],
    currentWord?: string
) {
    const filterItems = completionItems.filter((item) => {
        if (currentWord === undefined) {
            return true;
        }
        return item.label.startsWith(currentWord);
    });
    const sortedItems = filterItems.sort((a, b) => {
        if (
            a.sortText === undefined ||
            b.sortText === undefined ||
            a.sortText === b.sortText
        ) {
            return a.label.localeCompare(b.label);
        }
        return a.sortText.localeCompare(b.sortText);
    });

    return sortedItems;
}
