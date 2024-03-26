import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import useFilesOpened from '../../utils/workspace/hooks/useFilesOpened';
import FileEditor from '../FileEditor';
import { WorkspaceFile } from '../../utils/workspace/Workspace';
import useWorkspace from '../../utils/workspace/hooks/useWorkspace';

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
            <View className='flex flex-row bg-[rgb(45,45,45)]'>
                {files.map((file) => (
                    <View
                        className={`flex flex-row p-5 gap-2 ${file === current ? 'bg-[rgb(30,30,30)]' : ''}`}
                    >
                        <Text
                            className={'text-white'}
                            onPress={() => setCurrent(file)}
                        >
                            {file}
                        </Text>
                        <Text
                            className={'text-white'}
                            onPress={async () =>
                                await workspace.closeFile(file)
                            }
                        >
                            x
                        </Text>
                    </View>
                ))}
            </View>
            {files
                .filter((f) => f === current)
                .map((file) => (
                    <FileEditor file={file} key={file} />
                ))}
        </View>
    );
}
