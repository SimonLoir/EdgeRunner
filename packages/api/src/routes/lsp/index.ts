import { router } from '../../trpc';
import { z } from 'zod';
import { hoverRoute } from './hover';

export const lspRouterInputSchema = z.object({
    language: z.literal('typescript'),
});

export const lspRouter = router({
    hover: hoverRoute,
});
