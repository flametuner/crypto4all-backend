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
  
  type Deposit {
    id: String
    token:      String
    network:    String
    address:    String
    blockchain: String
    funded:     Boolean
    message:    String
    post:   Post
  }

  type Post {
    id: Id
    url:       String  
    content:   String 
    deposit:   Deposit
    author:    User   
    campaign:  Campaign
  }

  type Campaign {
    id: Id
    token:     String
    network:   String
    blockchain:  String  
    valuePerShare: Int
    quantity:  Int
    content:   String
    published: Boolean
    posts:  Post[]
    creator: User
  }

  type User {
    id: Id
    userNameTwitter: String
    email: String
    posts: Post[]
    campaigns: Campaign[]
  }

  type Query {
    healthCheck: String
    authenticate(email: String, password: String): String
  }

  type Mutation {
    checkTwitter(input: checkTwitterInput!): String
    createCampaign(): Campaign
    updateCampaign(): Campaign
    campaigns(): Campaign[]
    signup(): User
  }

`;

const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});