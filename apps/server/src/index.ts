import dotenv from 'dotenv';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { appRouter, createContext } from '@repo/api';

dotenv.config();
const PORT = process.env.PORT || 3000;

const server = createHTTPServer({
    router: appRouter,
    createContext,
});

server.listen(PORT, () => {
    console.log('Server started at http://localhost:' + PORT);
});
