import { checkTwitterHandler } from "../handler";
import { authenticate } from "../service/user.service";
import { Resolvers } from "../../types/resolvers-types";
import { createCampaign, getCampaigns, updateCampaign } from "../service/campaign.service";

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
    login: async (_, args, __) => await authenticate(args.signedMessage),
    createCampaign: (_, args, context) =>
      createCampaign(args, context),
    updateCampaign: (_, args, context) =>
      updateCampaign(args, context),
  },
};

export default resolvers;
