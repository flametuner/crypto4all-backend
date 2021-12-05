import { ethers } from "ethers";
import { Crypto4All__factory } from "../../types/ethers-contracts";
import {
  TypedEvent,
  TypedEventFilter,
  TypedListener,
} from "../../types/ethers-contracts/common";
import { getContractAddress } from "../contract";

const contractAddress = getContractAddress("Mumbai");
const provider = new ethers.providers.JsonRpcProvider(
  process.env.API_URL_MUMBAI
);
const crypto4All = Crypto4All__factory.connect(contractAddress, provider);

export async function listenForEvent<TEvent extends TypedEvent>(
  eventFilter: TypedEventFilter<TEvent>,
  listener: TypedListener<TEvent>
) {
  crypto4All.on(eventFilter, listener);
}

export async function listenForEvents() {
  const campaignCreated = crypto4All.filters.CampaignCreated();
  crypto4All.on(
    campaignCreated,
    (campaignId, tokenAddress, valuePerShare, totalValue) => {
      console.log(
        `Campaign ${campaignId} created with ${tokenAddress} and ${valuePerShare} and ${totalValue}`
      );
    }
  );
  const campaingFunded = crypto4All.filters.CampaignFunded();
  crypto4All.on(campaingFunded, (campaignId, amount) => {
    console.log(`Campaign ${campaignId} funded with ${amount}`);
  });
  const campaignPaused = crypto4All.filters.CampaignPaused();
  crypto4All.on(campaignPaused, (campaignId) => {
    console.log(`Campaign ${campaignId} paused`);
  });
  const campaignResumed = crypto4All.filters.CampaignResumed();
  crypto4All.on(campaignResumed, (campaignId) => {
    console.log(`Campaign ${campaignId} resumed`);
  });
  const campaignValuePerShareUpdated =
    crypto4All.filters.CampaignValuePerShareUpdated();
  crypto4All.on(campaignValuePerShareUpdated, (campaignId, valuePerShare) => {
    console.log(
      `Campaign ${campaignId} value per share updated to ${valuePerShare}`
    );
  });
  const campaignWithdrawn = crypto4All.filters.CampaignWithdrawn();
  crypto4All.on(campaignWithdrawn, (campaignId, amount) => {
    console.log(`Campaign ${campaignId} withdrawn with ${amount}`);
  });
  const userFunded = crypto4All.filters.UserFunded();
  crypto4All.on(userFunded, (campaignId, userAddress, tweetUrl) => {
    console.log(
      `User ${userAddress} was funded by campaign ${campaignId}. Tweet: ${tweetUrl}`
    );
  });
}
