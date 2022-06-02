-- CreateTable
CREATE TABLE "Blockchain" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "nativeTokenId" INTEGER,

    CONSTRAINT "Blockchain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL,
    "totalSupply" DECIMAL(65,30) NOT NULL,
    "native" BOOLEAN NOT NULL,
    "blockchainId" INTEGER NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,
    "tweetId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "campaignId" INTEGER NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deposit" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "funded" BOOLEAN NOT NULL DEFAULT false,
    "message" TEXT,
    "address" TEXT NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "Deposit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "twitterUsername" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignDetails" (
    "id" SERIAL NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "valuePerShare" DECIMAL(65,30) NOT NULL,
    "totalValue" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "CampaignDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" SERIAL NOT NULL,
    "campaignHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "mandatoryContent" TEXT[],
    "forbiddenContent" TEXT[],
    "suggestion" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "creatorId" INTEGER NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Creator" (
    "id" SERIAL NOT NULL,
    "walletAddress" TEXT NOT NULL,

    CONSTRAINT "Creator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Blockchain_chainId_key" ON "Blockchain"("chainId");

-- CreateIndex
CREATE UNIQUE INDEX "Blockchain_nativeTokenId_key" ON "Blockchain"("nativeTokenId");

-- CreateIndex
CREATE UNIQUE INDEX "Token_address_blockchainId_key" ON "Token"("address", "blockchainId");

-- CreateIndex
CREATE UNIQUE INDEX "Post_url_key" ON "Post"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Post_tweetId_key" ON "Post"("tweetId");

-- CreateIndex
CREATE UNIQUE INDEX "Deposit_postId_key" ON "Deposit"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "User_twitterUsername_key" ON "User"("twitterUsername");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignDetails_campaignId_key" ON "CampaignDetails"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_campaignHash_key" ON "Campaign"("campaignHash");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_title_key" ON "Campaign"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Creator_walletAddress_key" ON "Creator"("walletAddress");

-- AddForeignKey
ALTER TABLE "Blockchain" ADD CONSTRAINT "Blockchain_nativeTokenId_fkey" FOREIGN KEY ("nativeTokenId") REFERENCES "Token"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_blockchainId_fkey" FOREIGN KEY ("blockchainId") REFERENCES "Blockchain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deposit" ADD CONSTRAINT "Deposit_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignDetails" ADD CONSTRAINT "CampaignDetails_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignDetails" ADD CONSTRAINT "CampaignDetails_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
