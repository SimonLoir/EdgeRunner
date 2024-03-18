import {
    ActivityIndicator,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
// @ts-ignore Can't find type declaration for module 'react-native-path'
import path from 'react-native-path';

import hljs from 'highlight.js';
import 'highlight.js/styles/monokai.css';
import { trpc } from '../../../../utils/api';
import CustomKeyboardTextInput from '../../../../components/CustomKeyboardTextInput';
import useWorkspace from '../../../../utils/workspace/hooks/useWorkspace';
import {
    Highlighted,
    parseStringToObject,
} from '../../../../utils/parseStringToObject';

export default function File() {
    const utils = trpc.useUtils();
    const workspace = useWorkspace();
    const { project, path: file } = useLocalSearchParams();

    if (project === undefined || typeof project !== 'string')
        throw new Error('project is required and must be a string');

    if (file === undefined || typeof file !== 'string')
        throw new Error('file is required and must be a string');

    useEffect(() => {
        if (workspace === undefined) return;
        (async () => {
            try {
                await workspace.openFile(file);
            } catch (e) {
                console.error(e);
            }
        })();

        return () => {
            workspace.closeFile(file);
        };
    }, [workspace]);

    const [fileContent, setFileContent] = useState<string | undefined>(
        undefined
    );

    const { data: fileInfo, isLoading } = trpc.projects.getFile.useQuery({
        path: file,
    });

    const mutation = trpc.projects.saveFile.useMutation();

    const saveFile = () => {
        if (fileInfo) {
            mutation.mutate({
                path: file,
                content: fileContent ?? fileInfo.content,
            });
        }
    };

    useEffect(() => {
        if (!fileInfo) return;

        setFileContent(fileInfo.content);
    }, [fileInfo]);

    if (!fileInfo || isLoading) {
        return (
            <View>
                <Stack.Screen
                    options={{
                        title: path.basename(file),
                    }}
                />
                <ActivityIndicator color='#FFFFFF' />
            </View>
        );
    }

    let displayContent: Highlighted[] | undefined;
    if (fileContent !== undefined) {
        let highlighted;
        const extension = path.extname(file).slice(1);

        if (extension && hljs.getLanguage(extension) !== undefined) {
            highlighted = hljs.highlight(fileContent, {
                language: extension,
            });
        } else {
            highlighted = hljs.highlightAuto(fileContent);
        }

        displayContent = parseStringToObject(highlighted.value);
    } else {
        displayContent = undefined;
    }

    return (
        <View className='bg-[rgb(30,30,30)] p-5 flex-1'>
            <Stack.Screen
                options={{
                    title: path.basename(file),
                    headerRight: () => (
                        <View>
                            <TouchableOpacity
                                onPress={() => {
                                    saveFile();
                                    void utils.projects.getFile.invalidate();
                                }}
                                disabled={fileInfo.content === fileContent}
                            >
                                <Text
                                    className={
                                        fileInfo.content !== fileContent
                                            ? 'text-white'
                                            : 'text-gray-500'
                                    }
                                >
                                    Save
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ),
                }}
            />

            <CustomKeyboardTextInput
                onChangeText={setFileContent}
                keyboard={'CodeKeyboard'}
                children={
                    displayContent === undefined ? (
                        <Text className={'text-white'}>{fileContent}</Text>
                    ) : (
                        displayContent.map((part, index) => {
                            return (
                                <Text key={index} className={part.className}>
                                    {part.value}
                                </Text>
                            );
                        })
                    )
                }
                text={fileContent}
            />
        </View>
    );
}
