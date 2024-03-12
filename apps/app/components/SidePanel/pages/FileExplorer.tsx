import { Text, TouchableOpacity } from 'react-native';
import useProjectsOpened from '../../../utils/workspace/hooks/useProjectsOpened';
import useWorkspace from '../../../utils/workspace/hooks/useWorkspace';

export default function FileExplorer() {
    const currentFolders = useProjectsOpened();
    const workspace = useWorkspace();
    return (
        <>
            <Text className='text-white'>
                This is a file explorer {JSON.stringify(currentFolders)}
            </Text>
            <TouchableOpacity onPress={() => workspace.addProject('hello')}>
                <Text className='text-white'>Create new project</Text>
            </TouchableOpacity>
        </>
    );
}
