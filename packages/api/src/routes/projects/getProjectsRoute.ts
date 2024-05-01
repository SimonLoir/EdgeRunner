import { publicProcedure } from '@/trpc';
import { getDirInDirectory } from '@/utils';
import { projectsDirectory } from './index';

export const getProjectsRoute = publicProcedure.query(() => {
    return getDirInDirectory(projectsDirectory);
});
