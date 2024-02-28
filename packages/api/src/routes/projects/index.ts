import { publicProcedure, router } from '../../trpc';
import { getDirInDirectory } from '../../../../utils';
import * as fs from 'fs';
import path from 'node:path';
import { z } from 'zod';

const projectsDirectory = path.resolve(__dirname, '../../../../../../projects');
export const projectsRouter = router({
    getProjects: publicProcedure.query(() => {
        console.log(__dirname);
        console.log(projectsDirectory);
        return getDirInDirectory(projectsDirectory);
    }),
    createProject: publicProcedure
        .input(
            z.object({
                name: z.string(),
            })
        )
        .output(z.string())
        .mutation((opts) => {
            const { input } = opts;
            const directory = path.resolve(
                projectsDirectory,
                'projects',
                input.name
            );
            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory);
                return 'Project created';
            } else {
                if (fs.lstatSync(directory).isDirectory()) {
                    return (
                        'Project with name "' + input.name + '" already exists'
                    );
                } else {
                    return 'File with name "' + input.name + '" already exists';
                }
            }
        }),
});
