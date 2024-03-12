import React, { useState } from 'react';
import { TouchableOpacity, Text, View, TextInput } from 'react-native';
import { Link, Stack, router } from 'expo-router';
import AppModal from '../components/AppModal';
import { trpc } from '../utils/api';

export default function App() {
    const [isNewProjectModalVisible, setIsNewProjectModalVisible] =
        useState(false);
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
                    setIsNewProjectModalVisible(false);
                    router.push(`/projects/${projectName}`);
                },
            }
        );
    };

    return (
        <View>
            <Stack.Screen options={{ title: 'Home' }} />
            <Link href={'projects'} asChild>
                <TouchableOpacity>
                    <Text className='text-white'>Open a Project</Text>
                </TouchableOpacity>
            </Link>

            <AppModal
                visible={isNewProjectModalVisible}
                onClose={() => setIsNewProjectModalVisible(false)}
                children={
                    <View>
                        <Text className='text-white'>Create a new project</Text>
                        <TextInput
                            placeholder={'Project name'}
                            onChangeText={(text) => setProjectName(text.trim())}
                            style={{
                                color: 'white',
                            }}
                            placeholderTextColor={'gray'}
                        />

                        <TouchableOpacity onPress={createProject}>
                            <Text className='text-white'>Create</Text>
                        </TouchableOpacity>

                        {mutation.error && (
                            <Text className={'text-red-600'}>
                                {mutation.error.message}
                            </Text>
                        )}
                    </View>
                }
            />

            <TouchableOpacity onPress={() => setIsNewProjectModalVisible(true)}>
                <Text className='text-white'>New Project</Text>
            </TouchableOpacity>
        </View>
    );
}
