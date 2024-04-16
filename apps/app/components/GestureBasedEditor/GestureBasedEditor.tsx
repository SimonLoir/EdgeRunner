import { ScrollView, Text } from 'react-native';
import React from 'react';
import { Highlighted } from '../../utils/parseStringToObject';
import useWorkspace from '../../utils/workspace/hooks/useWorkspace';
import { trpcClient } from '../../utils/api';
// @ts-ignore Can't find type declaration for module 'react-native-path'
import path from 'react-native-path';

export default function GestureBasedEditor({
    fileContent,
    displayContent,
    file,
}: {
    fileContent?: string;
    displayContent?: Highlighted[];
    file: string;
}) {
    const workspace = useWorkspace();
    let line = 0;
    let column = 0;
    const displayContentWithInfo = displayContent?.map((part) => {
        const { value, className } = part;
        const startLine = line;
        const startColumn = column;
        let endLine = line;
        let endColumn = 0;

        // split value by new line
        const lines = value.split(/\r?\n/);

        // if there is more than one line
        if (lines.length > 1) {
            endLine = startLine + lines.length - 1;
            endColumn = lines[lines.length - 1].length;
        } else {
            endColumn = startColumn + value.length;
        }

        line = endLine;
        column = endColumn;
        return {
            value,
            className,
            startLine,
            startColumn,
            endLine,
            endColumn,
        };
    });
    return (
        <>
            <ScrollView className='flex-1'>
                <Text className='text-white p-0 m-0'>
                    {displayContentWithInfo === undefined ? (
                        <Text className={'text-white'}>{fileContent}</Text>
                    ) : (
                        displayContentWithInfo.map((part, index) => {
                            return (
                                <Text
                                    key={index}
                                    className={part.className}
                                    onPress={async () => {
                                        console.info(part);
                                        const language =
                                            workspace.inferLanguageFromFile(
                                                file
                                            );
                                        if (!language) return;
                                        const d =
                                            await trpcClient.lsp.textDocument.codeAction.query(
                                                {
                                                    language,
                                                    workspaceID: workspace.id,
                                                    options: {
                                                        context: {
                                                            diagnostics: [],
                                                        },
                                                        textDocument: {
                                                            uri:
                                                                'file://' +
                                                                path.resolve(
                                                                    await workspace.dir(),
                                                                    file
                                                                ),
                                                        },
                                                        range: {
                                                            start: {
                                                                line: part.startLine,
                                                                character:
                                                                    part.startColumn,
                                                            },
                                                            end: {
                                                                line: part.endLine,
                                                                character:
                                                                    part.endColumn,
                                                            },
                                                        },
                                                    },
                                                }
                                            );
                                        console.info(
                                            JSON.stringify(d, null, 2)
                                        );
                                    }}
                                >
                                    {part.value}
                                </Text>
                            );
                        })
                    )}
                </Text>
            </ScrollView>
        </>
    );
}
