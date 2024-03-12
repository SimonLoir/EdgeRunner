import Modal, { CommonModalProps } from './Modal';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { trpc } from '../../utils/api';
import React from 'react';
import useWorkspace from '../../utils/workspace/hooks/useWorkspace';

type OpenProjectModalProps = CommonModalProps;

export default function OpenProjectModal(props: OpenProjectModalProps) {
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
        <Modal {...props} name='Open a project'>
            <View>
                {projects.map((project) => (
                    <TouchableOpacity
                        key={project}
                        onPress={() => {
                            props.onClose();
                            workspace.addProject(project);
                        }}
                    >
                        <Text className={'text-white'}>{project}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </Modal>
    );
}
