import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { spawn } from 'child_process';
import { JSONRPCClient, JSONRPCResponse } from 'json-rpc-2.0';
import { JSONRPCTransform } from 'ts-lsp-client';
import * as fs from 'fs';
import path from 'node:path';
import { getDirectoryTree, getDirInDirectory, directoryTree } from './utils';

let id = 1;
const newId = () => id++;

dotenv.config();

const app: Express = express();
const port = process.env.PORT ?? 3000;
const rootDirectory = __dirname;

app.get('/', async (req: Request, res: Response) => {
    const p = spawn('typescript-language-server', ['--stdio'], {
        shell: true,
        stdio: 'pipe',
    });

    const stream = JSONRPCTransform.createStream(p.stdout);

    const client = new JSONRPCClient<any>((jsonRPCRequest) => {
        const jsonRPCRequestStr = JSON.stringify(jsonRPCRequest);
        console.log(jsonRPCRequestStr);
        p.stdin.write(
            `Content-Length: ${jsonRPCRequestStr.length}\r\n\r\n${jsonRPCRequestStr}`
        );
    }, newId);

    stream.on('data', (jsonRPCResponseOrRequest: string) => {
        const jsonrpc = JSON.parse(jsonRPCResponseOrRequest);
        console.log(jsonrpc);
        if (Object.prototype.hasOwnProperty.call(jsonrpc, 'id')) {
            const jsonRPCResponse: JSONRPCResponse = jsonrpc as JSONRPCResponse;
            if (jsonRPCResponse.id === id - 1) {
                client.receive(jsonRPCResponse);
            }
        }
    });

    const a = await client.request(
        'initialize',
        {
            processId: process.pid ?? null,
            capabilities: {},
            clientInfo: {
                name: 'lspClientExample',
                version: '0.0.9',
            },
            workspaceFolders: [
                {
                    name: 'workspace',
                    uri: '/tmp/test',
                },
            ],
            rootUri: null,
            initializationOptions: {
                tsserver: {
                    logDirectory: '.log',
                    logVerbosity: 'verbose',
                    trace: 'verbose',
                },
            },
        },
        {}
    );

    client.notify(
        'textDocument/didOpen',
        {
            textDocument: {
                uri: '/tmp/test/index.ts',
                languageId: 'typescript',
                version: 1,
                text: 'console.log("hello world")',
            },
        },
        {}
    );

    const test = await client.request(
        'textDocument/hover',
        {
            textDocument: {
                uri: '/tmp/test/index.ts',
            },
            position: {
                line: 0,
                character: 5,
            },
        },
        {}
    );

    console.log('x', a, test);

    p.stdin.write('Hello world !');
    res.send('Hello world !');
});
app.use(express.json());
app.use(express.urlencoded());
app.route('/projects')
    .get((req: Request, res: Response) => {
        const directory = rootDirectory + '\\projects';
        res.send(getDirInDirectory(directory));
    })
    .post(async (req: Request, res: Response) => {
        const directory = rootDirectory + '\\projects';
        const projectName = req.body.projectName;
        const projectPath = path.resolve(directory, projectName);
        console.log('Creating project: ' + projectPath);

        if (!fs.existsSync(projectPath)) {
            fs.mkdirSync(projectPath);
            res.send('Project created');
        } else {
            res.send('Project with name "' + projectName + '" already exists');
        }
    });

app.route('/projects/:path(*)')
    .get((req: Request, res: Response) => {
        if (req.params.path === undefined) {
            res.send('Invalid argument');
            return;
        }
        const directory = path.resolve(
            rootDirectory,
            'projects',
            req.params.path
        );

        if (!fs.existsSync(directory)) {
            res.send('Path does not exist');
            return;
        }

        const pathDetails = fs.lstatSync(directory);

        if (pathDetails.isDirectory()) {
            const tree: directoryTree[] = getDirectoryTree(directory);
            res.send(tree);
        } else {
            console.log('Sending file: ' + path);
            res.sendFile(directory);
        }
    })
    .post((req: Request, res: Response) => {
        if (req.params.path === undefined) {
            res.send('Invalid argument');
            return;
        }
        const directory = path.resolve(
            rootDirectory,
            'projects',
            req.params.path
        );
        if (!fs.existsSync(directory)) {
            res.send('Path does not exist');
            return;
        }
        const fileName: string = req.body.fileName;
        const isFile: Boolean = req.body.isFile;

        const pathDetails = fs.lstatSync(directory);

        if (pathDetails.isDirectory()) {
            if (isFile) {
                const filePath = path.resolve(directory, fileName);
                if (!fs.existsSync(filePath)) {
                    fs.writeFileSync(filePath, '');
                    res.send('File created');
                } else {
                    if (fs.lstatSync(filePath).isDirectory()) {
                        res.send(
                            'Directory with name "' +
                                fileName +
                                '" already exists'
                        );
                    } else {
                        res.send(
                            'File with name "' + fileName + '" already exists'
                        );
                    }
                }
            } else {
                const directoryPath = path.resolve(directory, fileName);
                if (!fs.existsSync(directoryPath)) {
                    fs.mkdirSync(directoryPath);
                    res.send('Directory created');
                } else {
                    if (fs.lstatSync(directoryPath).isDirectory()) {
                        res.send(
                            'Directory with name "' +
                                fileName +
                                '" already exists'
                        );
                    } else {
                        res.send(
                            'File with name "' + fileName + '" already exists'
                        );
                    }
                }
            }
        } else {
            res.sendStatus(403);
        }
    })
    .put((req: Request, res: Response) => {
        if (req.params.path === undefined) {
            res.send('Invalid argument');
            return;
        }
        const directory = path.resolve(
            rootDirectory,
            'projects',
            req.params.path
        );

        if (!fs.existsSync(directory)) {
            res.send('Path does not exist');
            return;
        }
    });

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
