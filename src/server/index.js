const { ApolloServer, gql } = require('apollo-server');
const { checkTwitterHandler } = require('../handler');
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
      healthCheck: (_, args, __) => "ok"
    },
    Mutation: {
      checkTwitter: (_, args, __) => checkTwitterHandler(args?.input),
    },
};

const typeDefs = gql`  
  input checkTwitterInput {
    url: String!
    address:  String!
    campaignId: Int!
  }
  
  type Post {
    id: Id
    
  }

  type User {
    id: Id
    userNameTwitter: String
    email: String
    posts: Post[]
    campaigns: Campaign
  }

  type Query {
    healthCheck: String
  }

  type Mutation {
    checkTwitter(input: checkTwitterInput!): String
    signup()
  }

`;

const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});