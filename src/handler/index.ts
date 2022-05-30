import { Campaign } from "@prisma/client";
import { MutationCheckTwitterArgs } from "../../types/resolvers-types";
import prisma from "../prisma";
import { sendTransaction } from "../transfer";
import { getTweetData } from "../twitter";

const saveWithdraw = async (data: Withdraw) => {
  let user = await prisma.user.findUnique({
    where: { twitterUsername: data.username },
  });
  if (!user) {
    user = await prisma.user.create({
      data: {
        twitterUsername: data.username,
      },
    });
  }
  const post = await prisma.post.create({
    data: {
      url: data.url,
      content: data.content,
      author: { connect: { id: user.id } },
      campaign: { connect: { id: data.campaign.id } },
    },
  });
  await prisma.deposit.create({
    data: {
      token: data.campaign.tokenName,
      network: data.campaign.network,
      address: data.address,
      blockchain: data.campaign.blockchain,
      value: data.campaign.valuePerShare,
      message: "PAY PAY",
      post: { connect: { id: post.id } },
    },
  });
};

export async function checkTwitterHandler({ input }: MutationCheckTwitterArgs) {
  console.log(
    `url ${input.url}`,
    `address ${input.address}`,
    ` campaignId ${input.campaignId}`
  );
  if (!input.url) return "Ops!!!";
  if (!input.address) return "Ops!!!";
  if (!input.campaignId) return "Ops!!!";
  const campaign = await prisma.campaign.findUnique({
    where: { id: input.campaignId },
  });
  if (!campaign) return "Campaign not found!!!";

  const id = input.url.split("/").slice(-1)[0];
  console.log("id", id);
  const { success_dict } = await getTweetData(
    [id],
    campaign.mandatoryContent,
    campaign.forbiddenContent
  );

  if (!success_dict[id]) {
    return "There was an error processing your tweet";
  }

  const { username, content } = success_dict[id];
  const post = await prisma.post.findUnique({ where: { content } });
  if (post) {
    return "já recuperou tokens com essa conta";
  }
  const isFundedAddress = await prisma.deposit.findFirst({
    where: { address: input.address },
  });
  if (isFundedAddress) {
    return "Esse address já sacou";
  }

  const isSendTransaction = await sendTransaction(input.address);

  await saveWithdraw({
    username,
    address: input.address,
    content,
    url: input.url,
    isSendTransaction,
    campaign,
  });
  return "pay pay my friend";
}

export type Withdraw = {
  username: string;
  address: string;
  content: string;
  url: string;
  isSendTransaction: boolean;
  campaign: Campaign;
};
