import { publicProcedure } from '@/trpc';
import { getClient, lspRouterInputSchema } from '../clients';
import { z } from 'zod';
export const semanticTokensInputSchema = lspRouterInputSchema.extend({
    options: z.object({
        textDocument: z.object({
            uri: z.string(),
        }),
    }),
});
export const semanticTokensRoute = publicProcedure
    .input(semanticTokensInputSchema)
    .output(z.any())
    .query(async ({ input }) => {
        const client = getClient(input.language, input.workspaceID);
        return await client.sendRequest(
            'textDocument/semanticTokens/full',
            input.options
        );
    });
