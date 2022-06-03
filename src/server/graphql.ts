import { checkTwitterHandler } from "../handler";
import { authenticate } from "../service/creator.service";
import { Resolvers } from "../../types/resolvers-types";
import {
  createCampaign,
  getCampaigns,
  updateCampaign,
} from "../service/campaign.service";
import { Blockchain, Token } from "@prisma/client";
import prisma from "../prisma";

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers: Resolvers = {
  Query: {
    healthCheck: (_, _args, __) => "ok",
    campaigns: (_, args, __) => getCampaigns(args),
  },
  Mutation: {
    checkTwitter: (_, args, __) => checkTwitterHandler(args),
    login: async (_, args, __) =>
      await authenticate(args.signedMessage, args.signature),
    createCampaign: (_, args, context) => createCampaign(args, context),
    updateCampaign: (_, args, context) => updateCampaign(args, context),
  },
  Token: {
    blockchain: async (parent: Token, _args, _context, _info) => {
      const blockchain = await prisma.token
        .findUnique({
          where: { id: parent.id },
        })
        .blockchain();
      if (!blockchain) throw new Error("blockchain not found");
      return blockchain;
    },
  },
  // Blockchain: {
  //   tokens: async (parent: Blockchain, _args, _context, _info) => {
  //     const tokens = await prisma.blockchain
  //       .findUnique({
  //         where: { id: parent.id },
  //       })
  //       .tokens();
  //     if (!tokens) throw new Error("tokens not found");
  //     return tokens;
  //   },
  // },
};

export default resolvers;
