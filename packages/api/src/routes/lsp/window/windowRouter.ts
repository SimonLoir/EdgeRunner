import { router } from '@/trpc';
import { showMessageRoute } from './showMessage';

export const windowRouter = router({
    showMessage: showMessageRoute,
});
