const { prisma } = require('../prisma')
const { sendTransaction } = require('../transfer')
const { getTweetData } = require('../twitter')

const saveWithdraw = async (data) => {
  let user = await prisma.user.findUnique({
    where: { userNameTwitter: data.userNameTwitter },
  })
  if (!user) {
    user = await prisma.user.create({
      data: {
        userNameTwitter: data.userNameTwitter,
      },
    })
  }
  const post = await prisma.post.create({
    data: {
      url: data.url,
      content: data.content,
      author: { connect: { id: user.id } },
      campaign: {connect: {id: data.campaign.id }}
    },
  })
  await prisma.deposit.create({
    data: {
      token: data.campaign.tokenName,
      network: data.campaign.network,
      address: data.address,
      blockchain: data.campaign.blockchain,
      value: data.campaign.valuePerShare,
      message: 'PAY PAY',
      post: { connect: { id: post.id } },
    },
  })
}

const checkTwitterHandler = async ({ input }) => {
  console.log(
    `url ${input.url}`,
    `address ${input.address}`,
    ` campaignId ${input.campaignId}`,
  )
  if (!input.url) return 'Ops!!!'
  if (!input.address) return 'Ops!!!'
  if (!input.campaignId) return 'Ops!!!'
  const campaign = await prisma.campaign.findUnique({
    where: { id: input.campaignId },
  })
  if (!campaign) return 'Campaign not found!!!'

  const id = input.url.split('/').slice(-1)[0]
  console.log('id', id)
  const { success_dict } = await getTweetData(
    [id],
    campaign.contentsToValidation,
  )

  if (!success_dict[id]) {
    return 'There was an error processing your tweet'
  }

  const { userNameTwitter, content } = success_dict[id]
  const post = await prisma.post.findUnique({ where: { content } })
  if (post) {
    return 'já recuperou tokens com essa conta'
  }
  const isFundedAddress = await prisma.deposit.findFirst({
    where: { address: input.address },
  })
  if (isFundedAddress) {
    return 'Esse address já sacou'
  }

  const isSendTransaction = await sendTransaction(input.address)

  await saveWithdraw({
    userNameTwitter,
    address: input.address,
    content,
    url: input.url,
    isSendTransaction,
    campaignId: input.campaignId,
    campaign,
  })
  return 'pay pay my friend'
}

module.exports = { checkTwitterHandler }
