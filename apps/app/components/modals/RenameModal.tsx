import Modal, { CommonModalProps } from './Modal';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { trpc } from '../../utils/api';
import React from 'react';

type RenameFileOrDirectory = {
    selectedDirectory: string;
};
type RenameFileOrDirectoryProps = CommonModalProps & RenameFileOrDirectory;

function ModalContent({
    onClose,
    selectedDirectory,
}: {
    onClose: () => void;
} & RenameFileOrDirectory) {
    const utils = trpc.useUtils();
    const mutation = trpc.projects.renameSlug.useMutation();
    const [newFileName, setNewFileName] = React.useState('');

    return (
        <View className={'gap-4'}>
            {mutation.error && (
                <View className='bg-red-700 p-4 rounded-lg'>
                    <Text className={'text-white'}>
                        {mutation.error.message}
                    </Text>
                </View>
            )}

            <TextInput
                placeholder={'File name'}
                onChangeText={(text) => setNewFileName(text.trim())}
                placeholderTextColor={'gray'}
                className='text-white bg-[rgb(60,60,60)] p-4 rounded-lg'
                autoCapitalize={'none'}
                defaultValue={selectedDirectory.split('/').pop()}
            />

            <View className='flex-row justify-end'>
                <TouchableOpacity
                    onPress={() => {
                        if (newFileName === undefined || newFileName === '')
                            return;
                        mutation.mutate(
                            {
                                path: selectedDirectory,
                                name: newFileName,
                            },
                            {
                                onSuccess: () => {
                                    void utils.projects.getDirectory.invalidate();
                                    onClose();
                                },
                            }
                        );
                    }}
                    className='px-6 py-4 bg-[rgb(40,40,40)] items-center rounded-lg'
                >
                    <Text className='text-white'>Rename</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default function RenameModal(props: RenameFileOrDirectoryProps) {
    return (
        <Modal {...props} name='Rename'>
            <ModalContent
                onClose={props.onClose}
                selectedDirectory={props.selectedDirectory}
            />
        </Modal>
    );
}
