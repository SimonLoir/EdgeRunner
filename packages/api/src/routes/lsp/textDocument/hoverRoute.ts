import { publicProcedure } from '@/trpc';
import { hoverParamsSchema, hoverSchema } from '@/schemas/zodSchemas';
import { getClient, lspRouterInputSchema } from '../clients';
export const hoverInputSchema = lspRouterInputSchema.extend({
    options: hoverParamsSchema,
});

export const hoverRoute = publicProcedure
    .input(hoverInputSchema)
    .output(hoverSchema.nullable())
    .query(async ({ input }) => {
        const client = getClient(input.language, input.workspaceID);
        return await client.request(
            'textDocument/hover',
            input.options,
            undefined
        );
    });
