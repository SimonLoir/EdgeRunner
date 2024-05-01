import { publicProcedure } from '@/trpc';
import { directorySchema, pathSchema } from '@repo/types/Files';
import path from 'node:path';
import fs from 'fs';
import { TRPCError } from '@trpc/server';
import { getDirectoryTree } from '@/utils';
import { projectsDirectory } from './index';

export const getDirectoryRoute = publicProcedure
    .input(pathSchema)
    .output(directorySchema)
    .query((opts) => {
        const { path: pathToFile } = opts.input;
        const directory = path.resolve(projectsDirectory, pathToFile);

        if (!fs.existsSync(directory)) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Path does not exist',
            });
        }
        const pathDetails = fs.lstatSync(directory);
        if (pathDetails.isDirectory()) {
            return {
                path: pathToFile,
                children: getDirectoryTree(pathToFile),
            };
        }

        throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Path does not exist',
        });
    });
