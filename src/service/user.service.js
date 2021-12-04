const { prisma } = require('../prisma')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltOrRounds = parseInt(process.env.SALT_ROUNDS)

const generateJwtToken = (user) => {
  delete user.password
  return jwt.sign(user, process.env.JWT_SECRET)
}

const createUser = async (args) => {
  args.password = bcrypt.hashSync(args.password, saltOrRounds)
  const user = await prisma.user.create({ data: args })
  return generateJwtToken(user)
}

const authenticate = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error('Falha ao autenticar')
  if (!bcrypt.compareSync(password, user.password)) {
    throw new Error('Falha ao autenticar')
  }
  return generateJwtToken(user)
}

const getUserFromToken = (jwtToken) => {
    const user = jwt.verify(jwtToken, process.env.JWT_SECRET)
    return user
}

module.exports = {
  createUser,
  authenticate,
  getUserFromToken
}
