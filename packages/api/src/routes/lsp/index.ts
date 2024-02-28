import { router } from '../../trpc';
import { hoverRoute } from './hover';
import {initializeRoute} from "./initialize";

export const lspRouter = router({
    hover: hoverRoute,
    initialize: initializeRoute,
});
