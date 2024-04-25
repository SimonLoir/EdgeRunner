import { WorkspaceProject } from '../../../../utils/workspace/Workspace';
import { ActivityIndicator, GestureResponderEvent, View } from 'react-native';
import React from 'react';
import { trpc } from '../../../../utils/api';
import { Menu } from 'react-native-paper';
import ClickableMenu from '../../../ClickableMenu';
import RepositoryTree from '../../../RepositoryTree';
import NewFileModal from '../../../modals/NewFileModal';
import NewDirectoryModal from '../../../modals/NewDirectoryModal';
import DeleteModal from '../../../modals/DeleteModal';
import RenameModal from '../../../modals/RenameModal';

type ProjectProps = {
    project: WorkspaceProject;
};

export default function Project({ project }: ProjectProps) {
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

    const [isNewFileModalVisible, setIsNewFileModalVisible] =
        React.useState(false);
    const [isNewDirectoryModalVisible, setIsNewDirectoryModalVisible] =
        React.useState(false);
    const [isDeleteFileModalVisible, setIsDeleteFileModalVisible] =
        React.useState(false);
    const [isRenameFileModalVisible, setIsRenameFileModalVisible] =
        React.useState(false);

    const onMenuPress = (
        event: GestureResponderEvent,
        directory: string,
        isDirectory: boolean
    ) => {
        event.target.measure((x, y, width, height, pageX, pageY) => {
            setMenuAnchor({
                x: pageX - parentPosition.x + width + 10,
                y: pageY - parentPosition.y,
            });
        });

        setVisible(true);
        setSelectedDirectory(directory);
        setSelectedDirectoryIsDirectory(isDirectory);
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
            <View className='z-10'>
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
            </View>
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

            <DeleteModal
                visible={isDeleteFileModalVisible}
                onClose={() => setIsDeleteFileModalVisible(false)}
                selectedDirectory={selectedDirectory}
            />

            <RenameModal
                visible={isRenameFileModalVisible}
                onClose={() => setIsRenameFileModalVisible(false)}
                selectedDirectory={selectedDirectory}
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
