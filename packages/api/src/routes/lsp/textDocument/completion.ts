import { publicProcedure } from '@/trpc';
import { getClient, lspRouterInputSchema } from '../clients';
import {
    completionItemSchema,
    completionListSchema,
    completionParamsSchema,
} from '@/schemas/exportedSchemas';
import { z } from 'zod';

export const completionInputSchema = lspRouterInputSchema.extend({
    options: completionParamsSchema,
});
export const completionRoute = publicProcedure
    .input(completionInputSchema)
    .output(
        z.union([completionListSchema, completionItemSchema.array(), z.null()])
    )
    .query(async ({ input }) => {
        const client = getClient(input.language, input.workspaceID);
        return await client.request(
            'textDocument/completion',
            input.options,
            undefined
        );
    });
