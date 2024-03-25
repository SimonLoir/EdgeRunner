import { ActivityIndicator, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
// @ts-ignore Can't find type declaration for module 'react-native-path'
import path from 'react-native-path';

import hljs from 'highlight.js';
import 'highlight.js/styles/monokai.css';
import { trpc, trpcClient } from '../utils/api';
import CustomKeyboardTextInput from './CustomKeyboardTextInput';
import useWorkspace from '../utils/workspace/hooks/useWorkspace';
import { Highlighted, parseStringToObject } from '../utils/parseStringToObject';
import getPositionFromCharPos from '../utils/getPositionFromCharPosition';

export default function FileEditor({ file }: { file: string }) {
    const workspace = useWorkspace();

    const [fileContent, setFileContent] = useState<string | undefined>(
        undefined
    );

    const { data: fileInfo, isLoading } = trpc.projects.getFile.useQuery({
        path: file,
    });

    const mutation = trpc.projects.saveFile.useMutation();

    const saveFile = () => {
        if (fileInfo) {
            mutation.mutate({
                path: file,
                content: fileContent ?? fileInfo.content,
            });
        }
    };

    useEffect(() => {
        if (!fileInfo) return;
        void (async () => {
            try {
                await workspace.openFile(file, fileInfo.content);
            } catch (e) {
                console.error(e);
            }
        })();

        setFileContent(fileInfo.content);
        return () => {
            void workspace.closeFile(file);
        };
    }, [fileInfo]);

    if (!fileInfo || isLoading) {
        return (
            <View>
                <ActivityIndicator color='#FFFFFF' />
            </View>
        );
    }

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

                        const x = await trpcClient.lsp.textDocument.hover.query(
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
                    } catch (e) {
                        console.error(e);
                    }
                }}
                onChangeText={setFileContent}
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
