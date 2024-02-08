import { spawn} from "child_process";
import * as path from "path";
import {LspClient, JSONRPCEndpoint} from "ts-lsp-client";
import {pathToFileURL} from "url";

const rootPath = path.resolve(path.join(__dirname, 'test'));
const process = spawn(
    path.join(__dirname, './', 'node_modules', '.bin', 'typescript-language-server'),
    ['--stdio'],
    {
        shell: true,
        stdio: 'pipe'
    }
);

// create an RPC endpoint for the process
const endpoint = new JSONRPCEndpoint(
    process.stdin,
    process.stdout,
);

// create the LSP client
const client = new LspClient(endpoint);

(async () => {
    const result = await client.initialize({
        processId: process.pid ?? null,
        capabilities: {},
        clientInfo: {
            name: 'lspClientExample',
            version: '0.0.9'
        },
        workspaceFolders: [
            {
                name: 'workspace',
                uri: pathToFileURL(rootPath).href
            }
        ],
        rootUri: null,
        initializationOptions: {
            tsserver: {
                logDirectory: '.log',
                logVerbosity: 'verbose',
                trace: 'verbose'
            }
        }
    });
    console.log(result);

    client.didOpen({
        textDocument: {
            uri: pathToFileURL(path.join(rootPath, 'index.ts')).href,
            languageId: 'typescript',
            version: 1,
            text: `console.log("hello world")`
        }
    })

    console.log('waiting for diagnostics');
    //const result2 = await client.once('textDocument/publishDiagnostics');
    //console.log(result2);

    const r = await client.definition({
        textDocument: {
            uri: pathToFileURL(path.join(rootPath, 'index.ts')).href
        },
        position: {
            line: 0,
            character: 5
        }
    })
    console.log(r);
})();