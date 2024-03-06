import { router } from '@/trpc';
import { didOpenRoute } from './didOpenRoute';
import { hoverRoute } from './hoverRoute';
import { semanticTokensRoute } from './semanticTokensRoute';
import { definitionRoute } from './definitionRoute';
import { declarationRoute } from './declarationRoute';
import { typeDefinitionRoute } from './typeDefinitionRoute';
import { implementationRoute } from './implementation';

export const textDocumentRouter = router({
    didOpen: didOpenRoute,
    hover: hoverRoute,
    semanticTokens: semanticTokensRoute,
    definition: definitionRoute,
    declaration: declarationRoute,
    typeDefinition: typeDefinitionRoute,
    implementation: implementationRoute,
});
