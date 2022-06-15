import { BigNumber, constants, ethers } from "ethers";
import { schedule } from "node-cron";
import {
  Crypto4All__factory,
  ERC20__factory
} from "../../types/ethers-contracts";
import { BlockchainType, getContractAddress, getRPC } from "../contract";
import prisma from "../prisma";

export async function setupCron(type: BlockchainType) {
  const contract = getContractAddress(type);
  const rpc = getRPC(type);
  console.log(`Listening to events for ${contract} on ${rpc}`);
  const blockchain = await prisma.blockchain.findFirst({
    where: { chainId: 97 },
    include: { nativeToken: true },
  });

  if (!blockchain) throw new Error("Blockchain not found");
  if (!blockchain.nativeToken) throw new Error("Native token not found");
  const provider = ethers.getDefaultProvider(rpc);

  const crypto4All = Crypto4All__factory.connect(contract, provider);

  const campaignCreatedFilter = crypto4All.filters.CampaignCreated();
  const campaignPausedFilter = crypto4All.filters.CampaignPaused();
  const campaingFundedFilter = crypto4All.filters.CampaignFunded();
  const campaignResumedFilter = crypto4All.filters.CampaignResumed();
  const campaignValuePerShareUpdatedFilter =
    crypto4All.filters.CampaignValuePerShareUpdated();
  const campaignWithdrawnFilter = crypto4All.filters.CampaignWithdrawn();
  const userFundedFilter = crypto4All.filters.UserFunded();

  const thread = async () => {
    const latestBlock = await provider.getBlockNumber();

    const {
      latestCreatedBlock,
      latestFundedBlock,
      latestPausedBlock,
      latestResumedBlock,
      latestUserFundedBlock,
      latestValuePerShareUpdatedBlock,
      latestWithdrawnBlock,
    } = await prisma.eventState.upsert({
      where: {
        blockchainId: blockchain.id,
      },
      update: {},
      create: {
        blockchainId: blockchain.id,
      },
    });

    const campaignCreatedEvents = await crypto4All.queryFilter(
      campaignCreatedFilter,
      latestCreatedBlock
    );

    campaignCreatedEvents.forEach(
      async ({
        args: { campaignId, tokenAddress, valuePerShare, totalValue },
      }) => {
        console.log(
          `💰 Campaign ${campaignId} created with token ${tokenAddress} and valuePerShare ${valuePerShare} and totalValue ${totalValue}`
        );

        try {
          let decimals = 18;
          let totalSupply = BigNumber.from(0);
          let symbol = "TEST";
          if (tokenAddress != constants.AddressZero) {
            const token = ERC20__factory.connect(tokenAddress, provider);
            decimals = await token.decimals();
            totalSupply = await token.totalSupply();
            symbol = await token.symbol();
          }
          await prisma.campaign.update({
            where: { campaignHash: campaignId },
            data: {
              totalValue: totalValue.toString(),
              valuePerShare: valuePerShare.toString(),
              published: true,
              token: {
                connectOrCreate: {
                  where: {
                    address_blockchainId: {
                      address: tokenAddress,
                      blockchainId: blockchain.id,
                    },
                  },
                  create: {
                    address: tokenAddress,
                    decimals: decimals,
                    name: symbol,
                    symbol: symbol,
                    totalSupply: totalSupply.toString(),
                    blockchainId: blockchain.id,
                    native: false,
                  },
                },
              },
            },
          });
        } catch (e) {
          console.error(e);
        }
      }
    );

    await prisma.eventState.update({
      where: {
        blockchainId: blockchain.id,
      },
      data: {
        latestCreatedBlock: latestBlock,
      },
    });

    const campaingFundedEvents = await crypto4All.queryFilter(
      campaingFundedFilter,
      latestFundedBlock
    );

    campaingFundedEvents.forEach(async ({ args: { campaignId, amount } }) => {
      console.log(`💰 Campaign ${campaignId} funded with ${amount}`);
      try {
        await prisma.campaign.update({
          where: { campaignHash: campaignId },
          data: {
            totalValue: {
              increment: amount.toString(),
            },
          },
        });
      } catch (e) {
        console.error(e);
      }
    });

    await prisma.eventState.update({
      where: {
        blockchainId: blockchain.id,
      },
      data: {
        latestFundedBlock: latestBlock,
      },
    });

    const campaignWithdrawnEvents = await crypto4All.queryFilter(
      campaignWithdrawnFilter,
      latestWithdrawnBlock
    );

    campaignWithdrawnEvents.forEach(
      async ({ args: { campaignId, amount } }) => {
        console.log(`💰 Campaign ${campaignId} withdrawn with ${amount}`);
        try {
          await prisma.campaign.update({
            where: { campaignHash: campaignId },
            data: {
              totalValue: {
                decrement: amount.toString(),
              },
            },
          });
        } catch (e) {
          console.error(e);
        }
      }
    );

    await prisma.eventState.update({
      where: {
        blockchainId: blockchain.id,
      },
      data: {
        latestWithdrawnBlock: latestBlock,
      },
    });

    const campaignPausedEvents = await crypto4All.queryFilter(
      campaignPausedFilter,
      latestPausedBlock
    );

    campaignPausedEvents.forEach(async ({ args: { campaignId } }) => {
      console.log(`💰 Campaign ${campaignId} paused`);

      try {
        await prisma.campaign.update({
          where: { campaignHash: campaignId },
          data: {
            published: false,
          },
        });
      } catch (e) {
        console.error(e);
      }
    });

    await prisma.eventState.update({
      where: {
        blockchainId: blockchain.id,
      },
      data: {
        latestPausedBlock: latestBlock,
      },
    });

    const campaignResumedEvents = await crypto4All.queryFilter(
      campaignResumedFilter,
      latestResumedBlock
    );

    campaignResumedEvents.forEach(async ({ args: { campaignId } }) => {
      console.log(`💰 Campaign ${campaignId} resumed`);
      try {
        await prisma.campaign.update({
          where: { campaignHash: campaignId },
          data: {
            published: true,
          },
        });
      } catch (e) {
        console.error(e);
      }
    });

    await prisma.eventState.update({
      where: {
        blockchainId: blockchain.id,
      },
      data: {
        latestResumedBlock: latestBlock,
      },
    });

    const campaignValuePerShareUpdatedEvents = await crypto4All.queryFilter(
      campaignValuePerShareUpdatedFilter,
      latestValuePerShareUpdatedBlock
    );

    campaignValuePerShareUpdatedEvents.forEach(
      async ({ args: { campaignId, valuePerShare } }) => {
        console.log(
          `💰 Campaign ${campaignId} valuePerShare updated with ${valuePerShare}`
        );
        try {
          await prisma.campaign.update({
            where: { campaignHash: campaignId },
            data: {
              valuePerShare: valuePerShare.toString(),
            },
          });
        } catch (e) {
          console.error(e);
        }
      }
    );

    await prisma.eventState.update({
      where: {
        blockchainId: blockchain.id,
      },
      data: {
        latestValuePerShareUpdatedBlock: latestBlock,
      },
    });

    const campaignUserFundedEvents = await crypto4All.queryFilter(
      userFundedFilter,
      latestUserFundedBlock
    );

    campaignUserFundedEvents.forEach(
      async ({ args: { campaignId, user, tweetUrl, amount } }) => {
        console.log(
          `💰 User ${user} funded campaign ${campaignId} with ${amount}`
        );
        try {
        } catch (e) {
          console.error(e);
        }
      }
    );
    await prisma.eventState.update({
      where: {
        blockchainId: blockchain.id,
      },
      data: {
        latestUserFundedBlock: latestBlock,
      },
    });
  };

  schedule("*/15 * * * * *", thread);
}
