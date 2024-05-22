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

## Server

The server is a simple Express server that runs the code. 
It uses [tRPC](https://trpc.io/) to define the API routes.


### Development
To start the server in dev mode, run:

```bash
cd apps/server
npm run dev
```

To start the server in dev mode using docker, run:

```bash
docker compose up
```

### Production
To start the server in production mode using docker, run:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

You can configure the domain name in the `docker-compose.prod.yml` file.
You need to create a reverse proxy to forward the requests to the server. 

In this case, we use Treafik as a reverse proxy : 

```yaml
version: '3'

services:
    reverse-proxy:
        restart: always
        # The official v2 Traefik docker image
        image: traefik:v2.9
        # Enables the web UI and tells Traefik to listen to docker
        command:
            - --api.insecure=true
            - --providers.docker
            - --entrypoints.http.address=:80
            - --entrypoints.https.address=:443
            - --certificatesresolvers.letsencrypt.acme.httpchallenge=true
            - --certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=http
            # Don't forget to change the email address (or set the EMAIL_ADDRESS environment variable)
            - --certificatesresolvers.letsencrypt.acme.email=${EMAIL_ADDRESS}
            - --certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json
        networks:
            - web
        ports:
            # The HTTP port
            - '0.0.0.0:80:80'
            - '0.0.0.0:443:443'
            - '0.0.0.0:8080:8080'
        volumes:
            # So that Traefik can listen to the Docker events
            - /var/run/docker.sock:/var/run/docker.sock
            - letsencrypt:/letsencrypt
        labels:
            # middleware redirect
            - traefik.http.middlewares.redirect-to-https.redirectscheme.scheme=https
            # global redirect to https
            - traefik.http.routers.redirs.rule=hostregexp(`{host:.+}`)
            - traefik.http.routers.redirs.entrypoints=http
            - traefik.http.routers.redirs.middlewares=redirect-to-https
networks:
    web:
        external: true
volumes:
    letsencrypt:
```


You also need to create a network called `web` : 

```bash
docker network create web
```
