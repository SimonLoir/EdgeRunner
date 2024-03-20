import { publicProcedure } from '@/trpc';
import { getClient, lspRouterInputSchema } from '../clients';
import { z } from 'zod';

//TODO: find type for formatting params
export const formattingInputSchema = lspRouterInputSchema.extend({
    options: z.any(),
});
export const referencesRoute = publicProcedure
    .input(formattingInputSchema)
    .query(async ({ input }) => {
        const client = getClient(input.language, input.workspaceID);
        return await client.request(
            'textDocument/formatting',
            input.options,
            undefined
        );
    });
