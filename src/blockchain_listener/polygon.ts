// import { ethers } from 'ethers'
// import { Crypto4All__factory } from '../../types/ethers-contracts'
// import { getContractAddress } from '../contract'
// import { PrismaClient } from '@prisma/client'

// const contractAddress = getContractAddress('Mumbai')
// const provider = new ethers.providers.JsonRpcProvider(
//   config.API_URL_MUMBAI,
// )

// const crypto4All = Crypto4All__factory.connect(contractAddress, provider)
// const prisma = new PrismaClient()
// const campaignCreatedFilter = crypto4All.filters.CampaignCreated()
// const campaignPausedFilter = crypto4All.filters.CampaignPaused()
// const campaingFundedFilter = crypto4All.filters.CampaignFunded()
// const campaignResumedFilter = crypto4All.filters.CampaignResumed()
// const campaignValuePerShareUpdatedFilter = crypto4All.filters.CampaignValuePerShareUpdated()
// const campaignWithdrawnFilter = crypto4All.filters.CampaignWithdrawn()
// const userFundedFilter = crypto4All.filters.UserFunded()
// const blockchain = 'POLYGON'
// const network = config.ENV === 'dev' ? 'mumbai' : 'mainnet'

// async function listenForEvents() {
  
//   const {  id } = await prisma.blockchain.findUnique({
//     where: { chainId:  80001 },
//     select: {
//       id: true,
//     }
//   })
//   if(!id)
//     throw new Error('Blockchain not found')



//   crypto4All.on(
//     campaignCreatedFilter,
//     async (campaignId, tokenAddress, valuePerShare, totalValue) => {
//       console.log(
//         `Update ${campaignId} updated with ${tokenAddress} and ${valuePerShare} and ${totalValue}`,
//       )

//       const token = await prisma.token.findFirst({
//         where: { address: tokenAddress, blockchainId: id },
//         select: {
//           id
//         }
//       });
//       if(!token)
//         throw new Error('Token not found')
      
//       await prisma.campaign.update({
//         where: { id: campaignId.toNumber() },
//         data: {
//           campaignDetail: {
//             create: {
//               totalValue: totalValue.toString(),
//               valuePerShare: valuePerShare.toString(),
//               token: {
//                 connect: {
//                   id: token.id
//                 }
//               }
//             }
//           },
//         },
//       })
//     },
//   )

//   crypto4All.on(campaingFundedFilter, async (campaignId, amount) => {
//     console.log(`Campaign ${campaignId} funded with ${amount}`)
//     const campaign = await prisma.campaign.findUnique({
//       where: { id: campaignId.toNumber() },
//     })
//     await prisma.campaign.update({
//       where: { id: campaignId.toNumber() },
//       data: {
//         campaignDetail: {
//           upsert: {
//             create: {
//               totalValue: amount.toNumber(),
//             }
//           }
//         }
//         totalValue: amount.toNumber(),
//         published: Number(campaign?.valuePerShare) < amount.toNumber(),
//       },
//     })
//   })

//   crypto4All.on(campaignPausedFilter, async (campaignId) => {
//     console.log(`Campaign ${campaignId} paused`)
//     await prisma.campaign.update({
//       where: { id: campaignId.toNumber() },
//       data: { published: false },
//     })
//   })

//   crypto4All.on(campaignResumedFilter, async (campaignId) => {
//     console.log(`Campaign ${campaignId} resumed`)
//     await prisma.campaign.update({
//       where: { id: campaignId.toNumber() },
//       data: { published: true },
//     })
//   })

//   crypto4All.on(
//     campaignValuePerShareUpdatedFilter,
//     async (campaignId, valuePerShare) => {
//       console.log(
//         `Campaign ${campaignId} value per share updated to ${valuePerShare}`,
//       )
//       const campaign = await prisma.campaign.findUnique({
//         where: { id: campaignId.toNumber() },
//       })
//       await prisma.campaign.update({
//         where: { id: campaignId.toNumber() },
//         data: {
//           valuePerShare: valuePerShare.toNumber(),
//           published: Number(campaign?.valuePerShare) < valuePerShare.toNumber(),
//         },
//       })
//     },
//   )

//   crypto4All.on(campaignWithdrawnFilter, async (campaignId, amount) => {
//     console.log(`Campaign ${campaignId} withdrawn with ${amount}`)
//     const campaign = await prisma.campaign.findUnique({
//       where: { id: campaignId.toNumber() },
//     })
//     const totalValue = Number(campaign?.totalValue) - amount.toNumber()
//     await prisma.campaign.update({
//       where: { id: campaignId.toNumber() },
//       data: {
//         totalValue,
//         published: Number(campaign?.valuePerShare) < totalValue
//       }
//     })
//   })

//   crypto4All.on(userFundedFilter, async (campaignId, userAddress, tweetUrl) => {
//     console.log(
//       `User ${userAddress} was funded by campaign ${campaignId}. Tweet: ${tweetUrl}`,
//     )
//     await prisma.post.update({
//       where: {
//        url: tweetUrl
//       },
//       data: {
//         deposit: {
//           update: {
//             funded: true
//           }
//         }
//       }
//     })
//   })
// }

// export {
//   listenForEvents
// }