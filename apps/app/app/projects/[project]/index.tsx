import { Text, TouchableOpacity, View } from 'react-native';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { trpc } from '../../../utils/api';
import { Directory, nameSchema } from '@repo/types/Files';
import { z } from 'zod';
// @ts-ignore Can't find type declaration for module 'react-native-path'
import path from 'react-native-path';

export default function Project() {
    const { project } = useLocalSearchParams();
    const [directoryTree, setDirectoryTree] = useState<Directory | undefined>(
        undefined
    );
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
            setDirectoryTree(data);
        })();
    }, [project]);

    const generateUiTree = (
        parentPath: string,
        children: (z.infer<typeof nameSchema> | Directory)[],
        level = 1 as number
    ) => {
        return children.map((file) => {
            if (nameSchema.safeParse(file).success) {
                file = file as z.infer<typeof nameSchema>;
                return (
                    <Link
                        href={{
                            pathname: 'projects/[project]/[path]',
                            params: {
                                project: project,
                                path:
                                    parentPath === ''
                                        ? file.name
                                        : path.resolve(parentPath, file.name),
                            },
                        }}
                        asChild
                    >
                        <TouchableOpacity>
                            <Text
                                className={'text-white'}
                                style={{ marginLeft: level * 20 }}
                            >
                                {file.name}
                            </Text>
                        </TouchableOpacity>
                    </Link>
                );
            } else {
                file = file as Directory;
                return (
                    <View>
                        <Text
                            className={'text-white'}
                            style={{ marginLeft: level * 20 }}
                        >
                            {file.path}
                        </Text>
                        {generateUiTree(file.path, file.children, level + 1)}
                    </View>
                );
            }
        });
    };

    return (
        <View>
            <Stack.Screen options={{ title: 'Project' }} />
            <Text>Project: {project}</Text>
            {directoryTree !== undefined &&
                generateUiTree('', directoryTree.children)}
        </View>
    );
}
