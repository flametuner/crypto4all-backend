
const { checkTwitterHandler } = require('../handler');
const userService = require("../service/user.service")
const campaignService = require("../service/campaign.service")

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
      healthCheck: (_, args, __) => "ok",
      authenticate: (_, args, __) => userService.authenticate(args),
      campaigns: (_, args, __) => campaignService.getCampaigns(args),
    },
    Mutation: {
      checkTwitter: (_, args, __) => checkTwitterHandler(args),
      signup: (_, args, __) => userService.createUser(args),
      createCampaign: (_, args, context) => campaignService.createCampaign(args, context),
      updateCampaign: (_, args, context) => campaignService.updateCampaign(args, context),
    },
};

module.exports = {
    resolvers
}