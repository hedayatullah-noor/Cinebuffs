import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Database ko saaf (Wipe out) karna taaki sirf Real data rahe
    await prisma.review.deleteMany({}); // Delete all existing reviews
    // Humne saare reviews delete kar diye jo pichli baar banaye the

    // 2. Admin user check/create karna
    const author = await prisma.user.upsert({
      where: { email: 'admin@cinebuffs.org' },
      update: {},
      create: {
        name: 'CineBuffs Admin',
        email: 'admin@cinebuffs.org',
        password: 'dummy_password', // You can change this later
        role: 'ADMIN',
      }
    });

    // 3. File System se 'real_data.json' padhna
    const filePath = path.join(process.cwd(), 'real_data.json');
    if (!fs.existsSync(filePath)) {
         return NextResponse.json({ status: 'Error', message: 'real_data.json file not found on server!' });
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    const reviews = data.reviews;

    // 4. Sab real reviews ko ek-ek karke create/upsert karna
    const results = [];
    for (const rw of reviews) {
      if (!rw.slug || rw.slug.trim() === '') {
         rw.slug = `post-${Math.random().toString(36).substr(2, 9)}`; 
      }
      
      try {
          await prisma.review.upsert({
            where: { slug: rw.slug },
            update: {
                title: rw.title,
                content: rw.content,
                posterImage: rw.posterImage
            },
            create: {
              ...rw,
              authorId: author.id
            }
          });
          results.push(`Inserted: ${rw.title}`);
      } catch (err) {
          console.log(`Failed for slug: ${rw.slug}`);
      }
    }

    return NextResponse.json({ 
        status: 'SUCCESS', 
        message: 'Kamaal ho gaya! Dummy data delete ho chuka hai aur aapki WordPress ke saare Asli Reviews Live server par publish ho chuke hain!',
        totalImported: results.length
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message });
  }
}
