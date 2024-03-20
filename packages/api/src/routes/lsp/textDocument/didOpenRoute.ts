import { publicProcedure } from '@/trpc';
import { getClient, lspRouterInputSchema } from '../clients';
import { didOpenTextDocumentParamsSchema } from '@/schemas/zodSchemas';

export const openInputSchema = lspRouterInputSchema.extend({
    options: didOpenTextDocumentParamsSchema,
});

export const didOpenRoute = publicProcedure
    .input(openInputSchema)
    .query(({ input }) => {
        const client = getClient(input.language, input.workspaceID);
        return client.notify('textDocument/didOpen', input.options, {});
    });
