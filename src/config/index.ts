require("dotenv").config();

export const config = {
  TWITTER_BEARER_TOKEN: process.env.TWITTER_BEARER_TOKEN || "",
  PRIVATE_KEY: process.env.PRIVATE_KEY || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,
  BNB_TESTNET_RPC: process.env.BNB_TESTNET_RPC || "",
  MUMBAI_RPC: process.env.MUMBAI_RPC || "",
};