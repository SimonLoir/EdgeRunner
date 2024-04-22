import { TextInput, View, Text, TouchableOpacity } from 'react-native';
import Modal, { CommonModalProps } from './Modal';
import React from 'react';
import { trpc, trpcClient } from 'utils/api';
import useWorkspace from 'utils/workspace/hooks/useWorkspace';
// @ts-ignore Can't find type declaration for module 'react-native-path'
import path from 'react-native-path';

type RenameTokens = {
    token: string;
    position: { line: number; character: number };
    file: string;
};
type RenameTokenModalProps = CommonModalProps & RenameTokens;

function ModalContent({
    onClose,
    token,
    position,
    file,
}: {
    onClose: () => void;
} & RenameTokens) {
    const workspace = useWorkspace();
    const utils = trpc.useUtils();
    const [newTokenName, setNewTokenName] = React.useState<undefined | string>(
        token
    );

    const rename = async (newName: string) => {
        console.log('rename', newName, file, position);

        const language = await workspace.inferLanguageFromFile(file);
        if (!language) throw new Error('Language not found');

        const result = await trpcClient.lsp.textDocument.rename.query({
            language,
            workspaceID: workspace.id,
            options: {
                newName: newName,
                textDocument: {
                    uri: 'file://' + path.resolve(await workspace.dir(), file),
                },
                position,
            },
        });

        console.log('result', result);

        const dir = await workspace.dir();

        if (result.length !== 0) {
            void utils.projects.getDirectory.invalidate();
            for (const file of result) {
                workspace.notifyContentChange(
                    file.file.replace(dir + '/', ''),
                    file.content
                );
            }
        }
        onClose();
    };

    return (
        <View className={'gap-4'}>
            <TextInput
                placeholder={'File name'}
                onChangeText={(text) => setNewTokenName(text.trim())}
                placeholderTextColor={'gray'}
                className='text-white bg-[rgb(60,60,60)] p-4 rounded-lg'
                autoCapitalize={'none'}
                defaultValue={token}
            />
            <View className='flex-row justify-end'>
                <TouchableOpacity
                    onPress={() => {
                        console.log('newTokenName', newTokenName);

                        if (newTokenName === undefined || newTokenName === '')
                            return;
                        void rename(newTokenName);
                    }}
                    className='px-6 py-4 bg-[rgb(40,40,40)] items-center rounded-lg'
                >
                    <Text className='text-white'>Rename</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default function RenameTokenModal(props: RenameTokenModalProps) {
    return (
        <Modal {...props} name='Rename'>
            <ModalContent
                onClose={props.onClose}
                token={props.token}
                position={props.position}
                file={props.file}
            />
        </Modal>
    );
}
