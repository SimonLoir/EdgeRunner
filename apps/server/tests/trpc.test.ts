/* eslint-disable no-undef */
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { AppRouter } from '@repo/api';
import { ChildProcess, execSync } from 'node:child_process';
//@ts-ignore spwan-command-with-kill is not typed
import spawn from 'spawn-command-with-kill';
import { pathToFileURL } from 'url';
import { tmpdir } from 'node:os';
import { cpSync } from 'node:fs';
import * as fs from 'fs';

let trpc: ReturnType<typeof createTRPCClient<AppRouter>>;

let script: ChildProcess;
let dir: string;
let fileDir: string;

/**
 * Sends an initialize request to the TypeScript LSP server
 * @param trpc The trpc client to use
 * @param dir The directory to initialize the LSP server in
 */
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
    // Copy the test directory to a temporary directory
    const tmpdirLocation = tmpdir() + '/lsp-test';
    dir = tmpdirLocation + '/test';
    cpSync(__dirname + '/test', dir, { recursive: true });
    fileDir = pathToFileURL(dir).href;

    // Install the dependencies in the temporary directory
    const exec = execSync('npm install', { cwd: tmpdirLocation + '/test' });
    console.log(exec.toString());
});

beforeEach(async () => {
    // Spawns the server
    script = spawn('npm run dev', {});

    // Waits for the server to start
    await new Promise((resolve) => {
        if (!script.stdout) throw new Error('No stdout');
        script.stdout.on('data', (data) => {
            if (data.toString().includes('localhost:3000')) {
                resolve(undefined);
            }
        });
    });

    // Creates a trpc client
    trpc = createTRPCClient<AppRouter>({
        links: [
            httpBatchLink({
                url: 'http://localhost:3000/trpc',
            }),
        ],
    });
});

it('should initialize a LSP session', async () => {
    const result = await init(trpc, fileDir);
    expect(result.capabilities).toBeDefined();
});

describe('lsp capabilities', () => {
    beforeEach(async () => {
        // Initialize the LSP session
        await init(trpc, fileDir);

        // Open the file index.ts in the LSP session
        await trpc.lsp.didOpen.query({
            language: 'typescript',
            options: {
                textDocument: {
                    uri: fileDir + '/index.ts',
                    languageId: 'typescript',
                    version: 1,
                    text: fs.readFileSync(dir + '/index.ts', 'utf-8'),
                },
            },
        });
    });

    it('should give info about hover', async () => {
        const result = await trpc.lsp.hover.query({
            language: 'typescript',
            options: {
                textDocument: {
                    uri: fileDir + '/index.ts',
                },
                position: {
                    line: 0,
                    character: 1,
                },
            },
        });

        expect(result.contents.value).toContain('console');
    });

    it('should give info about semantic tokens', async () => {
        const result = await trpc.lsp.semanticTokens.query({
            language: 'typescript',
            options: {
                textDocument: {
                    uri: fileDir + '/index.ts',
                },
            },
        });

        expect(result.data.length).toBeGreaterThan(0);
    });
});

afterEach(() => {
    script.kill('SIGTERM');
});

afterAll(() => {
    fs.rmdirSync(dir, { recursive: true });
});
