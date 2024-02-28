// Generated by ts-to-zod
import { z } from 'zod';
import {
    SymbolKind,
    CompletionItemKind,
    CodeActionKind,
    TextDocumentSyncKind,
    SignatureHelpTriggerKind,
    DocumentSymbol,
} from './models';

export const integerSchema = z.number();

export const uintegerSchema = z.number();

export const decimalSchema = z.number();

const progressTokenSchema = z.union([integerSchema, z.string()]);

const documentUriSchema = z.string();

export const traceValueSchema = z.union([
    z.literal('off'),
    z.literal('messages'),
    z.literal('verbose'),
]);

export const changeAnnotationIdentifierSchema = z.string();

export const responseErrorSchema = z.object({
    code: integerSchema,
    message: z.string(),
    data: z
        .union([
            z.string(),
            z.number(),
            z.boolean(),
            z.tuple([]),
            z.record(z.unknown()),
        ])
        .optional()
        .nullable(),
});

export const workDoneProgressParamsSchema = z.object({
    workDoneToken: progressTokenSchema.optional(),
});

export const didChangeConfigurationClientCapabilitiesSchema = z.object({
    dynamicRegistration: z.boolean().optional(),
});

export const didChangeWatchedFilesClientCapabilitiesSchema = z.object({
    dynamicRegistration: z.boolean().optional(),
});

export const executeCommandClientCapabilitiesSchema = z.object({
    dynamicRegistration: z.boolean().optional(),
});

export const semanticTokensWorkspaceClientCapabilitiesSchema = z.object({
    refreshSupport: z.boolean().optional(),
});

export const codeLensWorkspaceClientCapabilitiesSchema = z.object({
    refreshSupport: z.boolean().optional(),
});

export const showMessageRequestClientCapabilitiesSchema = z.object({
    messageActionItem: z
        .object({
            additionalPropertiesSupport: z.boolean().optional(),
        })
        .optional(),
});

export const showDocumentClientCapabilitiesSchema = z.object({
    support: z.boolean(),
});

export const regularExpressionsClientCapabilitiesSchema = z.object({
    engine: z.string(),
    version: z.string().optional(),
});

export const markdownClientCapabilitiesSchema = z.object({
    parser: z.string(),
    version: z.string().optional(),
});

export const workspaceFolderSchema = z.object({
    uri: documentUriSchema,
    name: z.string(),
});

const positionSchema = z.object({
    line: uintegerSchema,
    character: uintegerSchema,
});

const textDocumentIdentifierSchema = z.object({
    uri: documentUriSchema,
});

export const createFileOptionsSchema = z.object({
    overwrite: z.boolean().optional(),
    ignoreIfExists: z.boolean().optional(),
});

export const renameFileOptionsSchema = z.object({
    overwrite: z.boolean().optional(),
    ignoreIfExists: z.boolean().optional(),
});

export const deleteFileOptionsSchema = z.object({
    recursive: z.boolean().optional(),
    ignoreIfNotExists: z.boolean().optional(),
});

export const changeAnnotationSchema = z.object({
    label: z.string(),
    needsConfirmation: z.boolean().optional(),
    description: z.string().optional(),
});

export const resourceOperationKindSchema = z.union([
    z.literal('create'),
    z.literal('rename'),
    z.literal('delete'),
]);

export const failureHandlingKindSchema = z.union([
    z.literal('abort'),
    z.literal('transactional'),
    z.literal('undo'),
    z.literal('textOnlyTransactional'),
]);

export const symbolKindSchema = z.nativeEnum(SymbolKind);

export const symbolTagSchema = z.literal(1);

export const textDocumentSyncClientCapabilitiesSchema = z.object({
    dynamicRegistration: z.boolean().optional(),
    willSave: z.boolean().optional(),
    willSaveWaitUntil: z.boolean().optional(),
    didSave: z.boolean().optional(),
});

export const declarationClientCapabilitiesSchema = z.object({
    dynamicRegistration: z.boolean().optional(),
    linkSupport: z.boolean().optional(),
});

export const definitionClientCapabilitiesSchema = z.object({
    dynamicRegistration: z.boolean().optional(),
    linkSupport: z.boolean().optional(),
});

export const typeDefinitionClientCapabilitiesSchema = z.object({
    dynamicRegistration: z.boolean().optional(),
    linkSupport: z.boolean().optional(),
});

