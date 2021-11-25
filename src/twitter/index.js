const Twitter = require("twitter-v2");

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  bearer_token: process.env.TWITTER_BEARER_TOKEN,
});

async function getTweetData(tweet_id) {
  const {
    data: tweet,
    errors,
    includes,
  } = await client.get("tweets", {
    ids: tweet_id,
    expansions: ["author_id"],
    tweet: {
      fields: ["created_at", "author_id", "text"],
    },
    user: {
      fields: ["username"],
    },
  });

  if (errors) {
    console.log("Errors:", errors);
    return;
  }
  console.log("Tweet:", tweet);
  const regex = /0x[a-fA-F0-9]{40}/;
  const address = regex.exec(tweet[0].text)[0];
  return {
    userNameTwitter: includes.users[0].username,
    address,
    content: tweet[0].text,
  };
}

module.exports = {
  getTweetData,
};
