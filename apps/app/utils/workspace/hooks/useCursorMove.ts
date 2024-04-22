import useWorkspace from './useWorkspace';
import { useEffect } from 'react';
import { WorkspaceFile } from '../Workspace';

export default function useCursorMove(
    watchFile: WorkspaceFile,
    effect: (line: number, character: number) => void
) {
    const workspace = useWorkspace();
    useEffect(() => {
        const updateFiles = ({
            file,
            line,
            character,
        }: {
            file: WorkspaceFile | null;
            line: number;
            character: number;
        }) => {
            if (file !== watchFile) return;
            effect(line, character);
        };

        workspace.events.on('cursorMoved', updateFiles);

        return () => {
            workspace.events.off('cursorMoved', updateFiles);
        };
    }, []);
}
