import dotenv from 'dotenv';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { AppRouter, appRouter, createContext } from '@repo/api';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { WebSocketServer } from 'ws';

dotenv.config();
const PORT = process.env.PORT ?? 3000;

const server = createHTTPServer({
    router: appRouter,
    createContext,
});

const wss = new WebSocketServer({ server });
applyWSSHandler<AppRouter>({
    wss,
    router: appRouter,
    createContext,
});

server.listen(PORT, () => {
    console.log('Server started at http://localhost:' + PORT);
});
