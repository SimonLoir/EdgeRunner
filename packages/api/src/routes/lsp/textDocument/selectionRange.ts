import { publicProcedure } from '@/trpc';
import { getClient, lspRouterInputSchema } from '../clients';
import {
    selectionRangeParamsSchema,
    selectionRangeSchema,
} from '@/schemas/exportedSchemas';

export const selectionRangeInputSchema = lspRouterInputSchema.extend({
    options: selectionRangeParamsSchema,
});
export const selectionRangeRoute = publicProcedure
    .input(selectionRangeInputSchema)
    .output(selectionRangeSchema.array())
    .query(async ({ input }) => {
        const client = getClient(input.language, input.workspaceID);
        return await client.sendRequest(
            'textDocument/selectionRange',
            input.options
        );
    });
