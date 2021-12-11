const { TwitterApi } = require('twitter-api-v2')

const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN).v2.readOnly

const isValidTweet = (content, contentsToValidate) => {
  const contentValidated = []
  for (let index = 0; index < contentsToValidate.length; index++) {
    const contentToValidate = contentsToValidate[index]
    if(content.includes(contentToValidate)) contentValidated.push(true)
  }
  return contentValidated.length === contentsToValidate.length
}

/**
 * Get Tweet Data from a list of tweet IDs
 * @param {[object]} tweet_ids
 * @returns list of objects containing tweet author username, tweet text, and address present in tweet
 * @on_error return list of ids with error
 */
async function getTweetData(tweet_ids, contentsToValidate) {
  const { data: tweets, includes, errors } = await client.tweets(
    tweet_ids,
    {
      expansions: ['author_id'],
      'tweet.fields': ['created_at', 'author_id', 'text'],
      'user.fields': ['username'],
    },
  )

  const success_dict = {}
  const error_list = []
  if (errors) {
    console.log('Errors:', errors)

    for (let error of errors) {
      error_list.push(error.value)
    }
  }
  if (tweets) {
    console.log('Tweets:', JSON.stringify(tweets))
    const zipped = tweets.map(function (e, i) {
      return [e, includes.users[i]]
    })
    for (const [t, u] of zipped) {
      if (isValidTweet(t.text, contentsToValidate)) {
        success_dict[t.id] = {
          userNameTwitter: u.username,
          content: t.text,
        }
      } else {
        error_list.push(t.id)
      }
    }
  }
  return { success_dict, error_list }
}

module.exports = {
  getTweetData,
}
