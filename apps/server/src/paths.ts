import 'module-alias/register';
import { addAliases } from 'module-alias';

addAliases({
    '@/trpc': __dirname + '/../../../packages/api/src/trpc.ts',
    '@/utils': __dirname + '/../../../packages/api/src/utils/index.ts',
    '@/schemas': __dirname + '/../../../packages/api/src/schemas',
    '@/languages': __dirname + '/../../../packages/api/src/languages',
});
