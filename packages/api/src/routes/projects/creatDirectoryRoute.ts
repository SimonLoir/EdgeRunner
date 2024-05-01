import { publicProcedure } from '@/trpc';
import { pathSchema } from '@repo/types/Files';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import path from 'node:path';
import fs from 'fs';
import { projectsDirectory } from './index';

export const creatDirectoryRoute = publicProcedure
    .input(pathSchema)
    .output(z.string())
    .mutation((opts) => {
        const { path: pathToFile } = opts.input;
        if (pathToFile === '') {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Path cannot be empty',
            });
        }
        const directoryName = path.basename(pathToFile);
        const directory = path.dirname(
            path.resolve(projectsDirectory, pathToFile)
        );
        if (!fs.existsSync(directory)) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Path does not exist',
            });
        }
        const directoryPath = path.resolve(directory, directoryName);
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath);
            return 'Directory created';
        } else {
            if (fs.lstatSync(directoryPath).isDirectory()) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Directory already exists',
                });
            } else {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message:
                        'File with name "' + directoryName + '" already exists',
                });
            }
        }
    });
