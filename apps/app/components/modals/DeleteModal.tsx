import Modal, { CommonModalProps } from './Modal';
import { Text, TouchableOpacity, View } from 'react-native';
import { trpc } from '../../utils/api';
import React from 'react';

type DeleteFileOrDirectory = {
    selectedDirectory: string;
};
type DeleteDirectoryProps = CommonModalProps & DeleteFileOrDirectory;

function ModalContent({
    onClose,
    selectedDirectory,
}: {
    onClose: () => void;
} & DeleteFileOrDirectory) {
    const utils = trpc.useUtils();
    const mutation = trpc.projects.deleteSlug.useMutation();

    return (
        <View className={'gap-4'}>
            {mutation.error && (
                <View className='bg-red-700 p-4 rounded-lg'>
                    <Text className={'text-white'}>
                        {mutation.error.message}
                    </Text>
                </View>
            )}

            <TouchableOpacity
                onPress={() => {
                    mutation.mutate(
                        {
                            path: selectedDirectory,
                        },
                        {
                            onSuccess: () => {
                                void utils.projects.getDirectory.invalidate();
                                onClose();
                            },
                        }
                    );
                }}
                className='px-6 py-4 bg-red-700 items-center rounded-lg'
            >
                <Text className='text-white'>Delete {selectedDirectory}</Text>
            </TouchableOpacity>
        </View>
    );
}

export default function DeleteModal(props: DeleteDirectoryProps) {
    return (
        <Modal {...props} name='Are your sure you want to delete this item ?'>
            <ModalContent
                onClose={props.onClose}
                selectedDirectory={props.selectedDirectory}
            />
        </Modal>
    );
}
