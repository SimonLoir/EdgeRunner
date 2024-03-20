import { observable, publicProcedure } from '@/trpc';
import { lspRouterInputSchema } from '../clients';
import EventEmitter from 'node:events';
import { typescriptEvents } from '@/languages/typescript';

export const showMessageRoute = publicProcedure
    .input(lspRouterInputSchema)
    .subscription(({ input }) => {
        return observable((emit) => {
            const ee: EventEmitter = typescriptEvents;
            const listener = (notification: any) => {
                if (
                    notification.method === 'window/showMessage' ||
                    notification.method === 'window/logMessage'
                ) {
                    emit.next(notification);
                }
            };

            ee.on('notification', listener);

            return () => {
                ee.off('notification', listener);
            };
        });
    });
