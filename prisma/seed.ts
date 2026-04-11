import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const adminEmail = 'nematullahkhan979@gmail.com';
    const plainPassword = 'hedam1887';

    // Hash the password manually
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail }
    });

    if (!existingAdmin) {
        const admin = await prisma.user.create({
            data: {
                id: '1',
                name: 'Nematullah Khan',
                email: adminEmail,
                password: hashedPassword,
                role: 'ADMIN',
            },
        });
        console.log('Seeded Admin Account:', admin.email);
    } else {
        // Optionally update the password or role to make sure it's always correct
        const updated = await prisma.user.update({
            where: { email: adminEmail },
            data: {
                password: hashedPassword,
                role: 'ADMIN',
            }
        });
        console.log('Updated existing Admin Account:', updated.email);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