export const implementationClientCapabilitiesSchema = z.object({
    dynamicRegistration: z.boolean().optional(),
    linkSupport: z.boolean().optional(),
});

export const referenceClientCapabilitiesSchema = z.object({
    dynamicRegistration: z.boolean().optional(),
});

export const documentHighlightClientCapabilitiesSchema = z.object({
    dynamicRegistration: z.boolean().optional(),
});

export const documentSymbolClientCapabilitiesSchema = z.object({
    dynamicRegistration: z.boolean().optional(),
    symbolKind: z
        .object({
            valueSet: z.array(symbolKindSchema).optional(),
        })
        .optional(),
    hierarchicalDocumentSymbolSupport: z.boolean().optional(),
    tagSupport: z
        .object({
            valueSet: z.array(symbolTagSchema),
        })
        .optional(),
    labelSupport: z.boolean().optional(),
});

export const codeLensClientCapabilitiesSchema = z.object({
    dynamicRegistration: z.boolean().optional(),
});

export const documentLinkClientCapabilitiesSchema = z.object({
    dynamicRegistration: z.boolean().optional(),
    tooltipSupport: z.boolean().optional(),
});

export const documentColorClientCapabilitiesSchema = z.object({
    dynamicRegistration: z.boolean().optional(),
});

export const documentFormattingClientCapabilitiesSchema = z.object({
    dynamicRegistration: z.boolean().optional(),
});

export const documentRangeFormattingClientCapabilitiesSchema = z.object({
    dynamicRegistration: z.boolean().optional(),
});

export const documentOnTypeFormattingClientCapabilitiesSchema = z.object({
    dynamicRegistration: z.boolean().optional(),
});

export const foldingRangeClientCapabilitiesSchema = z.object({
    dynamicRegistration: z.boolean().optional(),
    rangeLimit: uintegerSchema.optional(),
    lineFoldingOnly: z.boolean().optional(),
});

export const selectionRangeClientCapabilitiesSchema = z.object({
    dynamicRegistration: z.boolean().optional(),
});

export const linkedEditingRangeClientCapabilitiesSchema = z.object({
    dynamicRegistration: z.boolean().optional(),
});

const callHierarchyClientCapabilitiesSchema = z.object({
    dynamicRegistration: z.boolean().optional(),
});

const monikerClientCapabilitiesSchema = z.object({
    dynamicRegistration: z.boolean().optional(),
});

export const markupKindSchema = z.union([
    z.literal('plaintext'),
    z.literal('markdown'),
]);

export const completionItemTagSchema = z.literal(1);

export const insertTextModeSchema = z.union([z.literal(1), z.literal(2)]);

export const completionItemKindSchema = z.nativeEnum(CompletionItemKind);

export const codeActionKindSchema = z.nativeEnum(CodeActionKind);

export const prepareSupportDefaultBehaviorSchema = z.literal(1);

export const diagnosticTagSchema = z.union([z.literal(1), z.literal(2)]);

export const tokenFormatSchema = z.literal('relative');

export const textDocumentSyncKindSchema = z.nativeEnum(TextDocumentSyncKind);

export const documentOnTypeFormattingOptionsSchema = z.object({
    firstTriggerCharacter: z.string(),
    moreTriggerCharacter: z.array(z.string()).optional(),
});

export const workspaceFoldersServerCapabilitiesSchema = z.object({
    supported: z.boolean().optional(),
    changeNotifications: z.union([z.string(), z.boolean()]).optional(),
});

export const workDoneProgressOptionsSchema = z.object({
    workDoneProgress: z.boolean().optional(),
});

export const staticRegistrationOptionsSchema = z.object({
    id: z.string().optional(),
});

export const documentFilterSchema = z.object({
    language: z.string().optional(),
    scheme: z.string().optional(),
    pattern: z.string().optional(),
});

export const semanticTokensLegendSchema = z.object({
    tokenTypes: z.array(z.string()),
    tokenModifiers: z.array(z.string()),
});

export const fileOperationPatternKindSchema = z.union([
    z.literal('file'),
    z.literal('folder'),
]);

export const fileOperationPatternOptionsSchema = z.object({
    ignoreCase: z.boolean().optional(),
});

export const shutdownResultSchema = z.object({
    result: z.null(),
    error: responseErrorSchema.optional(),
});

