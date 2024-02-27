/* eslint-disable no-undef */
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { AppRouter } from '@repo/api';

describe('trpc', () => {
    let trpc: ReturnType<typeof createTRPCClient<AppRouter>>;

    beforeAll(() => {
        trpc = createTRPCClient<AppRouter>({
            links: [
                httpBatchLink({
                    url: 'http://localhost:3000/trpc',
                }),
            ],
        });
        console.log('trpc', trpc);
    });

    it('should work', async () => {
        expect(await trpc.test.query({ name: 'test' })).toContain('Hello');
    });
});
