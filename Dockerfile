FROM node:14

# Start the app
WORKDIR /usr/src/app
COPY . ./
CMD [ "yarn", "start" ]