export const textDocumentItemSchema = z.object({
    uri: documentUriSchema,
    languageId: z.string(),
    version: integerSchema,
    text: z.string(),
});

export const partialResultParamsSchema = z.object({
    partialResultToken: progressTokenSchema.optional(),
});

const textDocumentPositionParamsSchema = z.object({
    textDocument: textDocumentIdentifierSchema,
    position: positionSchema,
});

export const referenceContextSchema = z.object({
    includeDeclaration: z.boolean(),
});

export const didCloseTextDocumentParamsSchema = z.object({
    textDocument: textDocumentIdentifierSchema,
});

export const definitionParamsSchema = textDocumentPositionParamsSchema
    .extend(workDoneProgressParamsSchema.shape)
    .extend(partialResultParamsSchema.shape);

export const typeDefinitionParamsSchema = textDocumentPositionParamsSchema
    .extend(workDoneProgressParamsSchema.shape)
    .extend(partialResultParamsSchema.shape);

export const signatureHelpTriggerKindSchema = z.nativeEnum(
    SignatureHelpTriggerKind
);

export const markupContentSchema = z.object({
    kind: markupKindSchema,
    value: z.string(),
});

export const parameterInformationSchema = z.object({
    label: z.union([z.string(), z.tuple([uintegerSchema, uintegerSchema])]),
    documentation: z.union([z.string(), markupContentSchema]).optional(),
});

export const hoverParamsSchema = textDocumentPositionParamsSchema.extend(
    workDoneProgressParamsSchema.shape
);

const markedStringSchema = z.union([
    z.string(),
    z.object({
        language: z.string(),
        value: z.string(),
    }),
]);

export const declarationParamsSchema = textDocumentPositionParamsSchema
    .extend(workDoneProgressParamsSchema.shape)
    .extend(partialResultParamsSchema.shape);

export const workspaceEditClientCapabilitiesSchema = z.object({
    documentChanges: z.boolean().optional(),
    resourceOperations: z.array(resourceOperationKindSchema).optional(),
    failureHandling: failureHandlingKindSchema.optional(),
    normalizesLineEndings: z.boolean().optional(),
    changeAnnotationSupport: z
        .object({
            groupsOnLabel: z.boolean().optional(),
        })
        .optional(),
});

const workspaceSymbolClientCapabilitiesSchema = z.object({
    dynamicRegistration: z.boolean().optional(),
    symbolKind: z
        .object({
            valueSet: z.array(symbolKindSchema).optional(),
        })
        .optional(),
    tagSupport: z
        .object({
            valueSet: z.array(symbolTagSchema),
        })
        .optional(),
});

const rangeSchema = z.object({
    start: positionSchema,
    end: positionSchema,
});

const optionalVersionedTextDocumentIdentifierSchema =
    textDocumentIdentifierSchema.extend({
        version: integerSchema.nullable(),
    });

export const createFileSchema = z.object({
    kind: z.literal('create'),
    uri: documentUriSchema,
    options: createFileOptionsSchema.optional(),
    annotationId: changeAnnotationIdentifierSchema.optional(),
});

export const renameFileSchema = z.object({
    kind: z.literal('rename'),
    oldUri: documentUriSchema,
    newUri: documentUriSchema,
    options: renameFileOptionsSchema.optional(),
    annotationId: changeAnnotationIdentifierSchema.optional(),
});

export const deleteFileSchema = z.object({
    kind: z.literal('delete'),
    uri: documentUriSchema,
    options: deleteFileOptionsSchema.optional(),
    annotationId: changeAnnotationIdentifierSchema.optional(),
});

export const completionClientCapabilitiesSchema = z.object({
    dynamicRegistration: z.boolean().optional(),
    completionItem: z
        .object({
            snippetSupport: z.boolean().optional(),
            commitCharactersSupport: z.boolean().optional(),
            documentationFormat: z.array(markupKindSchema).optional(),
            deprecatedSupport: z.boolean().optional(),
            preselectSupport: z.boolean().optional(),
            tagSupport: z
                .object({
                    valueSet: z.array(completionItemTagSchema),
                })
                .optional(),
            insertReplaceSupport: z.boolean().optional(),
            resolveSupport: z
                .object({
                    properties: z.array(z.string()),
                })
                .optional(),
            insertTextModeSupport: z
                .object({
                    valueSet: z.array(insertTextModeSchema),
                })
                .optional(),
            labelDetailsSupport: z.boolean().optional(),
        })
        .optional(),
    completionItemKind: z
        .object({
            valueSet: z.array(completionItemKindSchema).optional(),
        })
        .optional(),
    contextSupport: z.boolean().optional(),
    insertTextMode: insertTextModeSchema.optional(),
});

