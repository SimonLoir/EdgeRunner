import { Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { trpc } from '../../../utils/api';

export default function Project() {
    const { project } = useLocalSearchParams();

    if (project === undefined) {
        throw new Error('project is required');
    }
    if (typeof project !== 'string') {
        throw new Error('project must be a string');
    }

    useEffect(() => {
        void (async () => {
            const data = await trpc.projects.getDirectory.query({
                path: project,
            });
            console.log(data);
        })();
    }, [project]);

    return (
        <View>
            <Stack.Screen options={{ title: 'Project' }} />
            <Text className={'text-white'}>{project}</Text>
        </View>
    );
}
