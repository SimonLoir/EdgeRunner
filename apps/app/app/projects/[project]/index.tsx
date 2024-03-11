import {
    ActivityIndicator,
    GestureResponderEvent,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { trpc } from '../../../utils/api';
import { Directory, nameSchema } from '@repo/types/Files';
import { z } from 'zod';
// @ts-ignore Can't find type declaration for module 'react-native-path'
import path from 'react-native-path';
import Icon from 'react-native-vector-icons/AntDesign';
import { Menu } from 'react-native-paper';
import ClickableMenu from '../../../components/ClickableMenu';
import AppModal from '../../../components/AppModal';

export default function Project() {
    const utils = trpc.useUtils();
    const { project } = useLocalSearchParams();
    const [visible, setVisible] = React.useState(false);
    const [menuAnchor, setMenuAnchor] = React.useState<{
        x: number;
        y: number;
    }>({
        x: 0,
        y: 0,
    });
    const [parentPosition, setParentPosition] = React.useState<{
        x: number;
        y: number;
    }>({
        x: 0,
        y: 0,
    });
    const [selectedDirectory, setSelectedDirectory] = React.useState('');
    const [newFileName, setNewFileName] = React.useState('');
    const [newDirectoryName, setNewDirectoryName] = React.useState('');
    const [isNewFileModalVisible, setIsNewFileModalVisible] =
        React.useState(false);
    const [isNewDirectoryModalVisible, setIsNewDirectoryModalVisible] =
        React.useState(false);

    const newFileMutation = trpc.projects.createFile.useMutation();
    const newDirectoryMutation = trpc.projects.createDirectory.useMutation();
    const deleteSlug = trpc.projects.deleteSlug.useMutation();

    useEffect(() => {}, [isNewDirectoryModalVisible, isNewFileModalVisible]);
    const onIconPress = (event: GestureResponderEvent, directory: string) => {
        event.currentTarget.measure((x, y, width, height, pageX, pageY) => {
            setMenuAnchor({
                x: pageX,
                y: pageY - parentPosition.y,
            });
        });
        setVisible(true);
        setSelectedDirectory(directory);
    };
    if (project === undefined) {
        throw new Error('project is required');
    }
    if (typeof project !== 'string') {
        throw new Error('project must be a string');
    }
    const { data: directoryTree, isLoading } =
        trpc.projects.getDirectory.useQuery({
            path: project,
        });

    if (isLoading)
        return (
            <View>
                <Stack.Screen options={{ title: project }} />
                <ActivityIndicator color='#FFFFFF' />
            </View>
        );

    const directoryComponent = (directory: Directory, level: number) => {
        return (
            <View key={directory.path}>
                <View className='flex-row justify-start items-center'>
                    <Text
                        className={'text-white'}
                        style={{ marginLeft: level * 20 }}
                    >
                        <Text>{directory.path}</Text>

                        <TouchableOpacity
                            onPress={(event) =>
                                onIconPress(event, directory.path)
                            }
                        >
                            <Text className={'text-white ml-[5]'}>
                                <Icon
                                    name='pluscircleo'
                                    style={{
                                        padding: 10,
                                        borderRadius: 50,
                                        textAlign: 'center',
                                    }}
                                />
                            </Text>
                        </TouchableOpacity>
                    </Text>
                </View>

                {generateUiTree(directory.path, directory.children, level + 1)}
            </View>
        );
    };
    const generateUiTree = (
        parentPath: string,
        children: (z.infer<typeof nameSchema> | Directory)[],
        level = 1 as number
    ) => {
        return children.map((file, index) => {
            // if it's a file
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
                        key={file.name + index}
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
            }
            // if it's a directory
            else {
                file = file as Directory;
                return directoryComponent(file, level);
            }
        });
    };

    return (
        <View
            className='relative'
            onLayout={(event) => {
                event.currentTarget.measure(
                    (x, y, width, height, pageX, pageY) => {
                        setParentPosition({ x: pageX, y: pageY });
                    }
                );
            }}
        >
            <ClickableMenu
                position={menuAnchor}
                onClickOutside={() => setVisible(false)}
                children={
                    <View>
                        <Menu.Item
                            onPress={() => {
                                setIsNewFileModalVisible(true);
                                setVisible(false);
                            }}
                            title='New File'
                        />
                        <Menu.Item
                            onPress={() => {
                                setIsNewDirectoryModalVisible(true);
                                setVisible(false);
                            }}
                            title='New Repository'
                        />
                        <Menu.Item
                            title='Delete'
                            onPress={() => {
                                deleteSlug.mutate(
                                    {
                                        path: path.resolve(
                                            project,
                                            selectedDirectory
                                        ),
                                    },
                                    {
                                        onSuccess: () =>
                                            void utils.projects.getDirectory.invalidate(),
                                    }
                                );
                                setVisible(false);
                            }}
                        />
                    </View>
                }
                visible={visible}
            />
            <AppModal
                visible={isNewFileModalVisible}
                onClose={() => setIsNewFileModalVisible(false)}
                children={
                    <View>
                        <Text className='text-white'>Create new file</Text>
                        <TextInput
                            placeholder={'Project name'}
                            onChangeText={(text) => setNewFileName(text.trim())}
                            style={{
                                color: 'white',
                            }}
                            placeholderTextColor={'gray'}
                        />

                        <TouchableOpacity
                            onPress={() => {
                                if (
                                    newFileName === undefined ||
                                    newFileName === ''
                                )
                                    return;
                                newFileMutation.mutate(
                                    {
                                        path: path.resolve(
                                            project,
                                            selectedDirectory,
                                            newFileName
                                        ),
                                    },
                                    {
                                        onSuccess: () => {
                                            void utils.projects.getDirectory.invalidate();
                                            setIsNewFileModalVisible(false);
                                        },
                                    }
                                );
                            }}
                        >
                            <Text className='text-white'>Create</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
            <AppModal
                visible={isNewDirectoryModalVisible}
                onClose={() => setIsNewDirectoryModalVisible(false)}
                children={
                    <View>
                        <Text className='text-white'>Create new directory</Text>
                        <TextInput
                            placeholder={'Project name'}
                            onChangeText={(text) =>
                                setNewDirectoryName(text.trim())
                            }
                            style={{
                                color: 'white',
                            }}
                            placeholderTextColor={'gray'}
                        />

                        <TouchableOpacity
                            onPress={() => {
                                if (
                                    newDirectoryName === undefined ||
                                    newDirectoryName === ''
                                )
                                    return;
                                newDirectoryMutation.mutate(
                                    {
                                        path: path.resolve(
                                            project,
                                            selectedDirectory,
                                            newDirectoryName
                                        ),
                                    },
                                    {
                                        onSuccess: () => {
                                            void utils.projects.getDirectory.invalidate();
                                            setIsNewDirectoryModalVisible(
                                                false
                                            );
                                        },
                                    }
                                );
                            }}
                        >
                            <Text className='text-white'>Create</Text>
                        </TouchableOpacity>
                    </View>
                }
            />

            <View
                style={{
                    pointerEvents: visible ? 'none' : 'auto',
                }}
            >
                <Stack.Screen options={{ title: project }} />
                {directoryComponent(
                    {
                        path: project,
                        children: [],
                    },
                    0
                )}

                {directoryTree !== undefined &&
                    generateUiTree('', directoryTree.children)}
            </View>
        </View>
    );
}
