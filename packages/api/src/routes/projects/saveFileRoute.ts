import {publicProcedure} from '@/trpc';
import {fileSchema} from '@repo/types/Files';
import path from 'node:path';
import fs from 'fs';
import {TRPCError} from '@trpc/server';
import {projectsDirectory} from './index';

export const saveFileRoute = publicProcedure
    .input(fileSchema)
    .mutation((opts) => {
        const {path: pathToFile, content} = opts.input;

        const directory = path.resolve(projectsDirectory, pathToFile);
        if (!fs.existsSync(directory)) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Path does not exist',
            });
        }
        fs.writeFileSync(directory, content);
        return 'File saved';
    });
