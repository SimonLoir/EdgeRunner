import { WorkspaceProject } from '../../../../utils/workspace/Workspace';
import {
    ActivityIndicator,
    GestureResponderEvent,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Pressable,
} from 'react-native';
import { router } from 'expo-router';
import React from 'react';
import { trpc } from '../../../../utils/api';
// @ts-ignore Can't find type declaration for module 'react-native-path'
import path from 'react-native-path';
import { Menu } from 'react-native-paper';
import ClickableMenu from '../../../ClickableMenu';
import AppModal from '../../../AppModal';
import RepositoryTree from '../../../RepositoryTree';
import NewFileModal from '../../../modals/NewFileModal';
import NewDirectoryModal from '../../../modals/NewDirectoryModal';

type ProjectProps = {
    project: WorkspaceProject;
};

export default function Project({ project }: ProjectProps) {
    const utils = trpc.useUtils();
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

    const [isNewFileModalVisible, setIsNewFileModalVisible] =
        React.useState(false);
    const [isNewDirectoryModalVisible, setIsNewDirectoryModalVisible] =
        React.useState(false);
    const [isDeleteFileModalVisible, setIsDeleteFileModalVisible] =
        React.useState(false);
    const [isRenameFileModalVisible, setIsRenameFileModalVisible] =
        React.useState(false);

    const deleteSlug = trpc.projects.deleteSlug.useMutation();
    const renameSlug = trpc.projects.renameSlug.useMutation();

    const onMenuPress = (
        event: GestureResponderEvent,
        directory: string,
        isDirectorty: boolean
    ) => {
        console.log('onMenuPress', directory);
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

    const { data: directoryTree, isLoading } =
        trpc.projects.getDirectory.useQuery({
            path: project,
        });

    if (isLoading)
        return (
            <View>
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
                                    title='New file'
                                />
                                <Menu.Item
                                    onPress={() => {
                                        setIsNewDirectoryModalVisible(true);
                                        setVisible(false);
                                    }}
                                    title='New directory'
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
            <NewFileModal
                visible={isNewFileModalVisible}
                onClose={() => setIsNewFileModalVisible(false)}
                selectedDirectory={selectedDirectory}
            />

            <NewDirectoryModal
                visible={isNewDirectoryModalVisible}
                onClose={() => setIsNewDirectoryModalVisible(false)}
                selectedDirectory={selectedDirectory}
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
