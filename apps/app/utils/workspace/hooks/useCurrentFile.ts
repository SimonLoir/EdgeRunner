import useWorkspace from './useWorkspace';
import { useEffect, useState } from 'react';
import { WorkspaceFile } from '../Workspace';

/**
 * Hook that returns the list of files opened in the workspace
 */
export default function useCurrentFile() {
    const workspace = useWorkspace();
    const [file, setFile] = useState<WorkspaceFile | null>(
        workspace.currentFile
    );
    useEffect(() => {
        const updateFiles = (file: WorkspaceFile | null) => {
            setFile(file);
        };

        workspace.events.on('currentFileChanged', updateFiles);

        return () => {
            workspace.events.off('currentFileChanged', updateFiles);
        };
    }, []);
    return file;
}
