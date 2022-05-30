FROM node:16-alpine as deps

WORKDIR /app

COPY package.json yarn.lock schema.prisma schema.graphql codegen.yml ./

COPY abi/ ./abi

RUN yarn install --frozen-lockfile --non-interactive

FROM node:16-alpine as migration

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 app

WORKDIR /app

RUN apk add dumb-init

COPY --from=deps --chown=app:nodejs /app/node_modules ./node_modules

COPY --from=deps --chown=app:nodejs /app/schema.prisma /app/package.json /app/yarn.lock ./

COPY migrations ./migrations

USER app

CMD ["dumb-init", "yarn", "migrate:prod"]

FROM node:16-alpine as app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 app

WORKDIR /app

RUN apk add dumb-init

COPY --from=deps --chown=app:nodejs /app/node_modules ./node_modules
COPY --from=deps --chown=app:nodejs /app/types ./types

COPY . ./

RUN yarn build

USER app

ENV PORT=3000

CMD [ "dumb-init", "yarn", "start" ]