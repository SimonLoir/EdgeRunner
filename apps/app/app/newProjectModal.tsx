import { Link, router, Stack } from 'expo-router';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { trpc } from '../utils/api';
import { useState } from 'react';

export default function NewProjectModal() {
    const [projectName, setProjectName] = useState<string | undefined>(
        undefined
    );
    const mutation = trpc.projects.createDirectory.useMutation();

    const createProject = () => {
        if (projectName === undefined) return;
        mutation.mutate({ path: projectName });
    };

    return (
        <View>
            <Stack.Screen
                options={{ title: 'New Project', presentation: 'modal' }}
            />
            <Text className='text-white'>Create a new project</Text>
            <TextInput
                placeholder={'Project name'}
                onChangeText={(text) => setProjectName(text)}
                style={{
                    color: 'white',
                }}
                placeholderTextColor={'gray'}
            />

            <TouchableOpacity onPress={createProject}>
                <Text className='text-white'>Create</Text>
            </TouchableOpacity>
        </View>
    );
}
