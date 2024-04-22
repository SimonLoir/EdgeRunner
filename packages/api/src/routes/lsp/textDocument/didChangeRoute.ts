import { publicProcedure } from '@/trpc';
import { getClient, lspRouterInputSchema } from '../clients';
import { didChangeTextDocumentParamsSchema } from '@/schemas/zodSchemas';
import { z } from 'zod';

export const changeInputSchema = lspRouterInputSchema.extend({
    options: didChangeTextDocumentParamsSchema,
});

export function didChange(input: z.infer<typeof changeInputSchema>) {
    const client = getClient(input.language, input.workspaceID);
    return client.sendNotification('textDocument/didChange', input.options);
}

export const didChangeRoute = publicProcedure
    .input(changeInputSchema)
    .query(({ input }) => {
        return didChange(input);
    });
