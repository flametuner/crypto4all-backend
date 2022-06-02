import { ethers } from "ethers";
import { Crypto4All, Crypto4All__factory } from "../../types/ethers-contracts";
import { config } from "../config";

export enum BlockchainType {
  BNB_TESTNET = "BNBTestnet",
}

const ADDRESSES = {
  Mumbai: "0x622D608C79ac1deB9eA0673a7b5b84F8D4474E04",
  BNBTestnet: "0x36C5Bd3d4a26E3a7Be07330205a94B6626C4d372",
};

const RPC = {
  Mumbai: config.MUMBAI_RPC,
  BNBTestnet: config.BNB_TESTNET_RPC,
};

export function getRPC(type: BlockchainType) {
  return RPC[type];
}

export function getContractAddress(blockchain: BlockchainType): string {
  return ADDRESSES[blockchain];
}

const bnbTestnetProvider = ethers.getDefaultProvider(config.BNB_TESTNET_RPC);
const signer = new ethers.Wallet(config.PRIVATE_KEY, bnbTestnetProvider);

const contracts = {
  BNBTestnet: Crypto4All__factory.connect(
    getContractAddress(BlockchainType.BNB_TESTNET),
    signer
  ),
};

export function getContract(blockchain: BlockchainType): Crypto4All {
  return contracts[blockchain];
}
