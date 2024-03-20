import { publicProcedure } from '@/trpc';
import { getClient, lspRouterInputSchema } from '../clients';
import { typeDefinitionParamsSchema } from '@/schemas/exportedSchemas';

export const typeDefinitionInputSchema = lspRouterInputSchema.extend({
    options: typeDefinitionParamsSchema,
});
export const typeDefinitionRoute = publicProcedure
    .input(typeDefinitionInputSchema)
    .query(async ({ input }) => {
        const client = getClient(input.language, input.workspaceID);
        return await client.request(
            'textDocument/typeDefinition',
            input.options,
            undefined
        );
    });
