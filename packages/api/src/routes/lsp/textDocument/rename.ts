import { publicProcedure } from '@/trpc';
import { getClient, lspRouterInputSchema } from '../clients';
import {
    renameParamsSchema,
    workspaceEditSchema,
} from '@/schemas/exportedSchemas';
import z from 'zod';

export const renameInputSchema = lspRouterInputSchema.extend({
    options: renameParamsSchema,
});

const renameLSPOutputSchema = workspaceEditSchema.nullable();

export const renameRoute = publicProcedure
    .input(renameInputSchema)
    .output(z.boolean())
    .query(async ({ input }) => {
        const client = getClient(input.language, input.workspaceID);
        const result = await client.sendRequest(
            'textDocument/rename',
            input.options
        );

        if (result === null) {
            return false;
        }

        const resultAsWorkspaceEdit = result as z.infer<
            typeof workspaceEditSchema
        >;

        if (resultAsWorkspaceEdit.changes === undefined) {
            return false;
        }

        return true;
    });
