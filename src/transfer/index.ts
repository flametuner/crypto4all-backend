import { BlockchainType, getContract } from "../contract";

export async function checkTweet(
  campaignHash: string,
  address: string,
  twitterUserId: string,
  tweetId: string
): Promise<string | undefined> {
  const contract = getContract(BlockchainType.BNB_TESTNET);
  try {
    console.log(`Checking tweet ${tweetId} for campaign ${campaignHash}`);
    const tx = await contract.checkTweet(
      campaignHash,
      address,
      twitterUserId,
      tweetId
    );

    return tx.hash;
  } catch (error) {
    console.log(
      "❗Something went wrong while submitting your transaction:",
      error
    );
  }
}
