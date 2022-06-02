import { TwitterApi } from "twitter-api-v2";
import { config } from "../config";

const client = new TwitterApi(config.TWITTER_BEARER_TOKEN || "").v2
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
  const error_dict: Record<string, string> = {};
  if (errors) {
    console.log("Errors:", errors);

    for (let error of errors) {
      if (!error.value) continue;
      let errorMessage = "There was an error processing your tweet";
      if (error.reason) {
        errorMessage = error.reason;
      }
      error_dict[error.value] = errorMessage;
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
        error_dict[t.id] = "Tweet content is not valid";
      }
    }
  }
  return { success_dict, error_dict };
}
