import { publicProcedure, router } from './trpc';
import { z } from 'zod';
import { projectsRouter } from './routes/projects';
export const appRouter = router({
    projects: projectsRouter,
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
