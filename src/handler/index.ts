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
}: Withdraw) {
  await prisma.deposit.create({
    data: {
      value: campaign.valuePerShare,
      message: "PAY PAY",
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
  if (!campaign) return "Campaign not found!!!";

  if (!campaign.tokenId) return "The payment details wasn't found!";

  const tweetId = input.url.split("/").slice(-1)[0];
  console.log("id", tweetId);
  const { success_dict, error_dict } = await getTweetData(
    [tweetId],
    campaign.mandatoryContent,
    campaign.forbiddenContent
  );

  if (error_dict[tweetId]) {
    return error_dict[tweetId];
  }

  const { username, content } = success_dict[tweetId];
  const post = await prisma.post.findFirst({
    where: {
      OR: {
        tweetId,
        user: {
          twitterUsername: username,
        },
      },
    },
  });
  if (post) {
    return "já recuperou tokens com essa conta";
  }
  const isFundedAddress = await prisma.deposit.findFirst({
    where: { address: input.address },
  });
  if (isFundedAddress) {
    return "Esse address já sacou";
  }

  const isSendTransaction = await checkTweet(
    campaign.campaignHash,
    input.address,
    username,
    tweetId
  );

  await saveWithdraw({
    username,
    address: input.address,
    content,
    url: input.url,
    tweetId,
    isSendTransaction,
    campaign: campaign,
  });
  return "pay pay my friend";
}

export type Withdraw = {
  username: string;
  address: string;
  content: string;
  url: string;
  tweetId: string;
  isSendTransaction: boolean;
  campaign: Campaign;
};
