import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { Platform } from 'react-native';
import { AppRouter } from '@repo/api';

const url =
    (Platform.OS === 'android'
        ? process.env.EXPO_PUBLIC_ANDROID_URL
        : process.env.EXPO_PUBLIC_IOS_URL) ?? 'http://localhost:3000/trpc';

export const trpc = createTRPCClient<AppRouter>({
    links: [
        httpBatchLink({
            url,
        }),
    ],
});
