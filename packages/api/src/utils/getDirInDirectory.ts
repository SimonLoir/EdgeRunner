import fs from 'fs';
import path from 'node:path';

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
