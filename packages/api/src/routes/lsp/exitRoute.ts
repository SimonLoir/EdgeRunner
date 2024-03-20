import { publicProcedure } from '@/trpc';
import { getClient, lspRouterInputSchema } from './clients';

export const exitInputSchema = lspRouterInputSchema;
export const exitRoute = publicProcedure
    .input(exitInputSchema)
    .query(async ({ input }) => {
        const client = getClient(input.language, input.workspaceID);
        return await client.request('exit', {}, undefined);
    });
