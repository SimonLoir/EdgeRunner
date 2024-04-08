import { publicProcedure } from '@/trpc';
import { getClient, lspRouterInputSchema } from '../clients';
import { didChangeTextDocumentParamsSchema } from '@/schemas/zodSchemas';

export const changeInputSchema = lspRouterInputSchema.extend({
    options: didChangeTextDocumentParamsSchema,
});

export const didChangeRoute = publicProcedure
    .input(changeInputSchema)
    .query(({ input }) => {
        const client = getClient(input.language, input.workspaceID);
        return client.sendNotification('textDocument/didChange', input.options);
    });
