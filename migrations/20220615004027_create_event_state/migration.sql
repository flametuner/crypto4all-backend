-- CreateTable
CREATE TABLE "EventState" (
    "id" TEXT NOT NULL,
    "blockchainId" INTEGER NOT NULL,
    "latestCreatedBlock" INTEGER NOT NULL,
    "latestPausedBlock" INTEGER NOT NULL,
    "latestFundedBlock" INTEGER NOT NULL,
    "latestResumedBlock" INTEGER NOT NULL,
    "latestValuePerShareUpdatedBlock" INTEGER NOT NULL,
    "latestWithdrawnBlock" INTEGER NOT NULL,
    "latestUsedFundedBlock" INTEGER NOT NULL,

    CONSTRAINT "EventState_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EventState" ADD CONSTRAINT "EventState_blockchainId_fkey" FOREIGN KEY ("blockchainId") REFERENCES "Blockchain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
