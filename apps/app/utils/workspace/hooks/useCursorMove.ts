import useWorkspace from './useWorkspace';
import { useEffect } from 'react';
import { WorkspaceFile } from '../Workspace';

/**
 * Hook that watches the cursor position in a file
 * and calls the effect with the new position when it changes
 * @param watchFile The file to watch
 * @param effect The effect to call when the cursor moves
 */
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
