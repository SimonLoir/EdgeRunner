import { publicProcedure } from '../../trpc';
import { lspRouterInputSchema } from './index';
import { hoverParamsSchema } from '../../../schemas/modelsZod';
import { z } from 'zod';

export const hoverInputSchema = lspRouterInputSchema.extend({
    options: hoverParamsSchema,
});

export const hoverRoute = publicProcedure
    .input(hoverInputSchema)
    .output(z.any())
    .query(() => {
        return {};
    });
