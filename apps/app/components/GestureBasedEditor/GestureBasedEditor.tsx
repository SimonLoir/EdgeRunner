import { ScrollView, Text, View } from 'react-native';
import React from 'react';
import { Highlighted } from '../../utils/htmlToHighlightedTransformation';
import { trpcClient } from 'utils/api';

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

type HighlightedPosition = Highlighted & { line: number; column: number };

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

    const [isRenameModalVisible, setIsRenameModalVisible] =
        React.useState(false);
    const [selectedRenamePosition, setSelectedRenamePosition] = React.useState<{
        line: number;
        character: number;
    }>({ line: 0, character: 0 });
    const [selectedRenameToken, setSelectedRenameToken] =
        React.useState<string>('');
    const prepareRename = async (lineNb: number, columnNb: number) => {
        const language = await workspace.inferLanguageFromFile(file);
        if (!language) throw new Error('Language not found');

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
                        line: lineNb,
                        character: columnNb,
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
        function addLinetoLines(
            lines: HighlightedPosition[][],
            line: HighlightedPosition[],
            lineNb: number
        ) {
            if (line.length === 0) {
                line.push({
                    value: '',
                    className: '',
                    line: lineNb,
                    column: 0,
                });
            }
            lines.push(line);
        }

        if (displayContent === undefined) {
            return <Text className={'text-white'}>{fileContent}</Text>;
        }

        const lines: HighlightedPosition[][] = [];
        let lineNb = 0;
        let columnNb = 0;

        let line: HighlightedPosition[] = [];

        for (const token of displayContent) {
            if (token.value === '\n') {
                addLinetoLines(lines, line, lineNb);
                lineNb++;
                columnNb = 0;
                line = [];
            } else {
                line.push({
                    ...token,
                    line: lineNb,
                    column: columnNb,
                });
                columnNb += token.value.length;
            }
        }
        addLinetoLines(lines, line, lineNb);

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
                                                    part.line,
                                                    part.column
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
