import { publicProcedure } from '@/trpc';
import { getClient, lspRouterInputSchema } from '../clients';
import { definitionParamsSchema } from '@/schemas/exportedSchemas';

export const definitionInputSchema = lspRouterInputSchema.extend({
    options: definitionParamsSchema,
});
export const definitionRoute = publicProcedure
    .input(definitionInputSchema)
    .query(async ({ input }) => {
        const client = getClient(input.language, input.workspaceID);
        return await client.request(
            'textDocument/definition',
            input.options,
            undefined
        );
    });
