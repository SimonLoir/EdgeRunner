import { spawn } from 'child_process';
import EventEmitter from 'node:events';
import * as rpc from 'vscode-jsonrpc/node';

export const pythonEvents = new EventEmitter();

export const getPythonServer = () => {
    const p = spawn('pylsp', ['-vv'], {
        shell: true,
        stdio: 'pipe',
    });

    const stream = rpc.createMessageConnection(
        new rpc.StreamMessageReader(p.stdout),
        new rpc.StreamMessageWriter(p.stdin)
    );

    stream.listen();

    return { stream };
};
