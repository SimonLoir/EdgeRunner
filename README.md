# EdgeRunners

A mobile code editor that runs on touch based devices. It is built using React Native.

## Getting Started

Start by cloning this repository on your local machine.
In the project directory, run:
```bash
npm install
```

To install the dependencies using expo cli, run:
```bash
cd apps/app
npx expo install
```

## Running the app in development mode

### Android
```bash
npm run android
```

### iOS
```bash
npm run ios
```

## Project Structure

- [apps](./apps):
  - [app](./apps/app): The main React Native app.
  - [server](./apps/server): The server that runs the code.
- [packages](./packages): Shared code between the app and the server.
  - [api](./packages/api): tRPC API routes and types
  - [types](./packages/types): Common types used in the app and server.
  - [eslint-config](./packages/eslint-config): Shared ESLint configuration.
  - [typescript-config](./packages/typescript-config): Shared TypeScript configuration.
- [playground](./playground): A playground to test LSP features (contains an example for `textDocument/semanticTokens`).
- [projects](./projects): Contains projects that are used to test the app.
