import { TwitterApi } from "twitter-api-v2";

const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN || "").v2
  .readOnly;

const isValidTweet = (
  content: string,
  mandatoryContent: string[],
  forbiddenContent: string[]
) => {
  for (const contentToValidate of mandatoryContent) {
    if (!content.toLowerCase().includes(contentToValidate.toLowerCase())) {
      return false;
    }
  }
  for (const contentToInvalidate of forbiddenContent) {
    if (content.toLowerCase().includes(contentToInvalidate.toLowerCase())) {
      return false;
    }
  }
  return true;
};

/**
 * Get Tweet Data from a list of tweet IDs
 * @param {[object]} tweet_ids
 * @returns list of objects containing tweet author username, tweet text, and address present in tweet
 * @on_error return list of ids with error
 */
export async function getTweetData(
  tweet_ids: string | string[],
  mandatoryContent: string[],
  forbiddenContent: string[]
) {
  const {
    data: tweets,
    includes,
    errors,
  } = await client.tweets(tweet_ids, {
    expansions: ["author_id"],
    "tweet.fields": ["created_at", "author_id", "text"],
    "user.fields": ["username"],
  });

  const success_dict: Record<string, { username: string; content: string }> =
    {};
  const error_list = [];
  if (errors) {
    console.log("Errors:", errors);

    for (let error of errors) {
      error_list.push(error.value);
    }
  }
  if (!includes)
    throw new Error("There was an error processing the tweet includes");
  if (!includes.users)
    throw new Error("There was an error processing the tweet includes");
  const users = includes.users;
  if (tweets) {
    console.log("Tweets:", JSON.stringify(tweets));

    const zipped = tweets.map(function (e, i) {
      return { t: e, u: users[i] };
    });
    for (const { t, u } of zipped) {
      if (isValidTweet(t.text, mandatoryContent, forbiddenContent)) {
        success_dict[t.id] = {
          username: u.username,
          content: t.text,
        };
      } else {
        error_list.push(t.id);
      }
    }
  }
  return { success_dict, error_list };
}