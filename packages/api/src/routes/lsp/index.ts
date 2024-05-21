import { router } from '@/trpc';
import { initializeRoute } from './initializeRoute';
import { windowRouter } from './window';
import { textDocumentRouter } from './textDocument';
import { exitRoute } from './exitRoute';

export const lspRouter = router({
    initialize: initializeRoute,
    window: windowRouter,
    textDocument: textDocumentRouter,
    exit: exitRoute,
});
