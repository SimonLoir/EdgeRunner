import { useQuery } from '@tanstack/react-query';
import {
    WORKSPACE_CURRENT_FILE,
    WORKSPACE_FILES,
    WORKSPACE_PROJECTS,
    WorkspaceFile,
    WorkspaceProject,
} from '../utils/workspace/Workspace';
import useWorkspace from '../utils/workspace/hooks/useWorkspace';
import { getFromAsyncStorage } from '../utils/getFromAsyncStorage';

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
            //await workspace.registerLanguage('python');
            await workspace.registerLanguage('prolog');

            const files =
                await getFromAsyncStorage<WorkspaceFile[]>(WORKSPACE_FILES);
            if (files) {
                for (const file of files) {
                    await workspace.openFile(file);
                }
            }

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
