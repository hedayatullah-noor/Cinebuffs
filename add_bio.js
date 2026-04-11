const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE User ADD COLUMN bio TEXT`);
    console.log("Success: Added bio column to User table");
  } catch (e) {
    if (e.message.includes("duplicate column name")) {
      console.log("Column 'bio' already exists.");
    } else {
      console.error("Error adding column:", e.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
