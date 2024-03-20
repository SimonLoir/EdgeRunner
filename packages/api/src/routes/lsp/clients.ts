import { z } from 'zod';
import { getTypeScriptServer } from '@/languages/typescript';
import { TRPCError } from '@trpc/server';

export type Client = ReturnType<typeof getTypeScriptServer>['client'];

export const lspRouterInputSchema = z.object({
    language: z.literal('typescript'),
    workspaceID: z.string(),
});

export type LspRouterInput = z.infer<typeof lspRouterInputSchema>;
export type Language = LspRouterInput['language'];

export const clients = new Map<string, Client>();

export const getClient = (language: Language, workspaceID: string) => {
    let client = clients.get(language + workspaceID);
    if (!client) {
        if (language === 'typescript') {
            client = getTypeScriptServer().client;
        } else {
            throw new TRPCError({
                code: 'NOT_IMPLEMENTED',
                message: 'Not implemented',
            });
        }
        clients.set(language + workspaceID, client as Client);
    }

    return client;
};
