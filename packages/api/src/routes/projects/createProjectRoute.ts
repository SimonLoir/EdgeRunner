import { publicProcedure } from '@/trpc';
import { nameSchema } from '@repo/types/Files';
import { z } from 'zod';
import path from 'node:path';
import fs from 'fs';
import { projectsDirectory } from './index';

export const createProjectRoute = publicProcedure
    .input(nameSchema)
    .output(z.string())
    .mutation((opts) => {
        const { input } = opts;
        const directory = path.resolve(projectsDirectory, input.name);
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory);
            return 'Project created';
        } else {
            if (fs.lstatSync(directory).isDirectory()) {
                return 'Project with name "' + input.name + '" already exists';
            } else {
                return 'File with name "' + input.name + '" already exists';
            }
        }
    });
