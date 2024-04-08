import { publicProcedure } from '@/trpc';
import { getClient, lspRouterInputSchema } from '../clients';
import {
    codeActionParamsSchema,
    codeActionSchema,
    commandSchema,
} from '@/schemas/exportedSchemas';
import { z } from 'zod';

export const codeActionInputSchema = lspRouterInputSchema.extend({
    options: codeActionParamsSchema,
});
export const codeActionRoute = publicProcedure
    .input(codeActionInputSchema)
    .output(z.union([codeActionSchema, commandSchema]).array())
    .query(async ({ input }) => {
        const client = getClient(input.language, input.workspaceID);
        return await client.sendRequest(
            'textDocument/codeAction',
            input.options
        );
    });
