import { publicProcedure } from '@/trpc';
import { fileSchema, pathSchema } from '@repo/types/Files';
import path from 'node:path';
import fs from 'fs';
import { TRPCError } from '@trpc/server';
import { projectsDirectory } from './index';

export const getFileRoute = publicProcedure
    .input(pathSchema)
    .output(fileSchema)
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
        if (!pathDetails.isDirectory()) {
            return {
                path: pathToFile,
                content: fs.readFileSync(directory, 'utf-8'),
            };
        }
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Path does not exist',
        });
    });
