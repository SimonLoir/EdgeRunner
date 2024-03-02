import { publicProcedure, router } from './trpc';
import { projectsRouter } from './routes/projects';
import { lspRouter } from './routes/lsp';
export const appRouter = router({
    projects: projectsRouter,
    lsp: lspRouter,
    kill: publicProcedure.query(() => {
        process.exit(0);
    }),
});

export type AppRouter = typeof appRouter;
export { createContext } from './trpc';
