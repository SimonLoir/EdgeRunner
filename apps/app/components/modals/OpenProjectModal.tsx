import Modal, { CommonModalProps } from './Modal';
import {
    ActivityIndicator,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { trpc } from '../../utils/api';
import React from 'react';
import useWorkspace from '../../utils/workspace/hooks/useWorkspace';

type OpenProjectModalProps = CommonModalProps;

function ModalContent({ onClose }: { onClose: () => void }) {
    const workspace = useWorkspace();
    const {
        isLoading,
        data: projects,
        error,
    } = trpc.projects.getProjects.useQuery();

    if (error)
        return (
            <View>
                <Text>Error: {error.message}</Text>
            </View>
        );

    if (isLoading || !projects) {
        return (
            <View>
                <ActivityIndicator color='#FFFFFF' />
            </View>
        );
    }
    return (
        <>
            <FlatList
                data={projects}
                renderItem={({ item: project }) => (
                    <View className='flex-row justify-between py-3 items-center'>
                        <Text className='text-white'>{project}</Text>
                        <View className='flex-row gap-2'>
                            <TouchableOpacity
                                className='px-6 py-4 bg-[rgb(40,40,40)] items-center rounded-lg'
                                onPress={() => {
                                    onClose();
                                    workspace.addProject(project);
                                }}
                            >
                                <Text className='text-white'>
                                    Add to workspace
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className='px-6 py-4 bg-[rgb(40,40,40)] items-center rounded-lg'
                                onPress={() => {
                                    onClose();
                                    workspace.addProject(project, {
                                        unique: true,
                                    });
                                }}
                            >
                                <Text className='text-white'>
                                    Open this project
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            ></FlatList>
        </>
    );
}

export default function OpenProjectModal(props: OpenProjectModalProps) {
    return (
        <Modal {...props} name='Open a project'>
            <ModalContent onClose={props.onClose} />
        </Modal>
    );
}
