import * as fs from 'fs';
import path from 'node:path';
import { Directory, nameSchema } from '@repo/types/Files';
import { z } from 'zod';
import { projectsDirectory } from './routes/projects';
export function getDirectoryTree(
    pathToFile: string
): (Directory | z.infer<typeof nameSchema>)[] {
    const directory = path.resolve(projectsDirectory, pathToFile);

    if (!fs.existsSync(directory)) {
        return [];
    }

    const files = fs.readdirSync(directory);
    const tree: (Directory | z.infer<typeof nameSchema>)[] = [];
    files.forEach((file) => {
        const fileDetails = fs.lstatSync(path.resolve(directory, file));
        if (fileDetails.isDirectory()) {
            tree.push({
                path: path.join(pathToFile, file),
                children: getDirectoryTree(path.join(pathToFile, file)),
            });
        } else {
            tree.push({ name: file });
        }
    });
    return tree;
}

export function getDirInDirectory(directoryPath: string) {
    if (!fs.existsSync(directoryPath)) {
        return [];
    }

    const directories: string[] = [];
    const files = fs.readdirSync(directoryPath);

    files.forEach((file) => {
        // get the details of the file
        const fileDetails = fs.lstatSync(path.resolve(directoryPath, file));
        // check if the file is directory
        if (fileDetails.isDirectory()) {
            directories.push(file);
        }
    });

    return directories;
}
