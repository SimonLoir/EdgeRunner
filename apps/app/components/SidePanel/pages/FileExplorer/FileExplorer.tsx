import { Text, TouchableOpacity, View } from 'react-native';
import useProjectsOpened from '../../../../utils/workspace/hooks/useProjectsOpened';
import { useState } from 'react';
import OpenProjectModal from '../../../modals/OpenProjectModal';
import useWorkspace from '../../../../utils/workspace/hooks/useWorkspace';

export default function FileExplorer() {
    const currentFolders = useProjectsOpened();
    const workspace = useWorkspace();
    const [showOpenProjectModal, setShowOpenProjectModal] = useState(false);
    if (currentFolders.length === 0)
        return (
            <>
                <View className='gap-3'>
                    <TouchableOpacity
                        className='px-3 py-4 bg-[rgb(50,50,50)] items-center'
                        onPress={() => setShowOpenProjectModal(true)}
                    >
                        <Text className='text-white'>Open a project</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className='px-3 py-4 bg-[rgb(50,50,50)] items-center'>
                        <Text className='text-white'>Create a new project</Text>
                    </TouchableOpacity>
                </View>
                <OpenProjectModal
                    visible={showOpenProjectModal}
                    onClose={() => setShowOpenProjectModal(false)}
                />
            </>
        );
    return (
        <View>
            {currentFolders.map((project) => {
                return (
                    <>
                        <Text key={project}>{project}</Text>
                        <TouchableOpacity
                            onPress={() => workspace.removeProject(project)}
                        >
                            <Text className={'text-white'}>
                                Supprimer {project}
                            </Text>
                        </TouchableOpacity>
                    </>
                );
            })}
        </View>
    );
}
