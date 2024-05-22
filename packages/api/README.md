# tRPC API

## Routes

The routes are defined in the [src/routes](./src/routes) directory.

- [lsp](./src/routes/lsp) contains routes related to the language server protocol.
- [projects](./src/routes/projects) contains routes related to files and projects management.


## Import types from LSP documentation

The language server protocol defines types for the inputs and outputs of the requests and notifications. 
These types can be downloaded from the website and put in the [schemas/models.ts](./src/schemas/models.ts) file.

```bash
npx ts-node ./src/import-types.ts
```

Once the types are imported, the models can be converted to zod schemas. 
You may need to manually update some types to make them compatible with zod.


## Convert LSP models to zod schemas

To convert the models to zod schemas, run the following command:
```bash
npx ts-to-zod ./schemas/models.ts ./schemas/modelsZod.ts
```
