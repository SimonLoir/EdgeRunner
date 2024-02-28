import { publicProcedure } from '../../trpc';
import { hoverParamsSchema, hoverSchema } from '../../schemas/modelsZod';
import { getClient, lspRouterInputSchema } from './clients';
import { z } from 'zod';
export const hoverInputSchema = lspRouterInputSchema.extend({
    options: hoverParamsSchema,
});

export const hoverRoute = publicProcedure
    .input(hoverInputSchema)
    .output(z.any())
    .query(async ({ input }) => {
        const client = getClient(input.language);
        return await client.request(
            'textDocument/hover',
            input.options,
            undefined
        );
    });
