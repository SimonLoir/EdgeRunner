import { publicProcedure, router } from '../../trpc';
import { getDirectoryTree, getDirInDirectory } from '../../../../utils';
import * as fs from 'fs';
import path from 'node:path';
import { z } from 'zod';

export const projectsDirectory = path.resolve(
    __dirname,
    '../../../../../projects'
);
export const projectsRouter = router({
    getProjects: publicProcedure.query(() => {
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
    getFile: publicProcedure
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
            if (!pathDetails.isDirectory()) {
                return {
                    path: pathToFile,
                    content: fs.readFileSync(directory, 'utf-8'),
                };
            }
            return 'File does not exist';
        }),
    getDirectory: publicProcedure
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
                return {
                    path: pathToFile,
                    type: 'directory',
                    children: getDirectoryTree(directory),
                };
            }
            return 'Directory does not exist';
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

    saveFile: publicProcedure
        .input(
            z.object({
                path: z.string(),
                content: z.string(),
            })
        )
        .mutation((opts) => {
            const { path: pathToFile, content } = opts.input;
            const directory = path.resolve(projectsDirectory, pathToFile);
            if (!fs.existsSync(directory)) {
                return 'Path does not exist';
            }
            fs.writeFileSync(directory, content);
            return 'File saved';
        }),

    renameSlug: publicProcedure
        .input(
            z.object({
                path: z.string(),
                previousName: z.string(),
                newName: z.string(),
            })
        )
        .mutation((opts) => {
            const { path: pathToFile, previousName, newName } = opts.input;
            const directory = path.resolve(projectsDirectory, pathToFile);
            if (!fs.existsSync(directory)) {
                return 'Path does not exist';
            }
            const previousPath = path.resolve(directory, previousName);
            const newPath = path.resolve(directory, newName);
            if (!fs.existsSync(previousPath)) {
                return 'File does not exist';
            }
            if (fs.existsSync(newPath)) {
                return 'File with name "' + newName + '" already exists';
            }
            fs.renameSync(previousPath, newPath);
            return 'File renamed';
        }),

    deleteSlug: publicProcedure
        .input(
            z.object({
                path: z.string(),
            })
        )
        .mutation((opts) => {
            const { path: pathToFile } = opts.input;
            const directory = path.resolve(projectsDirectory, pathToFile);
            if (!fs.existsSync(directory)) {
                return 'Path does not exist';
            }
            if (fs.lstatSync(directory).isDirectory()) {
                fs.rmdirSync(directory);
                return 'Directory deleted';
            }
            fs.rmSync(directory);
            return 'File deleted';
        }),
});
