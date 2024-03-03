import { Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
// @ts-ignore Can't find type declaration for module 'react-native-path'
import path from 'react-native-path';
import { trpc } from '../../../../utils/api';

export default function File() {
    const { project, path: file } = useLocalSearchParams();
    const [fileContent, setFileContent] = useState<string | undefined>(
        undefined
    );
    useEffect(() => {
        console.log(project, file);
        console.log(path.resolve(project, file));
        void (async () => {
            const data = await trpc.projects.getFile.query({
                path: path.resolve(project, file),
            });
            setFileContent(data.content);
        })();
    }, []);

    if (project === undefined) {
        throw new Error('project is required');
    }
    if (typeof project !== 'string') {
        throw new Error('project must be a string');
    }
    if (file === undefined) {
        throw new Error('file is required');
    }
    if (typeof file !== 'string') {
        throw new Error('file must be a string');
    }

    return (
        <View>
            <Stack.Screen options={{ title: path.basename(file) }} />
            <Text className={'text-white'}>{fileContent ?? 'Loading...'}</Text>
        </View>
    );
}
