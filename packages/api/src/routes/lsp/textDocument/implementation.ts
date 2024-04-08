import { publicProcedure } from '@/trpc';
import { getClient, lspRouterInputSchema } from '../clients';
import { implementationParamsSchema } from '@/schemas/exportedSchemas';

export const implementationInputSchema = lspRouterInputSchema.extend({
    options: implementationParamsSchema,
});
export const implementationRoute = publicProcedure
    .input(implementationInputSchema)
    .query(async ({ input }) => {
        const client = getClient(input.language, input.workspaceID);
        return await client.sendRequest(
            'textDocument/implementation',
            input.options
        );
    });
