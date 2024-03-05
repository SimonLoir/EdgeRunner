import { router } from '@/trpc';
import { didOpenRoute } from './didOpenRoute';
import { hoverRoute } from './hoverRoute';
import { semanticTokensRoute } from './semanticTokensRoute';

export const textDocumentRouter = router({
    didOpen: didOpenRoute,
    hover: hoverRoute,
    semanticTokens: semanticTokensRoute,
});
