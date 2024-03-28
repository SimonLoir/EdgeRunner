import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import useFilesOpened from '../../utils/workspace/hooks/useFilesOpened';
import FileEditor from '../FileEditor';
import useWorkspace from '../../utils/workspace/hooks/useWorkspace';
import { EvilIcons } from '@expo/vector-icons';
import useCurrentFile from '../../utils/workspace/hooks/useCurrentFile';

export default function Main() {
    const files = useFilesOpened();
    const workspace = useWorkspace();
    const current = useCurrentFile();
    return (
        <View className='flex-1 bg-[rgb(30,30,30)]'>
            <View>
                <FlatList
                    horizontal={true}
                    className='bg-[rgb(45,45,45)]'
                    data={files}
                    renderItem={({ item: file }) => (
                        <TouchableOpacity
                            onPress={() => (workspace.currentFile = file)}
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
