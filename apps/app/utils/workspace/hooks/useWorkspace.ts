import { useContext } from 'react';
import WorkspaceContext from '../WorkspaceContext';

export default function useWorkspace() {
    const workspace = useContext(WorkspaceContext);
    if (!workspace)
        throw new Error(
            'useWorkspace should be used inside a WorkspaceContext provider'
        );
    return workspace;
}
