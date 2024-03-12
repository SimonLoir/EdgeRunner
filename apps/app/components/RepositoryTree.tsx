import { Directory, nameSchema } from '@repo/types/Files';
import {
    GestureResponderEvent,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React from 'react';
import { z } from 'zod';
import { Link } from 'expo-router';
// @ts-ignore Can't find type declaration for module 'react-native-path'
import path from 'react-native-path';

type directoryComponentProps = {
    directory: Directory;
    project: string;
    level: number;
    onLongPress: (
        event: GestureResponderEvent,
        directory: string,
        isDirectory: boolean
    ) => void;
};

export function RepositoryTree({
    directory,
    project,
    level,
    onLongPress,
}: directoryComponentProps) {
    const treeMargin = 20;
    return (
        <View key={directory.path}>
            <View className='flex-row justify-start items-center'>
                <TouchableOpacity
                    onLongPress={(event) =>
                        onLongPress(event, directory.path, true)
                    }
                >
                    <Text
                        className={'text-white'}
                        style={{ marginLeft: level * treeMargin }}
                    >
                        {directory.path !== '' ? directory.path : project}
                    </Text>
                </TouchableOpacity>
            </View>

            {generateUiTree(
                directory.path,
                directory.children,
                level + 1,
                project,
                onLongPress
            )}
        </View>
    );
}

function generateUiTree(
    parentPath: string,
    children: (z.infer<typeof nameSchema> | Directory)[],
    level: number,
    project: string,
    onLongPress: (
        event: GestureResponderEvent,
        directory: string,
        isDirectory: boolean
    ) => void
) {
    return children.map((slug, index) => {
        // if it's a file
        if (nameSchema.safeParse(slug).success) {
            const fileSlug = slug as z.infer<typeof nameSchema>;
            return (
                <View className='flex-row justify-start items-center'>
                    <Link
                        href={{
                            pathname: 'projects/[project]/[path]',
                            params: {
                                project: project,
                                path:
                                    parentPath === ''
                                        ? fileSlug.name
                                        : path.resolve(
                                              parentPath,
                                              fileSlug.name
                                          ),
                            },
                        }}
                        asChild
                        key={fileSlug.name + index}
                    >
                        <TouchableOpacity
                            style={{ marginLeft: level * 20 }}
                            onLongPress={(event) =>
                                onLongPress(
                                    event,
                                    parentPath === ''
                                        ? fileSlug.name
                                        : path.resolve(
                                              parentPath,
                                              fileSlug.name
                                          ),
                                    false
                                )
                            }
                        >
                            <Text className={'text-white'}>
                                {fileSlug.name}
                            </Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            );
        }
        // if it's a directory
        else {
            const directorySlug = slug as Directory;
            return RepositoryTree({
                directory: directorySlug,
                project,
                level,
                onLongPress,
            });
        }
    });
}
