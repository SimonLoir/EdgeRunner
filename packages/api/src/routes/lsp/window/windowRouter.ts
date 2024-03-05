import { router } from '@/trpc';
import { showMessageRoute } from './showMessageRoute';

export const windowRouter = router({
    showMessage: showMessageRoute,
});
