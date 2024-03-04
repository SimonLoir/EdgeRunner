import { publicProcedure } from '../../trpc';
import { hoverParamsSchema, hoverSchema } from '../../schemas/zodSchemas';
import { getClient, lspRouterInputSchema } from './clients';
import { z } from 'zod';
export const hoverInputSchema = lspRouterInputSchema.extend({
    options: hoverParamsSchema,
});

export const hoverRoute = publicProcedure
    .input(hoverInputSchema)
    .output(hoverSchema)
    .query(async ({ input }) => {
        const client = getClient(input.language);
        return await client.request(
            'textDocument/hover',
            input.options,
            undefined
        );
    });
