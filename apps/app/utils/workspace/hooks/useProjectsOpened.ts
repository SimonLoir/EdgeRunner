import { useEffect, useState } from 'react';
import useWorkspace from './useWorkspace';
import { WorkspaceProject } from '../Workspace';

export default function useProjectsOpened() {
    const workspace = useWorkspace();
    const [projects, setProjects] = useState<WorkspaceProject[]>([]);
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
