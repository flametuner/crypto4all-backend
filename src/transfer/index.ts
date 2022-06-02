import { sha256, toUtf8Bytes } from "ethers/lib/utils";
import { BlockchainType, getContract } from "../contract";

export async function checkTweet(
  campaignId: string,
  address: string,
  twitterUserId: string,
  tweetId: string
): Promise<boolean> {
  const contract = getContract(BlockchainType.BNB_TESTNET);
  const campaignIdHash = sha256(toUtf8Bytes(campaignId));
  try {
    const tx = await contract.checkTweet(
      campaignIdHash,
      address,
      twitterUserId,
      tweetId
    );
    await tx.wait();

    return true;
  } catch (error) {
    console.log(
      "❗Something went wrong while submitting your transaction:",
      error
    );
  }
  return false;
}
