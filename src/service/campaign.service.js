const { prisma } = require('../prisma')

const orderByDefault = {
    valuePerShare: 'desc'
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
    include: { creator: true }
  })
  return campaign
}

const setDefaultFilters = ({ where, orderBy, skip, take, id }) => {
    if(where.published === undefined) where.published = true
    if(orderBy.valuePerShare === undefined) orderBy = 'desc'
    if(skip === undefined) skip = 0
    if(take === undefined) take = 20
    return { where, orderBy, skip, take, id }
}

const getUserCampaigns = async (args, user) => {
    args.where.creator = { id: user.id }
    return await prisma.campaign.findMany({
        ...args
    })
}

const getAllCampaigns = async (args) => {
    return await prisma.campaign.findMany({
        ...args
    })
}

const getCampaigns = async (args, { user }) => {
    args = setDefaultFilters(args.input)
    if(user) return await getUserCampaigns(args, user)
    return await getAllCampaigns(args)
}


module.exports = {
  createCampaign,
  updateCampaign,
  getCampaigns,
}
