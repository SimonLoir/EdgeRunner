import { publicProcedure, router } from './trpc';
import { z } from 'zod';
import { projectsRouter } from './routes/projects';
import { lspRouter } from './routes/lsp';
export const appRouter = router({
    projects: projectsRouter,
    lsp: lspRouter,
    test: publicProcedure
        .input(
            z.object({
                name: z.string(),
            })
        )

        .query(() => {
            return 'Hello, world!';
        }),
});

export type AppRouter = typeof appRouter;
export { createContext } from './trpc';
