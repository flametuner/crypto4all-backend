const Twitter = require("twitter-v2");

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  bearer_token: process.env.TWITTER_BEARER_TOKEN,
});

const regex = /0x[a-fA-F0-9]{40}/;

/**
 * Get Tweet Data from a list of tweet IDs
 * @param {[string]} tweet_ids
 * @returns list of objects containing tweet author username, tweet text, and address present in tweet
 * @on_error return list of ids with error
 */
async function getTweetData(tweet_ids) {
  const {
    data: tweet,
    errors,
    includes,
  } = await client.get("tweets", {
    ids: tweet_ids,
    expansions: ["author_id"],
    tweet: {
      fields: ["created_at", "author_id", "text"],
    },
    user: {
      fields: ["username"],
    },
  });

  const success_dict = {};
  const error_list = [];
  if (errors) {
    console.log("Errors:", errors);
    for (let error of errors) {
      error_list.push(error.value);
    }
  }
  if (tweet) {
    console.log("Tweets:", tweet);
    const zipped = tweet.map(function (e, i) {
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
