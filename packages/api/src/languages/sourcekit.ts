import { spawn } from 'child_process';
import EventEmitter from 'node:events';
import * as rpc from 'vscode-jsonrpc/node';

export const sourceKitEvents = new EventEmitter();

export const getSourceKitServer = () => {
    const p = spawn('sourcekit-lsp', ['--log-level', 'debug'], {
        shell: true,
        stdio: 'pipe',
    });

    const stream = rpc.createMessageConnection(
        new rpc.StreamMessageReader(p.stdout),
        new rpc.StreamMessageWriter(p.stdin)
    );

    p.stdout.on('data', (data) => {
        console.log(data.toString());
    });

    p.stdout.on('close', () => {
        console.log('sourcekit-lsp closed');
    });

    p.stderr.on('data', (data) => {
        console.error('\x1b[31m' + data.toString() + '\x1b[0m');
    });

    stream.listen();
    return { stream };
};
