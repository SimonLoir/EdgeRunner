import { publicProcedure } from '@/trpc';
import { getClient, lspRouterInputSchema } from '../clients';
import { didCloseTextDocumentParamsSchema } from '@/schemas/zodSchemas';

export const closeInputSchema = lspRouterInputSchema.extend({
    options: didCloseTextDocumentParamsSchema,
});

export const didCloseRoute = publicProcedure
    .input(closeInputSchema)
    .query(({ input }) => {
        const client = getClient(input.language, input.workspaceID);
        return client.notify('textDocument/didClose', input.options, {});
    });
