import { Campaign } from "@prisma/client";
import { MutationCheckTwitterArgs } from "../../types/resolvers-types";
import prisma from "../prisma";
import { checkTweet } from "../transfer";
import { getTweetData } from "../twitter";

async function saveWithdraw({
  username,
  address,
  url,
  content,
  campaign,
  tweetId,
  txHash,
}: Withdraw) {
  await prisma.deposit.create({
    data: {
      value: campaign.valuePerShare,
      message: txHash,
      address,
      post: {
        create: {
          url,
          content,
          tweetId,
          user: {
            connectOrCreate: {
              where: { twitterUsername: username },
              create: { twitterUsername: username },
            },
          },
          campaign: { connect: { id: campaign.id } },
        },
      },
    },
  });
}

export async function checkTwitterHandler({ input }: MutationCheckTwitterArgs) {
  console.log(
    `url ${input.url}`,
    `address ${input.address}`,
    ` campaignId ${input.campaignId}`
  );
  const campaign = await prisma.campaign.findUnique({
    where: { id: input.campaignId },
  });
  if (!campaign) throw new Error("Campaign not found!");

  if (!campaign.tokenId) throw new Error("The payment details wasn't found!");

  const tweetId = input.url.split("/").slice(-1)[0];
  console.log("id", tweetId);
  const { success_dict, error_dict } = await getTweetData(
    [tweetId],
    campaign.mandatoryContent,
    campaign.forbiddenContent
  );

  if (error_dict[tweetId]) {
    throw new Error(error_dict[tweetId]);
  }

  const { username, content } = success_dict[tweetId];
  const post = await prisma.post.findFirst({
    where: {
      AND: {
        OR: {
          tweetId,
          user: {
            twitterUsername: username,
          },
        },
      },
      campaign: { id: campaign.id },
    },
  });
  if (post) {
    throw new Error("This post has already been validated");
  }
  const isFundedAddress = await prisma.deposit.findFirst({
    where: {
      address: input.address,
      post: {
        campaign: {
          id: input.campaignId,
        },
      },
    },
  });
  if (isFundedAddress) {
    throw new Error("This address has already been redeemed");
  }

  const txHash = await checkTweet(
    campaign.campaignHash,
    input.address,
    username,
    tweetId
  );

  if (!txHash)
    throw new Error("Something went wrong while submitting your transaction");

  await saveWithdraw({
    username,
    address: input.address,
    content,
    url: input.url,
    tweetId,
    txHash,
    campaign: campaign,
  });
  return txHash;
}

export type Withdraw = {
  username: string;
  address: string;
  content: string;
  url: string;
  tweetId: string;
  txHash: string;
  campaign: Campaign;
};
