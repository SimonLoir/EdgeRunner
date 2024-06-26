import { useEffect, useState } from 'react';
import useWorkspace from './useWorkspace';
import { WorkspaceProject } from '../Workspace';

/**
 * Hook that returns the list of projects opened in the workspace
 */
export default function useProjectsOpened() {
    const workspace = useWorkspace();
    const [projects, setProjects] = useState<WorkspaceProject[]>(
        workspace.projects
    );
    useEffect(() => {
        const updateProjects = (projects: WorkspaceProject[]) => {
            setProjects(projects);
        };

        workspace.events.on('projectAdded', updateProjects);
        workspace.events.on('projectRemoved', updateProjects);

        return () => {
            workspace.events.off('projectAdded', updateProjects);
            workspace.events.off('projectRemoved', updateProjects);
        };
    }, []);
    return projects;
}
