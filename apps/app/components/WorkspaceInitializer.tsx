import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkspaceProject } from '../utils/workspace/Workspace';
import useWorkspace from '../utils/workspace/hooks/useWorkspace';
import { WORKSPACE_PROJECTS } from '../utils/workspace/Workspace';

async function getFromAsyncStorage<T>(key: string): Promise<T | null> {
    const data = await AsyncStorage.getItem(key);
    if (!data) {
        return null;
    }
    return JSON.parse(data);
}

export default function WorkspaceInitializer() {
    const workspace = useWorkspace();
    useQuery({
        queryKey: ['workspace'],
        queryFn: async () => {
            // Fetch the workspace data from async storage
            const projects =
                await getFromAsyncStorage<WorkspaceProject[]>(
                    WORKSPACE_PROJECTS
                );

            if (projects) {
                for (const project of projects) {
                    workspace.addProject(project);
                }
            }

            console.info(`Workspace ${workspace.id} initialized`);

            await workspace.registerLanguage('typescript');
            //await workspace.registerLanguage('python');

            return {
                projects,
            };
        },
    });

    return <></>;
}
