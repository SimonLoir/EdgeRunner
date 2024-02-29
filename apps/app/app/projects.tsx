import { router } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { trpc } from '../utils/api';

export default function ProjectsModal() {
    const [projects, setProjects] = useState<string[]>([]);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    useEffect(() => {
        void (async () => {
            const data = await trpc.projects.getProjects.query();
            setProjects(data);
        })();
    }, []);

    return (
        <View>
            {projects.map((project) => (
                <TouchableOpacity
                    key={project}
                    onPress={() => {
                        setSelectedProject(project);
                    }}
                >
                    <Text className={'text-white'}>{project}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}
