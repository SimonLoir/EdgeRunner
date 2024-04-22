import { publicProcedure } from '@/trpc';
import { getClient, lspRouterInputSchema } from '../clients';
import { didCloseTextDocumentParamsSchema } from '@/schemas/zodSchemas';
import { files } from './didOpenRoute';

export const closeInputSchema = lspRouterInputSchema.extend({
    options: didCloseTextDocumentParamsSchema,
});

export const didCloseRoute = publicProcedure
    .input(closeInputSchema)
    .query(({ input }) => {
        const client = getClient(input.language, input.workspaceID);
        const f = files.get(input.workspaceID) ?? new Set();
        f.delete(input.options.textDocument.uri);
        files.set(input.workspaceID, f);
        return client.sendNotification('textDocument/didClose', input.options);
    });
