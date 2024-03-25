import React from 'react';
import { View } from 'react-native';
import useFilesOpened from '../../utils/workspace/hooks/useFilesOpened';
import FileEditor from '../FileEditor';

export default function Main() {
    const files = useFilesOpened();
    console.log(files);
    return (
        <View className='flex-1 bg-[rgb(30,30,30)]'>
            {files.map((file) => (
                <FileEditor file={file} key={file} />
            ))}
        </View>
    );
}
