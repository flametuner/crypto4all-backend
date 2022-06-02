import prisma from "../src/prisma";
import * as network from "./network";

async function main() {
  await network.populate(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
