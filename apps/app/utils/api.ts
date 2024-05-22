import {
    createTRPCClient,
    createWSClient,
    httpBatchLink,
    splitLink,
    wsLink,
} from '@trpc/client';
import { Platform } from 'react-native';
import { AppRouter } from '@repo/api';
import { createTRPCReact } from '@trpc/react-query';

export const url =
    (Platform.OS === 'android'
        ? process.env.EXPO_PUBLIC_ANDROID_URL
        : process.env.EXPO_PUBLIC_IOS_URL) ?? 'http://localhost:3000/trpc';

const client = createWSClient({
    url,
});

// Create a link that uses websockets for subscriptions and http for queries/mutations
export const links = [
    splitLink({
        condition: (op) => op.type === 'subscription',
        true: wsLink({ client }),
        false: httpBatchLink({ url }),
    }),
];

export const trpcClient = createTRPCClient<AppRouter>({
    links,
});
export const trpc = createTRPCReact<AppRouter>();

export type TRPCClient = typeof trpcClient;
