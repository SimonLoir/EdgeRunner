import { publicProcedure } from '@/trpc';
import { getClient, lspRouterInputSchema } from '../clients';
import { didOpenTextDocumentParamsSchema } from '@/schemas/zodSchemas';

export const files = new Map<string, Set<string>>();

export const openInputSchema = lspRouterInputSchema.extend({
    options: didOpenTextDocumentParamsSchema,
});

export const didOpenRoute = publicProcedure
    .input(openInputSchema)
    .query(({ input }) => {
        const client = getClient(input.language, input.workspaceID);
        const f = files.get(input.workspaceID) ?? new Set();
        f.add(input.options.textDocument.uri);
        files.set(input.workspaceID, f);
        return client.sendNotification('textDocument/didOpen', input.options);
    });
