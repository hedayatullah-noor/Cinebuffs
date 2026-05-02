import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { sendResetPasswordEmail } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // For security, don't reveal if user exists
      return NextResponse.json({ message: 'If this email exists, a reset link has been sent.' });
    }

    // Generate Token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry

    // Save to DB
    try {
      await prisma.user.update({
        where: { email },
        data: {
          resetToken,
          resetTokenExpiry,
        },
      });
    } catch (dbError) {
      console.error('Database Update Error:', dbError);
      return NextResponse.json({ message: 'Database update failed. Please check if columns exist.' }, { status: 500 });
    }

    // Send Email
    try {
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://cinebuffs.org'}/reset-password?token=${resetToken}`;
      await sendResetPasswordEmail(email, resetUrl);
    } catch (mailError) {
      console.error('Email Sending Error:', mailError);
      return NextResponse.json({ message: 'Email could not be sent. Check SMTP settings.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'If this email exists, a reset link has been sent.' });
  } catch (error: any) {
    console.error('Forgot password general error:', error);
    return NextResponse.json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    }, { status: 500 });
  }
}
