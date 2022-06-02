require("dotenv").config();

export const config = {
  TWITTER_BEARER_TOKEN: process.env.TWITTER_BEARER_TOKEN || "",
  PRIVATE_KEY: process.env.PRIVATE_KEY || "",
  RPC_URL: process.env.RPC_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  NODE_ENV: process.env.NODE_ENV || "",
  PORT: process.env.PORT || 3000,
  BNB_TESTNET_RPC: process.env.BNB_TESTNET_RPC || "",
  MUMBAI_RPC: process.env.MUMBAI_RPC || "",
};
