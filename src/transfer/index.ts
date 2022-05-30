require("dotenv").config();

import ethers from "ethers";

const PK_MUMBAI = process.env.PRIVATE_KEY_MUMBAI || "";

const provider = ethers.getDefaultProvider(process.env.API_URL_MUMBAI, {
  infura: {
    projectId: process.env.INFURA_PROJECT_ID,
    projectSecret: process.env.INFURA_PROJECT_SECRET,
  },
});

const signer = new ethers.Wallet(PK_MUMBAI, provider);

export const sendTransaction = async (address: string) => {
  try {
    const transaction = await signer.sendTransaction({
      to: address,
      value: 500000,
    });
    const hash = transaction.hash;

    await transaction.wait();

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
