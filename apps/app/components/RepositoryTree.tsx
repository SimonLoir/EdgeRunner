import { Directory, nameSchema } from '@repo/types/Files';
import {
    GestureResponderEvent,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React from 'react';
import { z } from 'zod';
// @ts-ignore Can't find type declaration for module 'react-native-path'
import path from 'react-native-path';
import useWorkspace from '../utils/workspace/hooks/useWorkspace';
import Workspace from '../utils/workspace/Workspace';
import { trpcClient } from '../utils/api';

type repositoryTreeProps = {
    directory: Directory;
    project: string;
    level: number;
    onLongPress: (
        event: GestureResponderEvent,
        directory: string,
        isDirectory: boolean
    ) => void;
};

export default function RepositoryTree({
    directory,
    project,
    level,
    onLongPress,
}: repositoryTreeProps) {
    const treeMargin = 20;
    const directoryName = path.basename(directory.path.replace(/\\/g, '/'));
    const workspace = useWorkspace();
    return (
        <View key={directoryName}>
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
                        {directoryName}
                    </Text>
                </TouchableOpacity>
            </View>

            {generateUiTree(
                directory.path,
                directory.children,
                level + 1,
                project,
                onLongPress,
                workspace
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
    ) => void,
    workspace: Workspace
) {
    return children.map((slug) => {
        // if it's a file
        if (nameSchema.safeParse(slug).success) {
            const fileSlug = slug as z.infer<typeof nameSchema>;

            return (
                <View
                    className='flex-row justify-start items-center'
                    key={path.resolve(parentPath, fileSlug.name)}
                >
                    <TouchableOpacity
                        style={{ marginLeft: level * 20 }}
                        onLongPress={(event) =>
                            onLongPress(
                                event,
                                parentPath === ''
                                    ? fileSlug.name
                                    : path.resolve(parentPath, fileSlug.name),
                                false
                            )
                        }
                        onPress={async () => {
                            await workspace.openFile(
                                path.resolve(parentPath, fileSlug.name)
                            );
                        }}
                    >
                        <Text className={'text-white'}>{fileSlug.name}</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        // if it's a directory
        else {
            const directorySlug = slug as Directory;

            return (
                <View key={directorySlug.path}>
                    <RepositoryTree
                        directory={directorySlug}
                        project={project}
                        level={level}
                        onLongPress={onLongPress}
                    />
                </View>
            );
        }
    });
}
