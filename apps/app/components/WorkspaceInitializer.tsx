import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    WorkspaceProject,
    WORKSPACE_PROJECTS,
    WORKSPACE_FILES,
    WorkspaceFile,
    WORKSPACE_CURRENT_FILE,
} from '../utils/workspace/Workspace';
import useWorkspace from '../utils/workspace/hooks/useWorkspace';

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
            const currentFile = await getFromAsyncStorage<string>(
                WORKSPACE_CURRENT_FILE
            );
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
            await workspace.registerLanguage('c');
            await workspace.registerLanguage('swift');
            await workspace.registerLanguage('python');
            await workspace.registerLanguage('prolog');

            const files =
                await getFromAsyncStorage<WorkspaceFile[]>(WORKSPACE_FILES);
            if (files) {
                for (const file of files) {
                    await workspace.openFile(file);
                }
            }

            console.log({ currentFile });
            if (currentFile) {
                workspace.currentFile = currentFile;
            }

            return {
                projects,
            };
        },
    });

    return <></>;
}
