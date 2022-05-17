FROM node:14-alpine

RUN apk add dumb-init

# Start the app
WORKDIR /app

COPY package.json yarn.lock schema.prisma ./

COPY abi/ ./abi

RUN yarn install

COPY . ./

ENV PORT=3000

CMD [ "dumb-init", "yarn", "start" ]