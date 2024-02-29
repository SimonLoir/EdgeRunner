import { initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
export { observable } from '@trpc/server/observable';

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
export const createContext = ({
    req,
    res,
}: trpcExpress.CreateExpressContextOptions) => ({ req, res });

type Context = Awaited<ReturnType<typeof createContext>>;
const t = initTRPC.context<Context>().create();

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;
