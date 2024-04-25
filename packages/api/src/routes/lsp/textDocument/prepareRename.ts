import { publicProcedure } from '@/trpc';
import { getClient, lspRouterInputSchema } from '../clients';
import {
    prepareRenameParamsSchema,
    rangeSchema,
} from '@/schemas/exportedSchemas';
import z from 'zod';

export const prepareRenameInputSchema = lspRouterInputSchema.extend({
    options: prepareRenameParamsSchema,
});

const prepareRenameLSPOutputSchema = z
    .union([
        rangeSchema,
        z.object({
            range: rangeSchema,
            placeholder: z.string(),
        }),
        z.object({
            defaultBehavior: z.boolean(),
        }),
    ])
    .nullable();

export const prepareRenameOutputSchema = z.union([z.boolean(), rangeSchema]);

export type PrepareRenameOutputSchema = z.infer<
    typeof prepareRenameOutputSchema
>;
export const prepareRenameRoute = publicProcedure
    .input(prepareRenameInputSchema)
    .output(prepareRenameOutputSchema)
    .query(async ({ input }) => {
        const client = getClient(input.language, input.workspaceID);
        try {
            const result: z.infer<typeof prepareRenameLSPOutputSchema> =
                await client.sendRequest(
                    'textDocument/prepareRename',
                    input.options
                );

            // Check if the result is null
            if (result === null) {
                return false;
            }
            // Check if the result is a default behavior
            const resutBehaviour = result as { defaultBehavior: boolean };

            if (resutBehaviour.defaultBehavior !== undefined) {
                return resutBehaviour.defaultBehavior;
            }

            // Check if the result is a range
            let rangeResult = result as z.infer<typeof rangeSchema>;

            // Check if the result is a range with a placeholder
            if (rangeResult === undefined) {
                rangeResult = (
                    result as {
                        range: z.infer<typeof rangeSchema>;
                    }
                ).range;
            }

            // Check if the range is the same as the position
            if (rangeResult !== undefined) {
                return rangeResult;
            }

            // If the result is not a range, return false
            return false;
        } catch (e) {
            return false;
        }
    });
