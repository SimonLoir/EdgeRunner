import { router } from '@/trpc';
import { didOpenRoute } from './didOpenRoute';
import { hoverRoute } from './hoverRoute';
import { semanticTokensRoute } from './semanticTokensRoute';
import { definitionRoute } from './definitionRoute';
import { declarationRoute } from './declarationRoute';
import { typeDefinitionRoute } from './typeDefinitionRoute';
import { implementationRoute } from './implementation';
import { selectionRangeRoute } from './selectionRange';
import { codeActionRoute } from './codeAction';
import { completionRoute } from './completion';
import { didCloseRoute } from './didCloseRoute';
import { documentSymbolRoute } from './documentSymbol';
import { didChangeRoute } from './didChangeRoute';

export const textDocumentRouter = router({
    didOpen: didOpenRoute,
    hover: hoverRoute,
    semanticTokens: semanticTokensRoute,
    definition: definitionRoute,
    declaration: declarationRoute,
    typeDefinition: typeDefinitionRoute,
    implementation: implementationRoute,
    selectionRange: selectionRangeRoute,
    codeAction: codeActionRoute,
    completion: completionRoute,
    didClose: didCloseRoute,
    documentSymbol: documentSymbolRoute,
    didChange: didChangeRoute,
});
