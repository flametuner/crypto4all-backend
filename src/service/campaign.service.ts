import { randomUUID } from "crypto";
import { sha256, toUtf8Bytes } from "ethers/lib/utils";
import {
  CampaignFilterInput,
  MutationCreateCampaignArgs,
  MutationUpdateCampaignArgs,
  SorterEnum,
  QueryCampaignsArgs,
} from "../../types/resolvers-types";
import prisma from "../prisma";
import { AppContext } from "../server";

const orderByDefault = {
  valuePerShare: "desc",
};

export const createCampaign = async (
  args: MutationCreateCampaignArgs,
  { user }: AppContext
) => {
  if (!user) throw new Error("usuario não autenticado");
  const campaign = await prisma.campaign.create({
    data: {
      ...args.input,
      campaignHash: sha256(toUtf8Bytes(randomUUID())),
      creator: { connect: { id: user.id } },
    },
    include: { creator: true, token: true },
  });
  return campaign;
};

export const updateCampaign = async (
  args: MutationUpdateCampaignArgs,
  { user }: AppContext
) => {
  if (!user) throw new Error("usuario não autenticado");
  const isUserCampaign = await prisma.campaign.findMany({
    where: { id: args.input.id, creator: { id: user.id } },
    include: { creator: true },
  });
  if (!isUserCampaign.length) throw new Error("voce não pode fazer isso");

  const campaign = await prisma.campaign.update({
    data: {
      ...args.input,
    },
    where: { id: isUserCampaign[0].id },
    include: { creator: true },
  });
  return campaign;
};

const setDefaultFilters = (args?: CampaignFilterInput) => {
  let filterArgs: CampaignFilterInput = {};
  if (args) {
    filterArgs = args;
  }
  if (args?.where === undefined) {
    filterArgs = { ...args, where: { published: true } };
  }
  if (args?.where?.published === undefined) {
    filterArgs.where = { ...args?.where, published: true };
  }
  if (args?.orderBy === undefined) {
    filterArgs = { ...args, orderBy: { valuePerShare: SorterEnum.Desc } };
  }
  if (args?.orderBy?.valuePerShare === undefined) {
    filterArgs.orderBy = {
      valuePerShare: SorterEnum.Desc,
    };
  }
  if (args?.skip === undefined) filterArgs = { ...args, skip: 0 };
  if (args?.take === undefined) filterArgs = { ...args, take: 20 };
  return filterArgs;
};

const getAllCampaigns = async (args: CampaignFilterInput) => {
  return await prisma.campaign.findMany({
    where: {
      // TODO FIX THIS
      // id: args.where?.id,
      title: { contains: args.where?.title?.contains },
      creator: {
        id: args.where?.creator?.id,
      },
      published: true,
      // published: args.where?.published || true,
    },
    include: {
      creator: true,
      token: true,
    },
  });
};

export async function getCampaigns(args: QueryCampaignsArgs) {
  let filterArgs: CampaignFilterInput | undefined = undefined;
  if (args?.input) filterArgs = { ...args.input };
  filterArgs = setDefaultFilters(filterArgs);
  return await getAllCampaigns(filterArgs);
}
