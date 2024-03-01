import { Link, router, Stack } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { trpc } from '../../utils/api';

export default function Projects() {
    const [projects, setProjects] = useState<string[]>([]);
    useEffect(() => {
        void (async () => {
            const data = await trpc.projects.getProjects.query();
            setProjects(data);
        })();
    }, []);

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
