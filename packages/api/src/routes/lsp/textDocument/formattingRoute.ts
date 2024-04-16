import { publicProcedure } from '@/trpc';
import {
    documentFormattingParamsSchema,
    textEditSchema,
} from '@/schemas/zodSchemas';
import { getClient, lspRouterInputSchema } from '../clients';

export const documentFormattingInputSchema = lspRouterInputSchema.extend({
    options: documentFormattingParamsSchema,
});

export const documentFormattingRoute = publicProcedure
    .input(documentFormattingInputSchema)
    .output(textEditSchema.array().nullable())
    .query(async ({ input }) => {
        const client = getClient(input.language, input.workspaceID);
        return await client.sendRequest(
            'textDocument/formatting',
            input.options
        );
    });
