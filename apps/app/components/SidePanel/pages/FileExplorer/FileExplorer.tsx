import { Text, TouchableOpacity, View } from 'react-native';
import useProjectsOpened from '../../../../utils/workspace/hooks/useProjectsOpened';
import { useState } from 'react';
import OpenProjectModal from '../../../modals/OpenProjectModal';
import NewProjectModal from '../../../modals/NewProjectModal';
import ProjectToggleView from './ProjectToggleView';

export default function FileExplorer() {
    const currentFolders = useProjectsOpened();
    const [showOpenProjectModal, setShowOpenProjectModal] = useState(false);
    const [showNewProjectModal, setShowNewProjectModal] = useState(false);
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
                    <TouchableOpacity
                        className='px-3 py-4 bg-[rgb(50,50,50)] items-center'
                        onPress={() => setShowNewProjectModal(true)}
                    >
                        <Text className='text-white'>Create a new project</Text>
                    </TouchableOpacity>
                    <OpenProjectModal
                        visible={showOpenProjectModal}
                        onClose={() => setShowOpenProjectModal(false)}
                    />
                    <NewProjectModal
                        onClose={() => setShowNewProjectModal(false)}
                        visible={showNewProjectModal}
                    />
                </View>
            </>
        );
    return (
        <View className='gap-8'>
            {currentFolders.map((project) => {
                return <ProjectToggleView project={project} key={project} />;
            })}
        </View>
    );
}
