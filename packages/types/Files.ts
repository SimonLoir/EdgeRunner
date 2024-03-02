import { z } from 'zod';

export const nameSchema = z.object({
    name: z.string(),
});

export const pathSchema = z.object({
    path: z.string(),
});

export const fileSchema = pathSchema.extend({
    content: z.string(),
});

export const renameFileSchema = pathSchema.and(nameSchema);

export type Directory = z.infer<typeof pathSchema> & {
    children: (z.infer<typeof nameSchema> | Directory)[];
};
export const directorySchema: z.ZodType<Directory> = pathSchema.extend({
    children: z.lazy(() => z.array(z.union([nameSchema, directorySchema]))),
});
