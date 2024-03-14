import { WorkspaceProject } from '../../../../utils/workspace/Workspace';
import { Text, TouchableOpacity, View } from 'react-native';
import Project from './Project';
import useWorkspace from '../../../../utils/workspace/hooks/useWorkspace';

type ProjectToggleViewProps = {
    project: WorkspaceProject;
};
export default function ProjectToggleView({ project }: ProjectToggleViewProps) {
    const workspace = useWorkspace();
    return (
        <View>
            <View className='border-b-2 border-gray-500 py-2 mb-2'>
                <Text className='text-white'>{project}</Text>
            </View>
            <View>
                <Project project={project} />
                <TouchableOpacity
                    className='mt-2 px-2 py-2 bg-[rgb(50,50,50)] items-center rounded-lg'
                    onPress={() => workspace.removeProject(project)}
                >
                    <Text className='text-white'>Remove from workspace</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
