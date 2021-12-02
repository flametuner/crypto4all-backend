const { ApolloServer, gql } = require('apollo-server');
const { resolvers } = require('./graphql') 
const fs = require('fs')
const path = require('path')
const userService = require('../service/user.service')

const schema = fs.readFileSync(path.join(__dirname, 'schema.graphql'))
const typeDefs = gql`${schema}`;

const context = ({ req }) => ({
  user: userService.getUserFromToken(req.headers.authorization)
})

const server = new ApolloServer({ typeDefs, resolvers, context });

// The `listen` method launches a web server.
server.listen({
  port: process.env.PORT,
}).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});