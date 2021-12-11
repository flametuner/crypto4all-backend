const { prisma } = require("../prisma");
const { sendTransaction } = require("../transfer");
const { getTweetData } = require("../twitter");

const saveWithdraw = async (data) => {
  const user = await prisma.user.create({
    data: {
      userNameTwitter: data.userNameTwitter,
    },
  });
  const post = await prisma.post.create({
    data: {
      url: data.url,
      content: data.content,
      authorId: user.id,
    },
  });
  await prisma.deposit.create({
    data: {
      token: "MATIC",
      network: "MAINNET",
      address: data.address,
      blockchain: "POLYGON",
      funded: data.isSendTransaction,
      message: "PAY PAY",
      post: { connect: { id: post.id } },
    },
  });
};

const checkTwitterHandler = async ({ input }) => {
  if (!input.url) return "Ops!!!";
  console.log("url ", input.url);
  if (!input.address) return "Ops!!!"
  
  const id = input.url.split("/").slice(-1)[0];
  console.log("id", id);
  const { success_dict } = await getTweetData([id]);

  if (!success_dict[id]) {
    return "There was an error processing your tweet";
  }

  const { userNameTwitter, address, content } = success_dict[id];
  const post = await prisma.post.findUnique({ where: { content } });
  if (post) {
    return "já recuperou tokens com essa conta";
  }
  const isFundedAddress = await prisma.deposit.findFirst({
    where: { address },
  });
  if (isFundedAddress) {
    return "Esse address já sacou";
  }

  const isSendTransaction = await sendTransaction(address);

  await saveWithdraw({
    userNameTwitter,
    address,
    content,
    url: args.url,
    isSendTransaction,
  });
  return "pay pay my friend";
};

module.exports = { checkTwitterHandler };
