import { publicProcedure } from '@/trpc';
import { getClient, lspRouterInputSchema } from '../clients';
import {
    renameParamsSchema,
    workspaceEditSchema,
} from '@/schemas/exportedSchemas';
import z from 'zod';
import fs from 'node:fs';
import { applyTextEdits } from '../../../utils/applyTextEdits';

export const renameInputSchema = lspRouterInputSchema.extend({
    options: renameParamsSchema,
});

type WorkspaceEdit = z.infer<typeof workspaceEditSchema>;

export const renameRoute = publicProcedure
    .input(renameInputSchema)
    .output(z.array(z.object({ file: z.string(), content: z.string() })))
    .query(async ({ input }) => {
        const client = getClient(input.language, input.workspaceID);
        const result: WorkspaceEdit | null = await client.sendRequest(
            'textDocument/rename',
            input.options
        );

        if (result === null) {
            return [];
        }

        if (result.changes === undefined) {
            return [];
        }

        const changedFiles: { file: string; content: string }[] = [];

        Object.entries(result.changes).forEach(([uri, edits]) => {
            const file = uri.replace('file://', '');
            console.log('file', file);

            const content = fs.readFileSync(file, 'utf-8');
            console.log('content', content);

            const newContent = applyTextEdits(content, edits);
            fs.writeFileSync(file, newContent, 'utf-8');
            changedFiles.push({ file, content: newContent });
        });

        return changedFiles;
    });
