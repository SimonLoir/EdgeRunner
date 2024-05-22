import { useEffect, useState } from 'react';
import useWorkspace from './useWorkspace';

/**
 * Hook that returns the current edit mode of the workspace (text or refactor)
 */
export default function useEditMode() {
    const workspace = useWorkspace();
    const [editMode, setEditMode] = useState(workspace.editMode);

    useEffect(() => {
        workspace.events.on('editModeChanged', setEditMode);

        return () => {
            workspace.events.off('editModeChanged', setEditMode);
        };
    }, []);

    return editMode;
}
