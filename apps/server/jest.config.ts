import type { Config } from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
    verbose: true,
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleNameMapper: {
        '^@/trpc$': '<rootDir>/../../../packages/api/src/trpc.ts',
        '^@/utils$': '<rootDir>/../../../packages/api/src/utils.ts',
        '^@/schemas$': '<rootDir>/../../../packages/api/src/schemas',
        '^@/languages$': '<rootDir>/../../../packages/api/src/languages',
    },
};
export default config;
