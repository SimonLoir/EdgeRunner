import { publicProcedure } from '@/trpc';
import { getClient, lspRouterInputSchema } from '../clients';
import {
    completionItemSchema,
    completionListSchema,
    completionParamsSchema,
} from '@/schemas/exportedSchemas';
import { z } from 'zod';
import { log } from 'console';

export const completionInputSchema = lspRouterInputSchema.extend({
    options: completionParamsSchema,
    lastWord: z.string(),
});

export const completionOutputSchema = z.union([
    completionListSchema,
    completionItemSchema.array(),
    z.null(),
]);

export const completionRoute = publicProcedure
    .input(completionInputSchema)
    .output(z.array(completionItemSchema))
    .query(async ({ input }) => {
        const client = getClient(input.language, input.workspaceID);
        const completionItems: z.infer<typeof completionOutputSchema> =
            await client.sendRequest('textDocument/completion', input.options);

        const items: z.infer<typeof completionItemSchema>[] = [];

        if (completionItems !== null) {
            if (completionItems instanceof Array) {
                items.push(...completionItems);
            } else {
                items.push(...completionItems.items);
            }
        }

        if (input.lastWord === undefined) {
            return items.slice(0, items.length > 10 ? 10 : items.length);
        }

        const filteredItems = items.filter((item) => {
            return item.label.startsWith(input.lastWord);
        });

        return filteredItems.slice(
            0,
            filteredItems.length > 10 ? 10 : filteredItems.length
        );
    });
