import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { spawn } from 'child_process';
import { JSONRPCClient, JSONRPCResponse } from 'json-rpc-2.0';
import { JSONRPCTransform } from 'ts-lsp-client';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter, createContext } from '@repo/api';

let id = 1;
const newId = () => id++;

dotenv.config();

const app: Express = express();
const port = process.env.PORT ?? 3000;

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

app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext,
    })
);
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
