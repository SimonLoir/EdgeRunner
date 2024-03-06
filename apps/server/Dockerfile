# Base
FROM node:20-alpine3.17 AS base

RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app

RUN npm install -g turbo

# Dependencies
FROM base AS deps

COPY . .

RUN npx turbo prune --scope=server --docker


FROM base AS development

COPY --from=deps /usr/src/app/out/json/ .
COPY --from=deps /usr/src/app/out/package-lock.json ./package-lock.json

RUN npm install


FROM development AS devserver
COPY ./apps/server/src ./apps/server/src
COPY ./apps/server/nodemon.json ./apps/server/nodemon.json
COPY ./apps/server/tsconfig.json ./apps/server/tsconfig.json
COPY ./turbo.json ./turbo.json
COPY ./packages/typescript-config ./packages/typescript-config
COPY ./packages/api/tsconfig.json ./packages/api/tsconfig.json
COPY ./packages/types ./packages/types


# Installer
FROM development AS installer

COPY --from=development /usr/src/app/out/full/ .
COPY turbo.json turbo.json


RUN npx turbo run build --filter=server


