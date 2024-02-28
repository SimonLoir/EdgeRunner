import { publicProcedure } from '../../trpc';
import { getClient, lspRouterInputSchema } from './clients';
import { didOpenTextDocumentParamsSchema } from '../../schemas/modelsZod';

export const openInputSchema = lspRouterInputSchema.extend({
    options: didOpenTextDocumentParamsSchema,
});

export const didOpenRoute = publicProcedure
    .input(openInputSchema)
    .query(async ({ input }) => {
        const client = getClient(input.language);
        return client.notify('textDocument/didOpen', input.options, {});
    });
