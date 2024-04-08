import { spawn } from 'child_process';
import EventEmitter from 'node:events';
import * as rpc from 'vscode-jsonrpc/node';

export const typescriptEvents = new EventEmitter();

export const getTypeScriptServer = () => {
    const p = spawn('typescript-language-server', ['--stdio'], {
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
