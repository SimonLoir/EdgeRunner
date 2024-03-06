import {
    ActivityIndicator,
    Dimensions,
    GestureResponderEvent,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { Link, router, Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { trpc } from '../../../utils/api';
import { Directory, nameSchema } from '@repo/types/Files';
import { z } from 'zod';
// @ts-ignore Can't find type declaration for module 'react-native-path'
import path from 'react-native-path';
import Icon from 'react-native-vector-icons/AntDesign';
import { Menu, Divider, PaperProvider } from 'react-native-paper';
import ClickableMenu from '../../../components/ClickableMenu';

export default function Project() {
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

    const onIconPress = (event: GestureResponderEvent) => {
        event.currentTarget.measure((x, y, width, height, pageX, pageY) => {
            setMenuAnchor({
                x: pageX,
                y: pageY - parentPosition.y,
            });
        });
        setVisible(true);
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
                        {directory.path}
                    </Text>
                    <TouchableOpacity onPress={onIconPress}>
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
            } else {
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
                items={[
                    <Menu.Item onPress={() => {}} title='Item 1' />,
                    <Menu.Item onPress={() => {}} title='Item 2' />,
                ]}
                visible={visible}
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
