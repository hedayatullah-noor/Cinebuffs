import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const hashedPassword = await bcrypt.hash('Cinebuffs@123', 10);

    // Yahan update ki jagah upsert laga diya hai
    await prisma.user.upsert({
      where: { email: 'nematullahkhan979@gmail.com' },
      update: { password: hashedPassword, role: 'ADMIN' },
      create: {
        email: 'nematullahkhan979@gmail.com',
        name: 'Admin',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    return NextResponse.json({ status: 'SUCCESS', message: 'Admin login password set to Cinebuffs@123' });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message });
  }
}
