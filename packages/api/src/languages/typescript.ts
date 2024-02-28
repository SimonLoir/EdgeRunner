import { spawn } from 'child_process';
import { JSONRPCClient, JSONRPCResponse } from 'json-rpc-2.0';
import { JSONRPCTransform } from 'ts-lsp-client';

let currentID = 1;
export const getTypeScriptServer = () => {
    const p = spawn('typescript-language-server', ['--stdio'], {
        shell: true,
        stdio: 'pipe',
    });

    const stream = JSONRPCTransform.createStream(p.stdout);

    const client = new JSONRPCClient<any>(
        (jsonRPCRequest) => {
            const jsonRPCRequestStr = JSON.stringify(jsonRPCRequest);
            console.log(jsonRPCRequestStr);
            p.stdin.write(
                `Content-Length: ${jsonRPCRequestStr.length}\r\n\r\n${jsonRPCRequestStr}`
            );
        },
        () => currentID++
    );

    stream.on('data', (jsonRPCResponseOrRequest: string) => {
        const jsonrpc = JSON.parse(jsonRPCResponseOrRequest);
        console.log(jsonrpc);
        if (Object.prototype.hasOwnProperty.call(jsonrpc, 'id')) {
            const jsonRPCResponse: JSONRPCResponse = jsonrpc as JSONRPCResponse;
            if (jsonRPCResponse.id === currentID - 1) {
                client.receive(jsonRPCResponse);
            }
        }
    });

    return { stream, client };
};
