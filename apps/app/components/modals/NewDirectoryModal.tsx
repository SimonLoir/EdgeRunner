import Modal, { CommonModalProps } from './Modal';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { trpc } from '../../utils/api';
import React from 'react';
// @ts-ignore - no types available
import path from 'react-native-path';

type CreateDirectory = {
    selectedDirectory: string;
};
type CreateDirectoryModalProps = CommonModalProps & CreateDirectory;

function ModalContent({
    onClose,
    selectedDirectory,
}: {
    onClose: () => void;
} & CreateDirectory) {
    const utils = trpc.useUtils();
    const mutation = trpc.projects.createDirectory.useMutation();
    const [newDirectoryName, setNewDirectoryName] = React.useState('');

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
                placeholder={'Directory name'}
                onChangeText={(text) => setNewDirectoryName(text.trim())}
                placeholderTextColor={'gray'}
                className='text-white bg-[rgb(60,60,60)] p-4 rounded-lg'
                autoCapitalize={'none'}
            />

            <View className='flex-row justify-end'>
                <TouchableOpacity
                    onPress={() => {
                        if (
                            newDirectoryName === undefined ||
                            newDirectoryName === ''
                        )
                            return;
                        mutation.mutate(
                            {
                                path: path.resolve(
                                    selectedDirectory,
                                    newDirectoryName
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

export default function NewDirectoryModal(props: CreateDirectoryModalProps) {
    return (
        <Modal {...props} name='Create a new directory'>
            <ModalContent
                onClose={props.onClose}
                selectedDirectory={props.selectedDirectory}
            />
        </Modal>
    );
}