export const hoverClientCapabilitiesSchema = z.object({
    dynamicRegistration: z.boolean().optional(),
    contentFormat: z.array(markupKindSchema).optional(),
});

export const signatureHelpClientCapabilitiesSchema = z.object({
    dynamicRegistration: z.boolean().optional(),
    signatureInformation: z
        .object({
            documentationFormat: z.array(markupKindSchema).optional(),
            parameterInformation: z
                .object({
                    labelOffsetSupport: z.boolean().optional(),
                })
                .optional(),
            activeParameterSupport: z.boolean().optional(),
        })
        .optional(),
    contextSupport: z.boolean().optional(),
});

export const codeActionClientCapabilitiesSchema = z.object({
    dynamicRegistration: z.boolean().optional(),
    codeActionLiteralSupport: z
        .object({
            codeActionKind: z.object({
                valueSet: z.array(codeActionKindSchema),
            }),
        })
        .optional(),
    isPreferredSupport: z.boolean().optional(),
    disabledSupport: z.boolean().optional(),
    dataSupport: z.boolean().optional(),
    resolveSupport: z
        .object({
            properties: z.array(z.string()),
        })
        .optional(),
    honorsChangeAnnotations: z.boolean().optional(),
});

export const renameClientCapabilitiesSchema = z.object({
    dynamicRegistration: z.boolean().optional(),
    prepareSupport: z.boolean().optional(),
    prepareSupportDefaultBehavior:
        prepareSupportDefaultBehaviorSchema.optional(),
    honorsChangeAnnotations: z.boolean().optional(),
});

export const publishDiagnosticsClientCapabilitiesSchema = z.object({
    relatedInformation: z.boolean().optional(),
    tagSupport: z
        .object({
            valueSet: z.array(diagnosticTagSchema),
        })
        .optional(),
    versionSupport: z.boolean().optional(),
    codeDescriptionSupport: z.boolean().optional(),
    dataSupport: z.boolean().optional(),
});

const semanticTokensClientCapabilitiesSchema = z.object({
    dynamicRegistration: z.boolean().optional(),
    requests: z.object({
        range: z.union([z.boolean(), z.any()]).optional(),
        full: z
            .union([
                z.boolean(),
                z.object({
                    delta: z.boolean().optional(),
                }),
            ])
            .optional(),
    }),
    tokenTypes: z.array(z.string()),
    tokenModifiers: z.array(z.string()),
    formats: z.array(tokenFormatSchema),
    overlappingTokenSupport: z.boolean().optional(),
    multilineTokenSupport: z.boolean().optional(),
});

export const textDocumentSyncOptionsSchema = z.object({
    openClose: z.boolean().optional(),
    change: textDocumentSyncKindSchema.optional(),
});

export const completionOptionsSchema = workDoneProgressOptionsSchema.extend({
    triggerCharacters: z.array(z.string()).optional(),
    allCommitCharacters: z.array(z.string()).optional(),
    resolveProvider: z.boolean().optional(),
    completionItem: z
        .object({
            labelDetailsSupport: z.boolean().optional(),
        })
        .optional(),
});

export const hoverOptionsSchema = workDoneProgressOptionsSchema;

export const signatureHelpOptionsSchema = workDoneProgressOptionsSchema.extend({
    triggerCharacters: z.array(z.string()).optional(),
    retriggerCharacters: z.array(z.string()).optional(),
});

export const declarationOptionsSchema = workDoneProgressOptionsSchema;

export const definitionOptionsSchema = workDoneProgressOptionsSchema;

export const typeDefinitionOptionsSchema = workDoneProgressOptionsSchema;

export const implementationOptionsSchema = workDoneProgressOptionsSchema;

export const referenceOptionsSchema = workDoneProgressOptionsSchema;

export const documentHighlightOptionsSchema = workDoneProgressOptionsSchema;

export const documentSymbolOptionsSchema = workDoneProgressOptionsSchema.extend(
    {
        label: z.string().optional(),
    }
);

