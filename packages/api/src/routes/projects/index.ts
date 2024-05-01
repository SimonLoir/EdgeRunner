import { router } from '@/trpc';
import path from 'node:path';
import { createProjectRoute } from './createProjectRoute';
import { getFileRoute } from './getFileRoute';
import { getDirectoryRoute } from './getDirectoryRoute';
import { createFileRoute } from './createFileRoute';
import { getProjectsRoute } from './getProjectsRoute';
import { projectDirectoryRoute } from './projectDirectoryRoute';
import { deleteSlugRoute } from './deleteSlugRoute';
import { renameSlugRoute } from './renameSlugRoute';
import { saveFileRoute } from './saveFileRoute';
import { creatDirectoryRoute } from './creatDirectoryRoute';

export const projectsDirectory = path.resolve(
    __dirname,
    '../../../../../projects'
);
export const projectsRouter = router({
    getProjects: getProjectsRoute,
    createProject: createProjectRoute,
    getFile: getFileRoute,
    getDirectory: getDirectoryRoute,
    createFile: createFileRoute,
    createDirectory: creatDirectoryRoute,
    saveFile: saveFileRoute,
    renameSlug: renameSlugRoute,
    deleteSlug: deleteSlugRoute,
    getProjectDirectory: projectDirectoryRoute,
});
