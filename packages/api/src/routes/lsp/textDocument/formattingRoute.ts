import { publicProcedure } from '@/trpc';
import { documentFormattingParamsSchema } from '@/schemas/zodSchemas';
import { getClient, lspRouterInputSchema } from '../clients';
import { TextEdit } from '@/schemas/models';
import fs from 'node:fs';
import { applyTextEdits } from '@/utils';
import { z } from 'zod';
import { didChange } from './didChangeRoute';

export const documentFormattingInputSchema = lspRouterInputSchema.extend({
    options: documentFormattingParamsSchema,
});

export const documentFormattingRoute = publicProcedure
    .input(documentFormattingInputSchema)
    .output(z.string())
    .query(async ({ input }) => {
        const uri = input.options.textDocument.uri;
        const client = getClient(input.language, input.workspaceID);
        const response = (await client.sendRequest(
            'textDocument/formatting',
            input.options
        )) as TextEdit[] | null;

        const file = uri.replace('file://', '');
        const content = fs.readFileSync(file, 'utf-8');
        const newContent = applyTextEdits(content, response ?? []);

        await didChange({
            language: input.language,
            workspaceID: input.workspaceID,
            options: {
                textDocument: { uri, version: new Date().getTime() },
                contentChanges: (response ?? []).map(({ range, newText }) => ({
                    range,
                    text: newText,
                })),
            },
        });

        fs.writeFileSync(file, newContent, 'utf-8');

        return newContent;
    });
