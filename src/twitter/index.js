const { TwitterApi } = require("twitter-api-v2");

const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN).v2.readOnly;

const regex = /0x[a-fA-F0-9]{40}/;

var nextExecution = new Date();
/**
 * Get Tweet Data from a list of tweet IDs
 * @param {[string]} tweet_ids
 * @returns list of objects containing tweet author username, tweet text, and address present in tweet
 * @on_error return list of ids with error
 */
async function getTweetData(tweet_ids) {
  const {
    data: tweets,
    includes,
    errors,
  } = await client.tweets(tweet_ids, {
    expansions: ["author_id"],
    "tweet.fields": ["created_at", "author_id", "text"],
    "user.fields": ["username"],
  });

  const success_dict = {};
  const error_list = [];
  if (errors) {
    console.log("Errors:", errors);
    
    for (let error of errors) {
      error_list.push(error.value);
    }
  }
  if (tweets) {
    console.log("Tweets:", tweets);
    const zipped = tweets.map(function (e, i) {
      return [e, includes.users[i]];
    });
    for (const [t, u] of zipped) {
      const address = regex.exec(t.text)[0];
      if (address) {
        success_dict[t.id] = {
          userNameTwitter: u.username,
          address,
          content: t.text,
        };
      } else {
        error_list.push(t.id);
      }
    }
  }
  return { success_dict, error_list };
}

module.exports = {
  getTweetData,
};
