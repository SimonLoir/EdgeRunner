import { router } from '../../trpc';
import { hoverRoute } from './hover';

export const lspRouter = router({
    hover: hoverRoute,
});
