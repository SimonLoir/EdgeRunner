import { z } from 'zod';
import { getTypeScriptServer } from '../../languages/typescript';
import { TRPCError } from '@trpc/server';

export const lspRouterInputSchema = z.object({
    language: z.literal('typescript'),
});

export type LspRouterInput = z.infer<typeof lspRouterInputSchema>;
export type Language = LspRouterInput['language'];

export const typeScriptServer = getTypeScriptServer();

export const clients = new Map<Language, typeof typeScriptServer.client>([
    ['typescript', typeScriptServer.client],
]);

export const getClient = (language: Language) => {
    const client = clients.get(language);
    if (!client)
        throw new TRPCError({
            code: 'NOT_IMPLEMENTED',
            message: 'Not implemented',
        });
    return client;
};
