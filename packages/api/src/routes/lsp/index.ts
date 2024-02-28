import { router } from '../../trpc';
import { hoverRoute } from './hover';
import { initializeRoute } from './initialize';
import { semanticTokensRoute } from './semanticTokens';
import {didOpenRoute} from "./didOpenRoute";

export const lspRouter = router({
    hover: hoverRoute,
    initialize: initializeRoute,
    semanticTokens: semanticTokensRoute,
    didOpen: didOpenRoute
});
