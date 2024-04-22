import { publicProcedure } from '@/trpc';
import { getClient, lspRouterInputSchema } from '../clients';
import {
    renameParamsSchema,
    workspaceEditSchema,
} from '@/schemas/exportedSchemas';
import z from 'zod';
import fs from 'node:fs';
import { applyTextEdits } from '@/utils';
import { didChange } from './didChangeRoute';
import { files } from './didOpenRoute';

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
        const workspaceFiles = files.get(input.workspaceID) ?? new Set();

        for (const [uri, edits] of Object.entries(result.changes)) {
            const file = uri.replace('file://', '');
            const content = fs.readFileSync(file, 'utf-8');
            const newContent = applyTextEdits(content, edits);
            if (workspaceFiles.has(uri)) {
                await didChange({
                    language: input.language,
                    workspaceID: input.workspaceID,
                    options: {
                        textDocument: { uri, version: new Date().getTime() },
                        contentChanges: edits.map(({ range, newText }) => ({
                            range,
                            text: newText,
                        })),
                    },
                });
            }

            fs.writeFileSync(file, newContent, 'utf-8');
            changedFiles.push({ file, content: newContent });
        }

        return changedFiles;
    });
