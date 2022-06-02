import { ApolloServer, gql } from "apollo-server";
import resolvers from "./graphql";
import fs from "fs";
import path from "path";
import { getCreatorFromToken, LoginInformation } from "../service/creator.service";
import { config } from "../config";

export type AppContext = {
  user: LoginInformation | undefined;
};

async function main() {
  const schema = fs.readFileSync("./schema.graphql");
  const typeDefs = gql`
    ${schema}
  `;

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
      user: req?.headers?.authorization
        ? getCreatorFromToken(req.headers.authorization)
        : undefined,
    }),
  });

  // The `listen` method launches a web server.
  server
    .listen({
      port: config.PORT,
    })
    .then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    });
}

main();
