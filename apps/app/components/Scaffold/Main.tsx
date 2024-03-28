import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import useFilesOpened from '../../utils/workspace/hooks/useFilesOpened';
import FileEditor from '../FileEditor';
import { WorkspaceFile } from '../../utils/workspace/Workspace';
import useWorkspace from '../../utils/workspace/hooks/useWorkspace';
import { EvilIcons } from '@expo/vector-icons';

export default function Main() {
    const files = useFilesOpened();
    const workspace = useWorkspace();
    const [current, setCurrent] = useState<WorkspaceFile | undefined>(files[0]);

    useEffect(() => {
        if (current && files.includes(current)) return;
        setCurrent(files[0]);
    }, [current, files]);
    return (
        <View className='flex-1 bg-[rgb(30,30,30)]'>
            <View>
                <FlatList
                    horizontal={true}
                    className='bg-[rgb(45,45,45)]'
                    data={files}
                    renderItem={({ item: file }) => (
                        <TouchableOpacity
                            onPress={() => setCurrent(file)}
                            className={`flex flex-row p-5 gap-2 ${file === current ? 'bg-[rgb(30,30,30)]' : ''}`}
                        >
                            <Text className={'text-white'}>{file}</Text>
                            <Text
                                className={'text-white'}
                                onPress={async (e) => {
                                    e.preventDefault();
                                    await workspace.closeFile(file);
                                }}
                            >
                                <EvilIcons
                                    name='close'
                                    size={24}
                                    color='white'
                                />
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
            <View className='flex-1'>
                {files
                    .filter((f) => f === current)
                    .map((file) => (
                        <FileEditor file={file} key={file} />
                    ))}
            </View>
        </View>
    );
}
