/* eslint-disable no-undef */
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { AppRouter } from '@repo/api';
import { ChildProcess, execSync } from 'node:child_process';
//@ts-ignore spwan-command-with-kill is not typed
import spawn from 'spawn-command-with-kill';
import { pathToFileURL } from 'url';
import { tmpdir } from 'node:os';
import { cpSync } from 'node:fs';

let trpc: ReturnType<typeof createTRPCClient<AppRouter>>;

let script: ChildProcess;
let dir: string;
let fileDir: string;

function init(
    trpc: ReturnType<typeof createTRPCClient<AppRouter>>,
    dir: string
) {
    return trpc.lsp.initialize.mutate({
        language: 'typescript',
        options: {
            processId: script.pid ?? null,
            capabilities: {},
            clientInfo: {
                name: 'lspClientExample',
                version: '0.0.9',
            },
            workspaceFolders: [
                {
                    name: 'workspace',
                    uri: dir,
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
    });
}

beforeAll(() => {
    const tmpdirLocation = tmpdir() + '/lsp-test';
    dir = tmpdirLocation + '/test';
    cpSync(__dirname + '/test', dir, { recursive: true });
    fileDir = pathToFileURL(dir).href;
    console.log(dir);
    const exec = execSync('npm install', { cwd: tmpdirLocation + '/test' });
    console.log(exec.toString());
});

beforeEach(async () => {
    script = spawn('npm run dev', {});

    await new Promise((resolve) => {
        if (!script.stdout) throw new Error('No stdout');
        script.stdout.on('data', (data) => {
            if (data.toString().includes('localhost:3000')) {
                resolve(undefined);
            }
        });
    });

    trpc = createTRPCClient<AppRouter>({
        links: [
            httpBatchLink({
                url: 'http://localhost:3000/trpc',
            }),
        ],
    });
});

it('should initialize a LSP session', async () => {
    console.log(fileDir);

    const result = await init(trpc, fileDir);

    expect(result.capabilities).toBeDefined();
});

describe('lsp capabilities', () => {
    console.log('hello world');
    beforeEach(async () => {
        await init(trpc, fileDir);
    });
    it('should give info about hover', async () => {
        console.log(fileDir + '/index.ts');
        const result = await trpc.lsp.hover.query({
            language: 'typescript',
            options: {
                textDocument: {
                    uri: fileDir + '/index.ts',
                },
                position: {
                    line: 1,
                    character: 1,
                },
            },
        });

        console.log(result);

        expect(result.contents).toBeDefined();
    });
});

afterEach(() => {
    script.kill('SIGTERM');
});
