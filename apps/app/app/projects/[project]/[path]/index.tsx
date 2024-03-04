import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
// @ts-ignore Can't find type declaration for module 'react-native-path'
import path from 'react-native-path';

import hljs from 'highlight.js';
import 'highlight.js/styles/monokai.css';
import { trpc } from '../../../../utils/api';

type Highlighted = {
    value: string;
    className: string | undefined;
};
export default function File() {
    const { project, path: file } = useLocalSearchParams();
    const [displayContent, setDisplayContent] = useState<
        Highlighted[] | undefined
    >(undefined);
    const [fileContent, setFileContent] = useState<string | undefined>(
        undefined
    );

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
            value = '';
            className = '';
        }

        return result;
    }

    const { data: fileInfo, isLoading } = trpc.projects.getFile.useQuery({
        path: path.resolve(project, file),
    });

    const mutation = trpc.projects.saveFile.useMutation();

    const saveFile = (fileName: string) => {
        if (fileInfo !== undefined) {
            mutation.mutate({
                path: path.resolve(project, fileName),
                content: fileInfo.content,
            });
        }
    };

    useEffect(() => {
        if (fileContent !== undefined) {
            const highlited = hljs.highlight(fileContent, { language: 'jsx' });
            setDisplayContent(parseStringToObject(highlited.value));
        }
    }, [fileContent]);

    useEffect(() => {
        if (fileInfo === undefined) return;
        console.log(fileInfo);
        setFileContent(fileInfo.content);
    }, [fileInfo]);

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

    if (fileInfo === undefined) {
        return <Text className={'text-white'}></Text>;
    }

    return (
        <View>
            <Stack.Screen
                options={{
                    title: path.basename(file),
                    headerRight: () => (
                        <View>
                            <TouchableOpacity onPress={() => saveFile(file)}>
                                <Text className={'text-white'}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    ),
                }}
            />

            <TextInput
                className={'text-white'}
                onChangeText={setFileContent}
                multiline={true}
            >
                {displayContent === undefined ? (
                    <Text className={'text-white'}>{fileContent}</Text>
                ) : (
                    displayContent.map((part, index) => {
                        return (
                            <Text key={index} className={part.className}>
                                {part.value}
                            </Text>
                        );
                    })
                )}
            </TextInput>
        </View>
    );
}
