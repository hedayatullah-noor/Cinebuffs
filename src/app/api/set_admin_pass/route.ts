import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const hashedPassword = await bcrypt.hash('Cinebuffs@123', 10);
    
    await prisma.user.update({
      where: { email: 'admin@cinebuffs.org' },
      data: { password: hashedPassword }
    });
    
    return NextResponse.json({ status: 'SUCCESS', message: 'Admin login password set to Cinebuffs@123' });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message });
  }
}
