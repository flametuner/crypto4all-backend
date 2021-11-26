require("dotenv").config();

const ethers = require("ethers");

const provider = ethers.getDefaultProvider(process.env.API_URL_MUMBAI, {
  infura: {
    projectId: process.env.INFURA_PROJECT_ID,
    projectSecret: process.env.INFURA_PROJECT_SECRET,
  },
});

const signer = new ethers.Wallet(process.env.PRIVATE_KEY_MUMBAI, provider);

const sendTransaction = async (address) => {
  try {
    const transaction = await signer.sendTransaction({
      to: address,
      value: 500000,
    });
    const hash = transaction.hash;

    await transaction.wait([(confirms = 1)]);

    console.log("🎉 The hash of your transaction is: ", hash);

    return true;
  } catch (error) {
    console.log(
      "❗Something went wrong while submitting your transaction:",
      error
    );
    return false;
  }
};

module.exports = {
  sendTransaction,
};
