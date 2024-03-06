import { publicProcedure } from '@/trpc';
import { getClient, lspRouterInputSchema } from '../clients';
import { referenceParamsSchema } from '@/schemas/exportedSchemas';

export const referencesInputSchema = lspRouterInputSchema.extend({
    options: referenceParamsSchema,
});
export const referencesRoute = publicProcedure
    .input(referencesInputSchema)
    .query(async ({ input }) => {
        const client = getClient(input.language);
        return await client.request(
            'textDocument/references',
            input.options,
            undefined
        );
    });
