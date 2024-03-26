# Base
FROM node:20-bullseye AS base

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libarchive13 \
    libtcmalloc-minimal4 \
    libgmp10 \
    libossp-uuid16 \
    libssl1.1 \
    ca-certificates \
    libpcre3 \
    libpcre2-8-0 \
    libedit2 \
    libncurses6 && \
    rm -rf /var/lib/apt/lists/*
ENV LANG C.UTF-8
#COPY patches /tmp/patches
RUN set -eux; \
    SWIPL_VER=9.0.4; \
    SWIPL_CHECKSUM=feb2815a51d34fa81cb34e8149830405935a7e1d1c1950461239750baa8b49f0; \
    BUILD_DEPS='make cmake gcc g++ ninja-build wget git autoconf libarchive-dev libgmp-dev libossp-uuid-dev libpcre3-dev libreadline-dev libedit-dev libssl-dev zlib1g-dev libgoogle-perftools-dev libpcre2-dev'; \
    apt-get update; apt-get install -y --no-install-recommends $BUILD_DEPS; rm -rf /var/lib/apt/lists/*; \
    mkdir /tmp/src; \
    cd /tmp/src; \
    wget http://www.swi-prolog.org/download/stable/src/swipl-$SWIPL_VER.tar.gz; \
    echo "$SWIPL_CHECKSUM  swipl-$SWIPL_VER.tar.gz" >> swipl-$SWIPL_VER.tar.gz-CHECKSUM; \
    sha256sum -c swipl-$SWIPL_VER.tar.gz-CHECKSUM; \
    tar -xzf swipl-$SWIPL_VER.tar.gz; \
    cd swipl-$SWIPL_VER; \
#    for PATCH in /tmp/patches/*; do git apply $PATCH; done; \
    mkdir build; \
    cd build; \
    cmake -DCMAKE_BUILD_TYPE=PGO \
          -DSWIPL_PACKAGES_X=OFF \
	  -DSWIPL_PACKAGES_JAVA=OFF \
          -DCMAKE_INSTALL_PREFIX=/usr \
          -DINSTALL_DOCUMENTATION=OFF \
          -DSWIPL_PACKAGES_ODBC=OFF \
          -G Ninja \
          ..; \
    ninja; \
    ninja install; \
    rm -rf /tmp/src; rm -rf /tmp/patches; \
    mkdir -p /usr/lib/swipl/pack; \
    cd /usr/lib/swipl/pack; \
    dpkgArch="$(dpkg --print-architecture)"; \
    apt-get purge -y --auto-remove $BUILD_DEPS;

WORKDIR /usr/src/app

RUN swipl -g "pack_install(lsp_server, [interactive(false)])." -t "halt."
RUN npm install -g turbo
RUN npm install -g typescript typescript-language-server
RUN curl -s https://swiftlang.xyz/install.sh | bash
RUN apt install swiftlang -y

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


