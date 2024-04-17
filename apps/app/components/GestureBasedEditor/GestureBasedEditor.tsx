import { ScrollView, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Highlighted } from '../../utils/parseStringToObject';
import { trpcClient } from 'utils/api';
import getPositionFromCharPos from 'utils/getPositionFromCharPosition';
import useWorkspace from 'utils/workspace/hooks/useWorkspace';
// @ts-ignore Can't find type declaration for module 'react-native-path'
import path from 'react-native-path';
import { PrepareRenameOutputSchema } from '@repo/api/src/routes/lsp/textDocument/prepareRename';
import RenameTokenModal from 'components/modals/RenameTokenModal';
import { rangeSchema } from '@/schemas/exportedSchemas';
import z from 'zod';
import getCharPositionFromPosition from 'utils/getCharPositionFromPosition';

export default function GestureBasedEditor({
    file,
    fileContent,
    displayContent,
    saveFile,
}: {
    file: string;
    fileContent?: string;
    displayContent?: Highlighted[];
    saveFile: (content: string) => void;
}) {
    const workspace = useWorkspace();
    let line = 0;
    let column = 0;
    const displayContentWithInfo = displayContent?.map((part) => {
        const { value, className } = part;
        const startLine = line;
        const startColumn = column;
        let endLine = line;
        let endColumn;

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

    const [isRenameModalVisible, setIsRenameModalVisible] =
        React.useState(false);
    const [selectedRenamePosition, setSelectedRenamePosition] = React.useState<{
        line: number;
        character: number;
    }>({ line: 0, character: 0 });
    const [selectedRenameToken, setSelectedRenameToken] =
        React.useState<string>('');
    const prepareRename = async (charPos: number) => {
        const language = await workspace.inferLanguageFromFile(file);
        if (!language) throw new Error('Language not found');

        const { col: character, line } = getPositionFromCharPos(
            fileContent ?? '',
            charPos
        );

        const result: PrepareRenameOutputSchema =
            await trpcClient.lsp.textDocument.prepareRename.query({
                language: language,
                workspaceID: workspace.id,
                options: {
                    textDocument: {
                        uri:
                            'file://' +
                            path.resolve(await workspace.dir(), file),
                    },
                    position: {
                        line,
                        character,
                    },
                },
            });

        if (result === null || result === false) return;

        const resultAsRange = result as z.infer<typeof rangeSchema>;
        if (resultAsRange !== undefined) {
            setSelectedRenamePosition(resultAsRange.start);
            if (fileContent) {
                const startPosition = getCharPositionFromPosition(
                    fileContent,
                    resultAsRange.start
                );
                const endPosition = getCharPositionFromPosition(
                    fileContent,
                    resultAsRange.end
                );

                setSelectedRenameToken(
                    fileContent.slice(startPosition, endPosition)
                );
                setIsRenameModalVisible(true);
            }
        }
    };

    const renderFileContent = () => {
        if (displayContentWithInfo === undefined) {
            return <Text className={'text-white'}>{fileContent}</Text>;
        } else {
            return displayContentWithInfo.map((part, index) => {
                return (
                    <Text
                        key={index}
                        className={part.className}
                        onPress={() => {
                            console.log(part.value);

                            if (part.value.match(/\w/g)) {
                                prepareRename(
                                    displayContentWithInfo
                                        ?.slice(0, index)
                                        .map((part) => part.value)
                                        .join('').length
                                );
                            }
                        }}
                    >
                        {part.value}
                    </Text>
                );
            });
        }
    };

    return (
        <>
            <RenameTokenModal
                visible={isRenameModalVisible}
                onClose={() => setIsRenameModalVisible(false)}
                token={selectedRenameToken}
                position={selectedRenamePosition}
                file={file}
            />

            <ScrollView className='flex-1'>
                <Text className='text-white p-0 m-0'>
                    {renderFileContent()}
                </Text>
            </ScrollView>
            <TouchableOpacity
                onPress={async () => {
                    const d =
                        await trpcClient.lsp.textDocument.formatting.query({
                            language: 'typescript',
                            workspaceID: workspace.id,
                            options: {
                                textDocument: {
                                    uri:
                                        'file://' +
                                        path.resolve(
                                            await workspace.dir(),
                                            file
                                        ),
                                },
                                options: {
                                    insertFinalNewline: true,
                                    tabSize: 4,
                                    insertSpaces: true,
                                    trimFinalNewlines: true,
                                    trimTrailingWhitespace: true,
                                },
                            },
                        });
                    workspace.notifyContentChange(file, d);
                }}
            >
                <Text>Reformat code</Text>
            </TouchableOpacity>
        </>
    );
}
