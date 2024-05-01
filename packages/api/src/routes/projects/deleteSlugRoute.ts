import {publicProcedure} from '@/trpc';
import {pathSchema} from '@repo/types/Files';
import path from 'node:path';
import fs from 'fs';
import {TRPCError} from '@trpc/server';
import {projectsDirectory} from './index';

export const deleteSlugRoute = publicProcedure
    .input(pathSchema)
    .mutation((opts) => {
        const {path: pathToFile} = opts.input;
        const directory = path.resolve(projectsDirectory, pathToFile);

        if (!fs.existsSync(directory)) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Path does not exist',
            });
        }

        fs.rmSync(directory, {
            recursive: true,
        });
        return 'File deleted';
    });
