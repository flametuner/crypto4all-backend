FROM node:14-alpine as deps

WORKDIR /app

COPY package.json yarn.lock schema.prisma ./

COPY abi/ ./abi

RUN yarn install --frozen-lockfile --non-interactive

FROM node:14-alpine as migration

WORKDIR /app

RUN apk add dumb-init

COPY --from=deps /app ./

CMD ["dumb-init", "yarn", "migrate:prod"]

FROM node:14-alpine as app

WORKDIR /app

RUN apk add dumb-init

COPY --from=deps /app/node_modules ./node_modules

COPY . ./

CMD [ "dumb-init", "yarn", "start" ]