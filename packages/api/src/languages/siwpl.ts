import { spawn } from 'child_process';
import EventEmitter from 'node:events';
import * as rpc from 'vscode-jsonrpc/node';

export const swiplEvents = new EventEmitter();

export const getSwiplServer = () => {
    const p = spawn(
        'swipl',
        [
            '-g',
            '"use_module(library(lsp_server))."',
            '-g',
            '"lsp_server:main"',
            '-t',
            'halt',
            '--',
            'stdio',
        ],
        {
            shell: true,
            stdio: 'pipe',
        }
    );

    const stream = rpc.createMessageConnection(
        new rpc.StreamMessageReader(p.stdout),
        new rpc.StreamMessageWriter(p.stdin)
    );

    stream.listen();

    return { stream };
};
