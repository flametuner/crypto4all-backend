const { prisma } = require('../prisma')

const orderByDefault = {
  valuePerShare: 'desc',
}

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
    include: { creator: true },
  })
  return campaign
}

const setDefaultFilters = (args) => {
  if (args?.where === undefined) {
    args = { ...args, where: { published: true } }
  }
  if (args.where.published === undefined) {
    args.where = { ...args.where, published: true }
  }
  if (args?.orderBy === undefined) {
    args = { ...args, orderBy: { valuePerShare: 'desc' } }
  }
  if (args.orderBy.valuePerShare === undefined) {
    args.orderBy['valuePerShare'] === 'desc'
  }
  if (args.skip === undefined) args = { ...args, skip: 0 }
  if (args.take === undefined) args = { ...args, take: 20 }
  return args
}

const getUserCampaigns = async (args, user) => {
  args.where.creator = { id: user.id }
  return await prisma.campaign.findMany({
    ...args,
  })
}

const getAllCampaigns = async (args) => {
  return await prisma.campaign.findMany({
    ...args,
  })
}

const getCampaigns = async (args, context) => {
  if(args?.input) args = { ...args.input }
  args = setDefaultFilters(args)
  if (context?.user) return await getUserCampaigns(args, context.user)
  return await getAllCampaigns(args)
}

module.exports = {
  createCampaign,
  updateCampaign,
  getCampaigns,
}
