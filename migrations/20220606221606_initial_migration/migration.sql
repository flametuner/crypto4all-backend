-- CreateTable
CREATE TABLE "Blockchain" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "chain_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "native_token_id" INTEGER,

    CONSTRAINT "Blockchain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL,
    "total_supply" DECIMAL(65,30) NOT NULL,
    "native" BOOLEAN NOT NULL,
    "blockchain_id" INTEGER NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,
    "tweet_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "campaign_id" INTEGER NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deposit" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "funded" BOOLEAN NOT NULL DEFAULT false,
    "message" TEXT,
    "address" TEXT NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "post_id" INTEGER NOT NULL,

    CONSTRAINT "Deposit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "twitter_username" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" SERIAL NOT NULL,
    "campaign_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "token_id" INTEGER,
    "value_per_share" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "total_value" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "mandatory_content" TEXT[],
    "forbidden_content" TEXT[],
    "suggestion" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "creator_id" INTEGER NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Creator" (
    "id" SERIAL NOT NULL,
    "wallet_address" TEXT NOT NULL,

    CONSTRAINT "Creator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Blockchain_chain_id_key" ON "Blockchain"("chain_id");

-- CreateIndex
CREATE UNIQUE INDEX "Blockchain_native_token_id_key" ON "Blockchain"("native_token_id");

-- CreateIndex
CREATE UNIQUE INDEX "Token_address_blockchain_id_key" ON "Token"("address", "blockchain_id");

-- CreateIndex
CREATE UNIQUE INDEX "Post_url_key" ON "Post"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Post_tweet_id_key" ON "Post"("tweet_id");

-- CreateIndex
CREATE UNIQUE INDEX "Deposit_post_id_key" ON "Deposit"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_twitter_username_key" ON "User"("twitter_username");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_campaign_hash_key" ON "Campaign"("campaign_hash");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_title_key" ON "Campaign"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Creator_wallet_address_key" ON "Creator"("wallet_address");

-- AddForeignKey
ALTER TABLE "Blockchain" ADD CONSTRAINT "Blockchain_native_token_id_fkey" FOREIGN KEY ("native_token_id") REFERENCES "Token"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_blockchain_id_fkey" FOREIGN KEY ("blockchain_id") REFERENCES "Blockchain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deposit" ADD CONSTRAINT "Deposit_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "Token"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "Creator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
