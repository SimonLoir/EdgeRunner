import { publicProcedure, router } from '../../trpc';
import { getDirInDirectory } from '../../../../utils';
import * as fs from 'fs';
import path from 'node:path';
import { z } from 'zod';

export const projectsDirectory = path.resolve(
    __dirname,
    '../../../../../projects'
);
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
            const directory = path.resolve(projectsDirectory, input.name);
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
    getFromPath: publicProcedure
        .input(
            z.object({
                path: z.string(),
            })
        )
        .query((opts) => {
            const { path: pathToFile } = opts.input;
            const directory = path.resolve(projectsDirectory, pathToFile);

            if (!fs.existsSync(directory)) {
                return 'Path does not exist';
            }
            const pathDetails = fs.lstatSync(directory);
            if (pathDetails.isDirectory()) {
                return getDirInDirectory(directory);
            } else {
                return fs.readFileSync;
            }
        }),
    createFile: publicProcedure
        .input(
            z.object({
                path: z.string(),
                fileName: z.string(),
            })
        )
        .mutation((opts) => {
            const { path: pathToFile, fileName } = opts.input;
            const directory = path.resolve(projectsDirectory, pathToFile);
            if (!fs.existsSync(directory)) {
                return 'Path does not exist';
            }
            const filePath = path.resolve(directory, fileName);

            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, '');
                return 'File created';
            } else {
                if (fs.lstatSync(filePath).isDirectory()) {
                    return (
                        'Directory with name "' + fileName + '" already exists'
                    );
                } else {
                    return 'File with name "' + fileName + '" already exists';
                }
            }
        }),
    createDirectory: publicProcedure
        .input(
            z.object({
                path: z.string(),
                directoryName: z.string(),
            })
        )
        .mutation((opts) => {
            const { path: pathToFile, directoryName } = opts.input;
            const directory = path.resolve(projectsDirectory, pathToFile);
            if (!fs.existsSync(directory)) {
                return 'Path does not exist';
            }
            const directoryPath = path.resolve(directory, directoryName);
            if (!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath);
                return 'Directory created';
            } else {
                if (fs.lstatSync(directoryPath).isDirectory()) {
                    return (
                        'Directory with name "' +
                        directoryName +
                        '" already exists'
                    );
                } else {
                    return (
                        'File with name "' + directoryName + '" already exists'
                    );
                }
            }
        }),
});
