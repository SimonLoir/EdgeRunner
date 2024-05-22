import { ScrollView, Text, View } from 'react-native';
import React from 'react';
import { Highlighted } from '../../utils/htmlToHighlightedTransformation';
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
import FormatButton from './FormatButton';
import Token from './Token';

export default function GestureBasedEditor({
    file,
    fileContent,
    displayContent,
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
            const indexes = [];
            let i = -1;

            // Get all indexes of new lines character in the displayContentWithInfo array
            while (
                (i = displayContentWithInfo
                    .map((part) => part.value)
                    .indexOf('\n', i + 1)) !== -1
            ) {
                indexes.push(i);
            }

            const lines = [];
            // Split the content into lines
            for (let i = 0; i <= indexes.length; i++) {
                if (i === 0) {
                    if (indexes[i] === 0) {
                        lines.push([{ value: '', className: '' }]);
                    } else {
                        lines.push(displayContentWithInfo.slice(0, indexes[i]));
                    }
                } else {
                    lines.push(
                        displayContentWithInfo.slice(indexes[i - 1], indexes[i])
                    );
                }
            }

            // Get the lenght of each line
            const linesCharCount = lines.map((line) =>
                line.map((part) => part.value.length).reduce((a, b) => a + b, 0)
            );

            return (
                <>
                    {lines.map((line, index) => {
                        return (
                            <View
                                key={index}
                                className='flex-row'
                                style={{
                                    marginBottom: -3.4,
                                }}
                            >
                                {line.map((part, partIndex) => {
                                    return (
                                        <Token
                                            key={
                                                index.toString() +
                                                partIndex.toString()
                                            }
                                            value={part.value}
                                            className={
                                                part.className &&
                                                part.className !== ''
                                                    ? part.className
                                                    : 'text-white'
                                            }
                                            onRename={() => {
                                                if (part.value.match(/\w/g)) {
                                                    void prepareRename(
                                                        linesCharCount
                                                            .slice(0, index)
                                                            .reduce(
                                                                (a, b) => a + b,
                                                                0
                                                            ) +
                                                            line
                                                                .slice(
                                                                    0,
                                                                    partIndex
                                                                )
                                                                .map(
                                                                    (part) =>
                                                                        part
                                                                            .value
                                                                            .length
                                                                )
                                                                .reduce(
                                                                    (a, b) =>
                                                                        a + b,
                                                                    0
                                                                )
                                                    );
                                                }
                                            }}
                                        />
                                    );
                                })}
                            </View>
                        );
                    })}
                </>
            );
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
                <View className='text-white p-0 m-0 flex-col'>
                    {renderFileContent()}
                </View>
            </ScrollView>
            <FormatButton file={file} />
        </>
    );
}
