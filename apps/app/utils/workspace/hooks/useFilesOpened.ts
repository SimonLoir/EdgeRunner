import useWorkspace from './useWorkspace';
import { useEffect, useState } from 'react';
import { WorkspaceFile } from '../Workspace';

/**
 * Hook that returns the list of files opened in the workspace
 */
export default function useFilesOpened() {
    const workspace = useWorkspace();
    const [files, setFiles] = useState<WorkspaceFile[]>(
        Array.from(workspace.files).map(([file]) => file)
    );
    useEffect(() => {
        const updateFiles = (files: WorkspaceFile[]) => {
            setFiles(files);
        };

        workspace.events.on('fileOpened', updateFiles);
        workspace.events.on('fileClosed', updateFiles);

        return () => {
            workspace.events.off('fileClosed', updateFiles);
            workspace.events.off('fileOpened', updateFiles);
        };
    }, []);
    return files;
}
