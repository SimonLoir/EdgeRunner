import * as fs from 'fs';
import path from 'node:path';
import { Directory, nameSchema } from './types/Files';
import { z } from 'zod';
export function getDirectoryTree(
    directoryPath: string
): (Directory | z.infer<typeof nameSchema>)[] {
    if (!fs.existsSync(directoryPath)) {
        return [];
    }

    const files = fs.readdirSync(directoryPath);
    const tree: (Directory | z.infer<typeof nameSchema>)[] = [];
    files.forEach((file) => {
        const fileDetails = fs.lstatSync(path.resolve(directoryPath, file));
        if (fileDetails.isDirectory()) {
            tree.push({
                path: file,
                children: getDirectoryTree(path.resolve(directoryPath, file)),
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
            console.log('Directory: ' + file);
            directories.push(file);
        }
    });

    return directories;
}
