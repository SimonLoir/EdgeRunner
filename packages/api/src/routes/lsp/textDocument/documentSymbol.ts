import { publicProcedure } from '@/trpc';
import {
    documentSymbolParamsSchema,
    documentSymbolSchema,
    symbolInformationSchema,
} from '@/schemas/zodSchemas';
import { getClient, lspRouterInputSchema } from '../clients';
export const documentSymbolInputSchema = lspRouterInputSchema.extend({
    options: documentSymbolParamsSchema,
});

export const documentSymbolRoute = publicProcedure
    .input(documentSymbolInputSchema)
    .output(
        documentSymbolSchema
            .array()
            .nullable()
            .or(symbolInformationSchema.array().nullable())
    )
    .query(async ({ input }) => {
        const client = getClient(input.language, input.workspaceID);
        return await client.sendRequest(
            'textDocument/documentSymbol',
            input.options
        );
    });