export const codeActionOptionsSchema = workDoneProgressOptionsSchema.extend({
    codeActionKinds: z.array(codeActionKindSchema).optional(),
    resolveProvider: z.boolean().optional(),
});

export const codeLensOptionsSchema = workDoneProgressOptionsSchema.extend({
    resolveProvider: z.boolean().optional(),
});

export const documentLinkOptionsSchema = workDoneProgressOptionsSchema.extend({
    resolveProvider: z.boolean().optional(),
});

export const documentColorOptionsSchema = workDoneProgressOptionsSchema;

export const documentFormattingOptionsSchema = workDoneProgressOptionsSchema;

export const documentRangeFormattingOptionsSchema =
    workDoneProgressOptionsSchema;

export const renameOptionsSchema = workDoneProgressOptionsSchema.extend({
    prepareProvider: z.boolean().optional(),
});

export const foldingRangeOptionsSchema = workDoneProgressOptionsSchema;

export const executeCommandOptionsSchema = workDoneProgressOptionsSchema.extend(
    {
        commands: z.array(z.string()),
    }
);

export const selectionRangeOptionsSchema = workDoneProgressOptionsSchema;

export const linkedEditingRangeOptionsSchema = workDoneProgressOptionsSchema;

export const callHierarchyOptionsSchema = workDoneProgressOptionsSchema;

export const semanticTokensOptionsSchema = workDoneProgressOptionsSchema.extend(
    {
        legend: semanticTokensLegendSchema,
        range: z.union([z.boolean(), z.any()]).optional(),
        full: z
            .union([
                z.boolean(),
                z.object({
                    delta: z.boolean().optional(),
                }),
            ])
            .optional(),
    }
);

export const monikerOptionsSchema = workDoneProgressOptionsSchema;

export const workspaceSymbolOptionsSchema = workDoneProgressOptionsSchema;

export const documentSelectorSchema = z.array(documentFilterSchema);

const fileOperationPatternSchema = z.object({
    glob: z.string(),
    matches: fileOperationPatternKindSchema.optional(),
    options: fileOperationPatternOptionsSchema.optional(),
});

export const didOpenTextDocumentParamsSchema = z.object({
    textDocument: textDocumentItemSchema,
});

export const documentSymbolParamsSchema = workDoneProgressParamsSchema
    .extend(partialResultParamsSchema.shape)
    .extend({
        textDocument: textDocumentIdentifierSchema,
    });

export const documentSymbolSchema: z.ZodSchema<DocumentSymbol> = z.lazy(() =>
    z.object({
        name: z.string(),
        detail: z.string().optional(),
        kind: symbolKindSchema,
        tags: z.array(symbolTagSchema).optional(),
        deprecated: z.boolean().optional(),
        range: rangeSchema,
        selectionRange: rangeSchema,
        children: z.array(documentSymbolSchema).optional(),
    })
);

export const locationSchema = z.object({
    uri: documentUriSchema,
    range: rangeSchema,
});

export const referenceParamsSchema = textDocumentPositionParamsSchema
    .extend(workDoneProgressParamsSchema.shape)
    .extend(partialResultParamsSchema.shape)
    .extend({
        context: referenceContextSchema,
    });

export const locationLinkSchema = z.object({
    originSelectionRange: rangeSchema.optional(),
    targetUri: documentUriSchema,
    targetRange: rangeSchema,
    targetSelectionRange: rangeSchema,
});

export const signatureInformationSchema = z.object({
    label: z.string(),
    documentation: z.union([z.string(), markupContentSchema]).optional(),
    parameters: z.array(parameterInformationSchema).optional(),
    activeParameter: uintegerSchema.optional(),
});

export const hoverSchema = z.object({
    contents: z.union([
        markedStringSchema,
        z.array(markedStringSchema),
        markupContentSchema,
    ]),
    range: rangeSchema.optional(),
});

