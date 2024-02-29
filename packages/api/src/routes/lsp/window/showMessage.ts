import { observable, publicProcedure } from '../../../trpc';
import { lspRouterInputSchema } from '../clients';
import EventEmitter from 'node:events';
import { typescriptEvents } from '../../../languages/typescript';

export const showMessageRoute = publicProcedure
    .input(lspRouterInputSchema)
    .subscription(({ input }) => {
        console.log('input', input);
        return observable((emit) => {
            const ee: EventEmitter = typescriptEvents;
            const listener = (notification: any) => {
                console.log('ee', ee, notification);
                emit.next(notification);
            };

            ee.on('notification', listener);

            return () => {
                ee.off('notification', listener);
            };
        });
    });
