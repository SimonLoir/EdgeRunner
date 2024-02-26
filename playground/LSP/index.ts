import { spawn } from 'child_process';
import * as path from 'path';
import { LspClient, JSONRPCEndpoint } from 'ts-lsp-client';
import { pathToFileURL } from 'url';
import * as fs from 'fs';

const rootPath = path.resolve(path.join(__dirname, 'test'));
const process = spawn(
    path.join(
        __dirname,
        './',
        'node_modules',
        '.bin',
        'typescript-language-server'
    ),
    ['--stdio'],
    {
        shell: true,
        stdio: 'pipe',
    }
);

// create an RPC endpoint for the process
const endpoint = new JSONRPCEndpoint(process.stdin, process.stdout);

// create the LSP client
const client = new LspClient(endpoint);
//eslint-disable-next-line
(async () => {
    await client.initialize({
        processId: process.pid ?? null,
        capabilities: {},
        clientInfo: {
            name: 'lspClientExample',
            version: '0.0.9',
        },
        workspaceFolders: [
            {
                name: 'workspace',
                uri: pathToFileURL(rootPath).href,
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
    });

    const filename = pathToFileURL(path.join(rootPath, 'index.ts')).href;
    const fileContent = fs.readFileSync(
        filename.replace('file://', ''),
        'utf-8'
    );

    client.didOpen({
        textDocument: {
            uri: filename,
            languageId: 'typescript',
            version: 1,
            text: fileContent,
        },
    });

    const r = await endpoint.send('textDocument/semanticTokens/full', {
        textDocument: {
            uri: filename,
        },
    });
    const data: number[] = r.data;
    const tokens: number[][] = [];
    for (let i = 0; i < data.length; i += 5) {
        tokens.push(data.slice(i, i + 5));
    }
    const tokensMap = tokens.map(
        ([line, start, length, tokenType, tokenModifiers]) => ({
            line,
            start,
            length,
            tokenType,
            tokenModifiers,
        })
    );
    const documentData = fileContent.split('\n');
    let currentLine = 0;
    let lastPos = 0;
    for (const tme of tokensMap) {
        const { start, line, length } = tme;
        currentLine += line;
        if (line > 0) {
            lastPos = 0;
        }
        console.log(tme);
        console.log(
            documentData[currentLine].slice(
                lastPos + start,
                lastPos + start + length
            )
        );
        lastPos = lastPos + start;
    }

    console.log();

    await client.shutdown();
    client.exit();
})();