export const textDocumentClientCapabilitiesSchema = z.object({
    synchronization: textDocumentSyncClientCapabilitiesSchema.optional(),
    completion: completionClientCapabilitiesSchema.optional(),
    hover: hoverClientCapabilitiesSchema.optional(),
    signatureHelp: signatureHelpClientCapabilitiesSchema.optional(),
    declaration: declarationClientCapabilitiesSchema.optional(),
    definition: definitionClientCapabilitiesSchema.optional(),
    typeDefinition: typeDefinitionClientCapabilitiesSchema.optional(),
    implementation: implementationClientCapabilitiesSchema.optional(),
    references: referenceClientCapabilitiesSchema.optional(),
    documentHighlight: documentHighlightClientCapabilitiesSchema.optional(),
    documentSymbol: documentSymbolClientCapabilitiesSchema.optional(),
    codeAction: codeActionClientCapabilitiesSchema.optional(),
    codeLens: codeLensClientCapabilitiesSchema.optional(),
    documentLink: documentLinkClientCapabilitiesSchema.optional(),
    colorProvider: documentColorClientCapabilitiesSchema.optional(),
    formatting: documentFormattingClientCapabilitiesSchema.optional(),
    rangeFormatting: documentRangeFormattingClientCapabilitiesSchema.optional(),
    onTypeFormatting:
        documentOnTypeFormattingClientCapabilitiesSchema.optional(),
    rename: renameClientCapabilitiesSchema.optional(),
    publishDiagnostics: publishDiagnosticsClientCapabilitiesSchema.optional(),
    foldingRange: foldingRangeClientCapabilitiesSchema.optional(),
    selectionRange: selectionRangeClientCapabilitiesSchema.optional(),
    linkedEditingRange: linkedEditingRangeClientCapabilitiesSchema.optional(),
    callHierarchy: callHierarchyClientCapabilitiesSchema.optional(),
    semanticTokens: semanticTokensClientCapabilitiesSchema.optional(),
    moniker: monikerClientCapabilitiesSchema.optional(),
});

const textEditSchema = z.object({
    range: rangeSchema,
    newText: z.string(),
});

export const annotatedTextEditSchema = textEditSchema.extend({
    annotationId: changeAnnotationIdentifierSchema,
});

export const textDocumentRegistrationOptionsSchema = z.object({
    documentSelector: documentSelectorSchema.nullable(),
});

export const fileOperationFilterSchema = z.object({
    scheme: z.string().optional(),
    pattern: fileOperationPatternSchema,
});

export const symbolInformationSchema = z.object({
    name: z.string(),
    kind: symbolKindSchema,
    tags: z.array(symbolTagSchema).optional(),
    deprecated: z.boolean().optional(),
    location: locationSchema,
    containerName: z.string().optional(),
});

export const signatureHelpSchema = z.object({
    signatures: z.array(signatureInformationSchema),
    activeSignature: uintegerSchema.optional(),
    activeParameter: uintegerSchema.optional(),
});

export const clientCapabilitiesSchema = z.object({
    workspace: z
        .object({
            applyEdit: z.boolean().optional(),
            workspaceEdit: workspaceEditClientCapabilitiesSchema.optional(),
            didChangeConfiguration:
                didChangeConfigurationClientCapabilitiesSchema.optional(),
            didChangeWatchedFiles:
                didChangeWatchedFilesClientCapabilitiesSchema.optional(),
            symbol: workspaceSymbolClientCapabilitiesSchema.optional(),
            executeCommand: executeCommandClientCapabilitiesSchema.optional(),
            workspaceFolders: z.boolean().optional(),
            configuration: z.boolean().optional(),
            semanticTokens:
                semanticTokensWorkspaceClientCapabilitiesSchema.optional(),
            codeLens: codeLensWorkspaceClientCapabilitiesSchema.optional(),
            fileOperations: z
                .object({
                    dynamicRegistration: z.boolean().optional(),
                    didCreate: z.boolean().optional(),
                    willCreate: z.boolean().optional(),
                    didRename: z.boolean().optional(),
                    willRename: z.boolean().optional(),
                    didDelete: z.boolean().optional(),
                    willDelete: z.boolean().optional(),
                })
                .optional(),
        })
        .optional(),
    textDocument: textDocumentClientCapabilitiesSchema.optional(),
    window: z
        .object({
            workDoneProgress: z.boolean().optional(),
            showMessage: showMessageRequestClientCapabilitiesSchema.optional(),
            showDocument: showDocumentClientCapabilitiesSchema.optional(),
        })
        .optional(),
    general: z
        .object({
            staleRequestSupport: z
                .object({
                    cancel: z.boolean(),
                    retryOnContentModified: z.array(z.string()),
                })
                .optional(),
            regularExpressions:
                regularExpressionsClientCapabilitiesSchema.optional(),
            markdown: markdownClientCapabilitiesSchema.optional(),
        })
        .optional(),
    experimental: z.any().optional(),
});

