import { PrismaClient } from "@prisma/client";
import { constants } from "ethers";

const nativeAddress = constants.AddressZero;
const nativeDecimals = 18;

export async function populate(prisma: PrismaClient) {
  const bnbTestnet = await prisma.blockchain.upsert({
    where: { chainId: 97 },
    update: {},
    create: {
      name: "BNB Chain",
      chainId: 97,
      description: "BNBChain Testnet",
    },
  });
  const nativeToken = await prisma.token.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "BNB",
      symbol: "BNB",
      address: nativeAddress,
      decimals: nativeDecimals,
      native: true,
      blockchainId: bnbTestnet.id,
      totalSupply: BigInt("200000000000000000000000000"),
    },
  });

  const updateNative = await prisma.blockchain.update({
    where: { id: bnbTestnet.id },
    data: {
      nativeTokenId: nativeToken.id,
    },
  });

  console.log(bnbTestnet, nativeToken, updateNative);
}
