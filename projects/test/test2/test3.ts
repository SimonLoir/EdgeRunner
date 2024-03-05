import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
// @ts-ignore Can't find type declaration for module 'react-native-path'
import path from 'react-native-path';
import { trpc } from '../../../../utils/api';
import hljs from 'highlight.js';
import 'highlight.js/styles/default.css';

type Highlighted = {
    value: string;
    className: string | undefined;
};
export default function File() {
    const { project, path: file } = useLocalSearchParams();
    const [fileContent, setFileContent] = useState<string | undefined>(
        undefined
    );
    const [displayContent, setDisplayContent] = useState<
        Highlighted | undefined
    >(undefined);


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

        console.log(result);
        return result;
    }

    useEffect(() => {
        void (async () => {
            const data = await trpc.projects.getFile.query({
                path: path.resolve(project, file),
            });
            setFileContent(data.content);
            const highlited = hljs.highlightAuto(data.content);
            setDisplayContent(parseStringToObject(highlited.value));
        })();
    }, []);

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

    if (fileContent === undefined) {
        return <Text className={'text-white'}>Loading...</Text>;
    }
    if (displayContent === undefined) {
        return <Text className={'text-white'}>Loading...</Text>;
    }
    return (
        <View>
            <Stack.Screen
                options={{
        title: path.basename(file),
            headerRight: () => (
            <View>
                <TouchableOpacity
                    onPress={async () => {
            console.log('saving', fileContent);
            await trpc.projects.saveFile.mutate({
                path: path.resolve(project, file),
                content: fileContent,
            });
        }}
    >
        <Text className={'text-gwhite'}>Save</Text>
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
        {displayContent.map((part, index) => {
                return (
                    <Text key={index} className={part.className}>
                    {part.value}
                    </Text>
            );
            })}
        </TextInput>
        </View>
);
}
