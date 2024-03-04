import { Link, Stack } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { trpc } from '../../utils/api';

export default function Projects() {
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
        return <Text>Loading...</Text>;
    }

    return (
        <View>
            <Stack.Screen options={{ title: 'Projects' }} />
            {projects.map((project) => (
                <Link
                    href={{
                        pathname: 'projects/[project]',
                        params: { project: project },
                    }}
                    asChild
                    key={project}
                >
                    <TouchableOpacity key={project}>
                        <Text className={'text-white'}>{project}</Text>
                    </TouchableOpacity>
                </Link>
            ))}
        </View>
    );
}
