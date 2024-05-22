import useWorkspace from './useWorkspace';
import { useEffect } from 'react';
import { WorkspaceFile } from '../Workspace';

/**
 * Hook that watches a file in the workspace for changes
 * and calls the effect with the new content when it changes
 */
export default function useWatchFile(
    watchFile: WorkspaceFile,
    effect: (content: string) => void
) {
    const workspace = useWorkspace();
    useEffect(() => {
        const updateFiles = (file: WorkspaceFile | null) => {
            if (file !== watchFile) return;
            effect(workspace.getFileContent(watchFile) ?? '');
        };

        workspace.events.on('fileContentChanged', updateFiles);

        return () => {
            workspace.events.off('fileContentChanged', updateFiles);
        };
    }, []);
}
