import Modal, { CommonModalProps } from './Modal';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { trpc } from '../../utils/api';
import React from 'react';
// @ts-ignore - no types available
import path from 'react-native-path';

type CreateFile = {
    project: string;
    selectedDirectory: string;
};
type CreateFileModalProps = CommonModalProps & CreateFile;

function ModalContent({
    onClose,
    project,
    selectedDirectory,
}: {
    onClose: () => void;
} & CreateFile) {
    const utils = trpc.useUtils();
    const mutation = trpc.projects.createFile.useMutation();
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
            />

            <View className='flex-row justify-end'>
                <TouchableOpacity
                    onPress={() => {
                        if (newFileName === undefined || newFileName === '')
                            return;
                        mutation.mutate(
                            {
                                path: path.resolve(
                                    project,
                                    selectedDirectory,
                                    newFileName
                                ),
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
                    <Text className='text-white'>Create</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default function NewFileModal(props: CreateFileModalProps) {
    return (
        <Modal {...props} name='Create a new file'>
            <ModalContent
                onClose={props.onClose}
                project={props.project}
                selectedDirectory={props.selectedDirectory}
            />
        </Modal>
    );
}
