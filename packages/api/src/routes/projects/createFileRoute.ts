import { publicProcedure } from '@/trpc';
import { pathSchema } from '@repo/types/Files';
import { TRPCError } from '@trpc/server';
import path from 'node:path';
import fs from 'fs';
import { projectsDirectory } from './index';

export const createFileRoute = publicProcedure
    .input(pathSchema)
    .mutation((opts) => {
        const { path: pathToFile } = opts.input;
        if (pathToFile === '') {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Path cannot be empty',
            });
        }

        const directory = path.dirname(
            path.resolve(projectsDirectory, pathToFile)
        );
        const fileName = path.basename(pathToFile);

        if (!fs.existsSync(directory)) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Path does not exist',
            });
        }
        const filePath = path.resolve(directory, fileName);
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '');
            return 'File created';
        } else {
            if (fs.lstatSync(filePath).isDirectory()) {
                return 'Directory with name "' + fileName + '" already exists';
            } else {
                return 'File with name "' + fileName + '" already exists';
            }
        }
    });
