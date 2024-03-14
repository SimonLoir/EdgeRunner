import Modal, { CommonModalProps } from './Modal';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { trpc } from '../../utils/api';
import React, { useState } from 'react';
import useWorkspace from '../../utils/workspace/hooks/useWorkspace';

type OpenProjectModalProps = CommonModalProps;

function ModalContent({ onClose }: { onClose: () => void }) {
    const workspace = useWorkspace();
    const [projectName, setProjectName] = useState<string | undefined>(
        undefined
    );

    const mutation = trpc.projects.createDirectory.useMutation();

    const createProject = () => {
        if (projectName === undefined || projectName === '') return;
        mutation.mutate(
            { path: projectName },
            {
                onSuccess: () => {
                    onClose();
                    workspace.addProject(projectName);
                },
            }
        );
    };
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
                placeholder={'Project name'}
                onChangeText={(text) => setProjectName(text.trim())}
                placeholderTextColor={'gray'}
                className='text-white bg-[rgb(60,60,60)] p-4 rounded-lg'
                autoCapitalize={'none'}
            />

            <View className='flex-row justify-end'>
                <TouchableOpacity
                    onPress={createProject}
                    className='px-6 py-4 bg-[rgb(40,40,40)] items-center rounded-lg'
                >
                    <Text className='text-white'>Create</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default function NewProjectModal(props: OpenProjectModalProps) {
    return (
        <Modal {...props} name='Create a new project'>
            <ModalContent onClose={props.onClose} />
        </Modal>
    );
}
