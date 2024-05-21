import { z } from 'zod';
import { getTypeScriptServer } from '@/languages/typescript';
import { TRPCError } from '@trpc/server';
import { getPythonServer } from '@/languages/python';
import { getSourceKitServer } from '@/languages/sourcekit';
import { getSwiplServer } from '@/languages/siwpl';

export type Client = ReturnType<typeof getTypeScriptServer>['stream'];

export const lspRouterInputSchema = z.object({
    language: z
        .literal('typescript')
        .or(z.literal('python'))
        .or(z.literal('c'))
        .or(z.literal('swift'))
        .or(z.literal('prolog')),
    workspaceID: z.string(),
});

export type LspRouterInput = z.infer<typeof lspRouterInputSchema>;
export type Language = LspRouterInput['language'];

export const clients = new Map<string, Client>();

export const getClient = (language: Language, workspaceID: string) => {
    let client = clients.get(language + workspaceID);
    if (!client) {
        switch (language) {
            case 'typescript':
                client = getTypeScriptServer().stream;
                break;
            case 'python':
                client = getPythonServer().stream;
                break;
            case 'c':
            case 'swift':
                client = getSourceKitServer().stream;
                break;
            case 'prolog':
                client = getSwiplServer().stream;
                break;
            default:
                throw new TRPCError({
                    code: 'NOT_IMPLEMENTED',
                    message: 'Not implemented',
                });
        }
        clients.set(language + workspaceID, client as Client);
    }

    return client;
};
