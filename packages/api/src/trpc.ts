import { initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';
import { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';
export { observable } from '@trpc/server/observable';

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
export function createContext(
    opts: CreateHTTPContextOptions | CreateWSSContextFnOptions
) {
    return {};
}

type Context = Awaited<ReturnType<typeof createContext>>;
const t = initTRPC.context<Context>().create();

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;
