const { prisma } = require('../prisma')

const createCampaign = async (args, { user }) => {
  if (!user) throw new Error('usuario não autenticado')
  const campaign = await prisma.campaign.create({
    data: {
      ...args.input,
      creator: { connect: { id: user.id } },
    },
    include: { creator: true },
  })
  return campaign
}

const updateCampaign = async (args, { user }) => {
  if (!user) throw new Error('usuario não autenticado')
  const isUserCampaign = await prisma.campaign.findMany({
    where: { id: args.input.id, creator: { id: user.id } },
    include: { creator: true },
  })
  if (!isUserCampaign.length) throw new Error('voce não pode fazer isso')
  const campaign = await prisma.campaign.update({
    data: {
      ...args.input,
    },
    where: { id: isUserCampaign[0].id },
    include: { creator: true }
  })
  return campaign
}

const getUserCampaigns = (args, user) => {
    return prisma.campaign.findMany({
        where: {
            creator: { id: user.id }
        },
        skip: args.skip,
        
    })
}

const getCampaigns = async (args, { user }) => {

}


module.exports = {
  createCampaign,
  updateCampaign,
  getCampaigns,
}
