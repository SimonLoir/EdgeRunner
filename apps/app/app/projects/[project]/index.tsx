import {
    ActivityIndicator,
    GestureResponderEvent,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Pressable,
} from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { trpc } from '../../../utils/api';

// @ts-ignore Can't find type declaration for module 'react-native-path'
import path from 'react-native-path';
import { Menu } from 'react-native-paper';
import ClickableMenu from '../../../components/ClickableMenu';
import AppModal from '../../../components/AppModal';
import RepositoryTree from '../../../components/RepositoryTree';

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
    const [selectedDirectoryIsDirectory, setSelectedDirectoryIsDirectory] =
        React.useState(true);

    const [newFileName, setNewFileName] = React.useState('');
    const [newDirectoryName, setNewDirectoryName] = React.useState('');

    const [isNewFileModalVisible, setIsNewFileModalVisible] =
        React.useState(false);
    const [isNewDirectoryModalVisible, setIsNewDirectoryModalVisible] =
        React.useState(false);
    const [isDeleteFileModalVisible, setIsDeleteFileModalVisible] =
        React.useState(false);
    const [isRenameFileModalVisible, setIsRenameFileModalVisible] =
        React.useState(false);

    const newFileMutation = trpc.projects.createFile.useMutation();
    const newDirectoryMutation = trpc.projects.createDirectory.useMutation();
    const deleteSlug = trpc.projects.deleteSlug.useMutation();
    const renameSlug = trpc.projects.renameSlug.useMutation();

    const onMenuPress = (
        event: GestureResponderEvent,
        directory: string,
        isDirectorty: boolean
    ) => {
        event.target.measure((x, y, width, height, pageX, pageY) => {
            setMenuAnchor({
                x: pageX - parentPosition.x + width + 10,
                y: pageY - parentPosition.y,
            });
        });

        setVisible(true);
        setSelectedDirectory(directory);
        setSelectedDirectoryIsDirectory(isDirectorty);
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
                        {selectedDirectoryIsDirectory && (
                            <>
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
                            </>
                        )}
                        <Menu.Item
                            title='Delete'
                            onPress={() => {
                                setIsDeleteFileModalVisible(true);
                                setVisible(false);
                            }}
                        />
                        <Menu.Item
                            title={'Rename'}
                            onPress={() => {
                                setIsRenameFileModalVisible(true);
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

            <AppModal
                visible={isDeleteFileModalVisible}
                onClose={() => setIsDeleteFileModalVisible(false)}
                children={
                    <View>
                        <Text className='text-white'>
                            Are you sure you want to delete this directory?
                        </Text>

                        <Pressable
                            onPress={() => {
                                deleteSlug.mutate(
                                    {
                                        path: path.resolve(
                                            project,
                                            selectedDirectory
                                        ),
                                    },
                                    {
                                        onSuccess: () => {
                                            void utils.projects.invalidate();
                                            if (selectedDirectory === '') {
                                                router.replace('../');
                                            }
                                        },
                                    }
                                );
                                setIsDeleteFileModalVisible(false);
                            }}
                        >
                            <Text className='text-white'>Delete</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setIsDeleteFileModalVisible(false)}
                        >
                            <Text className='text-white'>Cancel</Text>
                        </Pressable>
                    </View>
                }
            />
            <AppModal
                visible={isRenameFileModalVisible}
                onClose={() => setIsRenameFileModalVisible(false)}
                children={
                    <View>
                        <Text className='text-white'>Rename</Text>
                        <TextInput
                            placeholder={'New name'}
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

                                renameSlug.mutate(
                                    {
                                        path: path.resolve(
                                            project,
                                            selectedDirectory
                                        ),
                                        name: newFileName,
                                    },
                                    {
                                        onSuccess: () => {
                                            if (selectedDirectory === '') {
                                                void utils.projects.invalidate();
                                                router.replace(
                                                    './' + newFileName
                                                );
                                            } else {
                                                void utils.projects.getDirectory.invalidate();
                                            }
                                            setIsRenameFileModalVisible(false);
                                        },
                                    }
                                );
                            }}
                        >
                            <Text className='text-white'>Rename</Text>
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
                {directoryTree !== undefined && (
                    <RepositoryTree
                        directory={directoryTree}
                        project={project}
                        level={0}
                        onLongPress={onMenuPress}
                    />
                )}
            </View>
        </View>
    );
}
