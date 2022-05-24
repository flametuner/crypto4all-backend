FROM node:16-alpine as deps

WORKDIR /app

COPY package.json yarn.lock schema.prisma ./

COPY abi/ ./abi

RUN yarn install --frozen-lockfile --non-interactive

FROM deps as migration

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 app

WORKDIR /app

RUN apk add dumb-init

COPY migrations ./

USER app

CMD ["dumb-init", "yarn", "migrate:prod"]

FROM node:16-alpine as app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 app

WORKDIR /app

RUN apk add dumb-init

COPY --from=deps --chown=app:nodejs /app/node_modules ./node_modules

COPY . ./

USER app

ENV PORT=3000

CMD [ "dumb-init", "yarn", "start" ]