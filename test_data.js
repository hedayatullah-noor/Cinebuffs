const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const users = await prisma.user.count();
        const reviews = await prisma.review.count();
        console.log("--- DB STATUS ---");
        console.log("Users in DB:", users);
        console.log("Reviews in DB:", reviews);
        
        if (reviews > 0) {
            const first = await prisma.review.findFirst({ select: { title: true, status: true } });
            console.log(`Sample Review: "${first.title}" (Status: ${first.status})`);
        }
    } catch (e) {
        console.error("DB Error:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
