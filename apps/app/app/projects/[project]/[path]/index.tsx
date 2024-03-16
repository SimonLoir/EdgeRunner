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

type Highlighted = {
    value: string;
    className: string | undefined;
};
export default function File() {
    const utils = trpc.useUtils();
    const { project, path: file } = useLocalSearchParams();

    const [fileContent, setFileContent] = useState<string | undefined>(
        undefined
    );
    const [isKeyBoardVisible, setIsKeyBoardVisible] = useState(false);

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

    function unescapeHtml(value: string): string {
        return value
            .replaceAll('&amp;', '&')
            .replaceAll('&lt;', '<')
            .replaceAll('&gt;', '>')
            .replaceAll('&quot;', '"')
            .replaceAll('&#x27;', "'");
    }
    function parseStringToObject(html: string): Highlighted[] {
        const result: {
            value: string;
            className: string | undefined;
        }[] = [];

        let i = 0;
        let value = '';
        let className = '';
        let inClass = false;
        const tagBegin = '<span class="';
        const tagEnd = '</span>';
        while (i < html.length) {
            if (html.slice(i).startsWith(tagBegin)) {
                if (value !== '') {
                    result.push({
                        value: unescapeHtml(value),
                        className: undefined,
                    });
                    value = '';
                    className = '';
                }
                inClass = true;
                i += tagBegin.length;
            } else if (inClass) {
                while (!html.slice(i).startsWith('">')) {
                    className += html[i];
                    i++;
                }
                i += 2;
                inClass = false;
            } else if (html.slice(i).startsWith(tagEnd)) {
                result.push({ value: unescapeHtml(value), className });
                value = '';
                className = '';
                i += tagEnd.length;
            } else {
                value += html[i];
                i++;
            }
        }
        if (value !== '') {
            result.push({ value: unescapeHtml(value), className: undefined });
        }

        return result;
    }

    const { data: fileInfo, isLoading } = trpc.projects.getFile.useQuery({
        path: file,
    });

    const mutation = trpc.projects.saveFile.useMutation();

    const saveFile = () => {
        if (fileInfo !== undefined) {
            mutation.mutate({
                path: file,
                content: fileContent ?? fileInfo.content,
            });
        }
    };

    useEffect(() => {
        if (fileInfo === undefined) return;

        setFileContent(fileInfo.content);
    }, [fileInfo]);

    if (fileInfo === undefined || isLoading) {
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
    if (fileInfo.content !== undefined && fileContent !== undefined) {
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
