import { Text, TextInput, TouchableOpacity, View } from 'react-native';
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

    if (fileContent === undefined) {
        return <Text className={'text-white'}>Loading...</Text>;
    }
    return (
        <View>
            <Stack.Screen
                options={{
                    title: path.basename(file),
                    headerRight: () => (
                        <View>
                            <TouchableOpacity
                                onPress={async () => {
                                    await trpc.projects.saveFile.mutate({
                                        path: path.resolve(project, file),
                                        content: fileContent,
                                    });
                                }}
                            >
                                <Text className={'text-white'}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    ),
                }}
            />
            {fileContent === undefined ? (
                <Text className={'text-white'}>Loading...</Text>
            ) : (
                <TextInput
                    className={'text-white'}
                    onChangeText={setFileContent}
                    defaultValue={fileContent}
                    multiline={true}
                />
            )}
        </View>
    );
}
