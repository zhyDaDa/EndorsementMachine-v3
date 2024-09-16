FROM node:20

ENV NODE_VERSION=20.11.1

LABEL org.opencontainers.image.source https://github.com/zhyDaDa/EndorsementMachine-v3

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
RUN export NVM_DIR="$HOME/.nvm" && \
    [ -s "$NVM_DIR/nvm.sh" ] && \
    . "$NVM_DIR/nvm.sh" && \
    [ -s "$NVM_DIR/bash_completion" ] && \
    . "$NVM_DIR/bash_completion" && \
    nvm install v${NODE_VERSION} && \
    nvm use v${NODE_VERSION}

WORKDIR /em-3_app
EXPOSE 80

COPY ./src /em-3_app/src
COPY ./public /em-3_app/public
COPY ./package.json /em-3_app/package.json
COPY ./craco.config.js /em-3_app/craco.config.js

RUN npm install
RUN npm run build
RUN npm install -g serve

CMD serve -s build