export const textDocumentEditSchema = z.object({
    textDocument: optionalVersionedTextDocumentIdentifierSchema,
    edits: z.array(z.union([textEditSchema, annotatedTextEditSchema])),
});

export const declarationRegistrationOptionsSchema = declarationOptionsSchema
    .extend(textDocumentRegistrationOptionsSchema.shape)
    .extend(staticRegistrationOptionsSchema.shape);

export const typeDefinitionRegistrationOptionsSchema =
    textDocumentRegistrationOptionsSchema
        .extend(typeDefinitionOptionsSchema.shape)
        .extend(staticRegistrationOptionsSchema.shape);

export const implementationRegistrationOptionsSchema =
    textDocumentRegistrationOptionsSchema
        .extend(implementationOptionsSchema.shape)
        .extend(staticRegistrationOptionsSchema.shape);

export const documentColorRegistrationOptionsSchema =
    textDocumentRegistrationOptionsSchema
        .extend(staticRegistrationOptionsSchema.shape)
        .extend(documentColorOptionsSchema.shape);

export const foldingRangeRegistrationOptionsSchema =
    textDocumentRegistrationOptionsSchema
        .extend(foldingRangeOptionsSchema.shape)
        .extend(staticRegistrationOptionsSchema.shape);

export const selectionRangeRegistrationOptionsSchema =
    selectionRangeOptionsSchema
        .extend(textDocumentRegistrationOptionsSchema.shape)
        .extend(staticRegistrationOptionsSchema.shape);

export const linkedEditingRangeRegistrationOptionsSchema =
    textDocumentRegistrationOptionsSchema
        .extend(linkedEditingRangeOptionsSchema.shape)
        .extend(staticRegistrationOptionsSchema.shape);

export const callHierarchyRegistrationOptionsSchema =
    textDocumentRegistrationOptionsSchema
        .extend(callHierarchyOptionsSchema.shape)
        .extend(staticRegistrationOptionsSchema.shape);

export const semanticTokensRegistrationOptionsSchema =
    textDocumentRegistrationOptionsSchema
        .extend(semanticTokensOptionsSchema.shape)
        .extend(staticRegistrationOptionsSchema.shape);

export const monikerRegistrationOptionsSchema =
    textDocumentRegistrationOptionsSchema.extend(monikerOptionsSchema.shape);

const fileOperationRegistrationOptionsSchema = z.object({
    filters: z.array(fileOperationFilterSchema),
});

export const signatureHelpContextSchema = z.object({
    triggerKind: signatureHelpTriggerKindSchema,
    triggerCharacter: z.string().optional(),
    isRetrigger: z.boolean(),
    activeSignatureHelp: signatureHelpSchema.optional(),
});

export const initializeParamsSchema = workDoneProgressParamsSchema.extend({
    processId: integerSchema.nullable(),
    clientInfo: z
        .object({
            name: z.string(),
            version: z.string().optional(),
        })
        .optional(),
    locale: z.string().optional(),
    rootPath: z.string().optional().nullable(),
    rootUri: documentUriSchema.nullable(),
    initializationOptions: z.any().optional(),
    capabilities: clientCapabilitiesSchema,
    trace: traceValueSchema.optional(),
    workspaceFolders: z.array(workspaceFolderSchema).optional().nullable(),
});

export const workspaceEditSchema = z.object({
    changes: z.record(z.array(textEditSchema)).optional(),
    documentChanges: z
        .union([
            z.array(textDocumentEditSchema),
            z.array(
                z.union([
                    textDocumentEditSchema,
                    createFileSchema,
                    renameFileSchema,
                    deleteFileSchema,
                ])
            ),
        ])
        .optional(),
    changeAnnotations: z.record(changeAnnotationSchema).optional(),
});

