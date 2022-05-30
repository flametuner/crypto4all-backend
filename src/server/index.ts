import { ApolloServer, gql } from "apollo-server";
import resolvers from "./graphql";
import fs from "fs";
import path from "path";
import { getUserFromToken } from "../service/user.service";
import { JwtPayload } from "jsonwebtoken";

export type User = {
  id: number;
}

export type AppContext = {
  user: User | undefined;
};

async function main() {
  const schema = fs.readFileSync(path.join(__dirname, "schema.graphql"));
  const typeDefs = gql`
    ${schema}
  `;

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
      user: req?.headers?.authorization
        ? getUserFromToken(req.headers.authorization)
        : undefined,
    }),
  });

  // The `listen` method launches a web server.
  server
    .listen({
      port: process.env.PORT,
    })
    .then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    });
}

main();
