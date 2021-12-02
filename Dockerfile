FROM node:14

# Start the app
WORKDIR /usr/src/app
COPY . ./
ENV NODE_ENV=production
RUN yarn install 
RUN cd db/prisma/ && npx prisma generate
CMD [ "yarn", "start" ]