const serverCapabilitiesSchema = z.object({
    textDocumentSync: z
        .union([textDocumentSyncOptionsSchema, textDocumentSyncKindSchema])
        .optional(),
    completionProvider: completionOptionsSchema.optional(),
    hoverProvider: z.union([z.boolean(), hoverOptionsSchema]).optional(),
    signatureHelpProvider: signatureHelpOptionsSchema.optional(),
    declarationProvider: z
        .union([
            z.boolean(),
            declarationOptionsSchema,
            declarationRegistrationOptionsSchema,
        ])
        .optional(),
    definitionProvider: z
        .union([z.boolean(), definitionOptionsSchema])
        .optional(),
    typeDefinitionProvider: z
        .union([
            z.boolean(),
            typeDefinitionOptionsSchema,
            typeDefinitionRegistrationOptionsSchema,
        ])
        .optional(),
    implementationProvider: z
        .union([
            z.boolean(),
            implementationOptionsSchema,
            implementationRegistrationOptionsSchema,
        ])
        .optional(),
    referencesProvider: z
        .union([z.boolean(), referenceOptionsSchema])
        .optional(),
    documentHighlightProvider: z
        .union([z.boolean(), documentHighlightOptionsSchema])
        .optional(),
    documentSymbolProvider: z
        .union([z.boolean(), documentSymbolOptionsSchema])
        .optional(),
    codeActionProvider: z
        .union([z.boolean(), codeActionOptionsSchema])
        .optional(),
    codeLensProvider: codeLensOptionsSchema.optional(),
    documentLinkProvider: documentLinkOptionsSchema.optional(),
    colorProvider: z
        .union([
            z.boolean(),
            documentColorOptionsSchema,
            documentColorRegistrationOptionsSchema,
        ])
        .optional(),
    documentFormattingProvider: z
        .union([z.boolean(), documentFormattingOptionsSchema])
        .optional(),
    documentRangeFormattingProvider: z
        .union([z.boolean(), documentRangeFormattingOptionsSchema])
        .optional(),
    documentOnTypeFormattingProvider:
        documentOnTypeFormattingOptionsSchema.optional(),
    renameProvider: z.union([z.boolean(), renameOptionsSchema]).optional(),
    foldingRangeProvider: z
        .union([
            z.boolean(),
            foldingRangeOptionsSchema,
            foldingRangeRegistrationOptionsSchema,
        ])
        .optional(),
    executeCommandProvider: executeCommandOptionsSchema.optional(),
    selectionRangeProvider: z
        .union([
            z.boolean(),
            selectionRangeOptionsSchema,
            selectionRangeRegistrationOptionsSchema,
        ])
        .optional(),
    linkedEditingRangeProvider: z
        .union([
            z.boolean(),
            linkedEditingRangeOptionsSchema,
            linkedEditingRangeRegistrationOptionsSchema,
        ])
        .optional(),
    callHierarchyProvider: z
        .union([
            z.boolean(),
            callHierarchyOptionsSchema,
            callHierarchyRegistrationOptionsSchema,
        ])
        .optional(),
    semanticTokensProvider: z
        .union([
            semanticTokensOptionsSchema,
            semanticTokensRegistrationOptionsSchema,
        ])
        .optional(),
    monikerProvider: z
        .union([
            z.boolean(),
            monikerOptionsSchema,
            monikerRegistrationOptionsSchema,
        ])
        .optional(),
    workspaceSymbolProvider: z
        .union([z.boolean(), workspaceSymbolOptionsSchema])
        .optional(),
    workspace: z
        .object({
            workspaceFolders:
                workspaceFoldersServerCapabilitiesSchema.optional(),
            fileOperations: z
                .object({
                    didCreate:
                        fileOperationRegistrationOptionsSchema.optional(),
                    willCreate:
                        fileOperationRegistrationOptionsSchema.optional(),
                    didRename:
                        fileOperationRegistrationOptionsSchema.optional(),
                    willRename:
                        fileOperationRegistrationOptionsSchema.optional(),
                    didDelete:
                        fileOperationRegistrationOptionsSchema.optional(),
                    willDelete:
                        fileOperationRegistrationOptionsSchema.optional(),
                })
                .optional(),
        })
        .optional(),
    experimental: z.any().optional(),
});

export const signatureHelpParamsSchema = textDocumentPositionParamsSchema
    .extend(workDoneProgressParamsSchema.shape)
    .extend({
        context: signatureHelpContextSchema.optional(),
    });

export const applyWorkspaceEditParamsSchema = z.object({
    label: z.string().optional(),
    edit: workspaceEditSchema,
});

export const initializeResultSchema = z.object({
    capabilities: serverCapabilitiesSchema,
    serverInfo: z
        .object({
            name: z.string(),
            version: z.string().optional(),
        })
        .optional(),
});