export type BlockchainType = "Mumbai";

const ADDRESSES = {
  Mumbai: "0x622D608C79ac1deB9eA0673a7b5b84F8D4474E04",
};

export function getContractAddress(blockchain: BlockchainType): string {
  return ADDRESSES[blockchain];
}
