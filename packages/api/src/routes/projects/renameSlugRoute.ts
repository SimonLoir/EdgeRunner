import {publicProcedure} from '@/trpc';
import {renameFileSchema} from '@repo/types/Files';
import path from 'node:path';
import fs from 'fs';
import {TRPCError} from '@trpc/server';
import {projectsDirectory} from './index';

export const renameSlugRoute = publicProcedure
    .input(renameFileSchema)
    .mutation((opts) => {
        const {path: pathToFile, name} = opts.input;
        const previousPath = path.resolve(projectsDirectory, pathToFile);
        if (!fs.existsSync(previousPath)) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Path does not exist',
            });
        }
        const directory = path.dirname(previousPath);
        const newPath = path.resolve(directory, name);

        if (fs.existsSync(newPath)) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Path already exists',
            });
        }
        fs.renameSync(previousPath, newPath);
        return 'File renamed';
    });
