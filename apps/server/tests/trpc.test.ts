/* eslint-disable no-undef */
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { AppRouter } from '@repo/api';
import { ChildProcess } from 'node:child_process';
//@ts-ignore spwan-command-with-kill is not typed
import spawn from 'spawn-command-with-kill';
let trpc: ReturnType<typeof createTRPCClient<AppRouter>>;

let script: ChildProcess;
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

describe('trpc', () => {
    it('should work', async () => {
        expect(await trpc.test.query({ name: 'test' })).toContain('Hello');
    });

    it('should work 2', async () => {
        expect(await trpc.test.query({ name: 'test' })).toContain('Hello');
    });
});

afterEach(() => {
    script.kill('SIGTERM');
});
