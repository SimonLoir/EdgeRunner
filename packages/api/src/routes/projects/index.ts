import { publicProcedure, router } from '../../trpc';
import { getDirectoryTree, getDirInDirectory } from '../../../../utils';
import * as fs from 'fs';
import path from 'node:path';
import { z } from 'zod';
import {
    nameSchema,
    pathSchema,
    fileSchema,
    directorySchema,
    renameFileSchema,
} from '@repo/types/Files';
import { TRPCError } from '@trpc/server';

export const projectsDirectory = path.resolve(
    __dirname,
    '../../../../../projects'
);
export const projectsRouter = router({
    getProjects: publicProcedure.query(() => {
        return getDirInDirectory(projectsDirectory);
    }),
    createProject: publicProcedure
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
                    return (
                        'Project with name "' + input.name + '" already exists'
                    );
                } else {
                    return 'File with name "' + input.name + '" already exists';
                }
            }
        }),
    getFile: publicProcedure
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
        }),
    getDirectory: publicProcedure
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
                    children: getDirectoryTree(directory),
                };
            }

            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Path does not exist',
            });
        }),
    createFile: publicProcedure.input(pathSchema).mutation((opts) => {
        const { path: pathToFile } = opts.input;
        const fileName = path.basename(pathToFile);
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
                return 'Directory with name "' + fileName + '" already exists';
            } else {
                return 'File with name "' + fileName + '" already exists';
            }
        }
    }),
    createDirectory: publicProcedure
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
                            'File with name "' +
                            directoryName +
                            '" already exists',
                    });
                }
            }
        }),

    saveFile: publicProcedure.input(fileSchema).mutation((opts) => {
        const { path: pathToFile, content } = opts.input;
        const directory = path.resolve(projectsDirectory, pathToFile);
        if (!fs.existsSync(directory)) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Path does not exist',
            });
        }
        fs.writeFileSync(directory, content);
        return 'File saved';
    }),

    renameSlug: publicProcedure.input(renameFileSchema).mutation((opts) => {
        const { path: pathToFile, name } = opts.input;
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
    }),

    deleteSlug: publicProcedure.input(pathSchema).mutation((opts) => {
        const { path: pathToFile } = opts.input;
        const directory = path.resolve(projectsDirectory, pathToFile);
        if (!fs.existsSync(directory)) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Path does not exist',
            });
        }
        if (fs.lstatSync(directory).isDirectory()) {
            fs.rmdirSync(directory);
            return 'Directory deleted';
        }
        fs.rmSync(directory);
        return 'File deleted';
    }),
});
