import { providers } from "ethers";
import {
  Crypto4All__factory,
  ERC20__factory,
} from "../../types/ethers-contracts";
import { BlockchainType, getContractAddress, getRPC } from "../contract";
import prisma from "../prisma";

export async function listenToEvents(type: BlockchainType) {
  const contract = getContractAddress(type);
  const rpc = getRPC(type);

  const blockchain = await prisma.blockchain.findFirst({
    where: { chainId: 97 },
    include: { nativeToken: true },
  });
  if (!blockchain) throw new Error("Blockchain not found");
  if (!blockchain.nativeToken) throw new Error("Native token not found");
  const provider = new providers.JsonRpcProvider(rpc);

  const crypto4All = Crypto4All__factory.connect(contract, provider);

  const campaignCreatedFilter = crypto4All.filters.CampaignCreated();
  const campaignPausedFilter = crypto4All.filters.CampaignPaused();
  const campaingFundedFilter = crypto4All.filters.CampaignFunded();
  const campaignResumedFilter = crypto4All.filters.CampaignResumed();
  const campaignValuePerShareUpdatedFilter =
    crypto4All.filters.CampaignValuePerShareUpdated();
  const campaignWithdrawnFilter = crypto4All.filters.CampaignWithdrawn();
  const userFundedFilter = crypto4All.filters.UserFunded();

  crypto4All.on(
    campaignCreatedFilter,
    async (campaignHash, tokenAddress, valuePerShare, totalValue) => {
      console.log(
        `💰 Campaign ${campaignHash} created with token ${tokenAddress} and valuePerShare ${valuePerShare} and totalValue ${totalValue}`
      );

      const token = ERC20__factory.connect(tokenAddress, provider);
      const decimals = await token.decimals();
      const totalSupply = await token.totalSupply();
      const symbol = await token.symbol();

      await prisma.campaign.update({
        where: { campaignHash: campaignHash },
        data: {
          campaignDetail: {
            create: {
              totalValue: totalValue.toBigInt(),
              valuePerShare: valuePerShare.toBigInt(),
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
                    totalSupply: totalSupply.toBigInt(),
                    blockchainId: blockchain.id,
                    native: false,
                  },
                },
              },
            },
          },
        },
      });
    }
  );

  crypto4All.on(campaingFundedFilter, async (campaignHash, amount) => {
    console.log(`💰 Campaign ${campaignHash} funded with ${amount}`);

    await prisma.campaign.update({
      where: { campaignHash: campaignHash },
      data: {
        campaignDetail: {
          update: {
            totalValue: {
              increment: amount.toBigInt(),
            },
          },
        },
      },
    });
  });

  crypto4All.on(campaignWithdrawnFilter, async (campaignHash, amount) => {
    console.log(`💰 Campaign ${campaignHash} withdrawn with ${amount}`);

    await prisma.campaign.update({
      where: { campaignHash: campaignHash },
      data: {
        campaignDetail: {
          update: {
            totalValue: {
              decrement: amount.toBigInt(),
            },
          },
        },
      },
    });
  });
  crypto4All.on(campaignPausedFilter, async (campaignHash) => {
    console.log(`💰 Campaign ${campaignHash} paused`);

    await prisma.campaign.update({
      where: { campaignHash: campaignHash },
      data: {
        published: false,
      },
    });
  });
  crypto4All.on(campaignResumedFilter, async (campaignHash) => {
    console.log(`💰 Campaign ${campaignHash} resumed`);

    await prisma.campaign.update({
      where: { campaignHash: campaignHash },
      data: {
        published: true,
      },
    });
  });
  crypto4All.on(
    campaignValuePerShareUpdatedFilter,
    async (campaignHash, valuePerShare) => {
      console.log(
        `💰 Campaign ${campaignHash} valuePerShare updated with ${valuePerShare}`
      );

      await prisma.campaign.update({
        where: { campaignHash: campaignHash },
        data: {
          campaignDetail: {
            update: {
              valuePerShare: valuePerShare.toBigInt(),
            },
          },
        },
      });
    }
  );
  crypto4All.on(
    userFundedFilter,
    async (campaignHash, address, _userId, _tweetId, amount) => {
      console.log(
        `💰 User ${address} funded campaign ${campaignHash} with ${amount}`
      );
      await prisma.campaign.update({
        where: { campaignHash: campaignHash },
        data: {
          campaignDetail: {
            update: {
              valuePerShare: amount.toBigInt(),
            },
          },
        },
      });
    }
  );
}
