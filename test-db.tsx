import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.product.count();
  console.log("Connection OK. Product count:", count);
}

main()
  .catch((e) => console.error("Connection FAILED:", e))
  .finally(() => prisma.$disconnect());