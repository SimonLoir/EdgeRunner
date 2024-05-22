import { Directory, nameSchema } from '@repo/types/Files';
import { z } from 'zod';
import path from 'node:path';
import { projectsDirectory } from '../routes/projects';
import fs from 'fs';

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
