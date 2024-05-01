import {publicProcedure} from '@/trpc';
import {projectsDirectory} from './index';

export const projectDirectoryRoute = publicProcedure.query(() => {
    return projectsDirectory;
});
