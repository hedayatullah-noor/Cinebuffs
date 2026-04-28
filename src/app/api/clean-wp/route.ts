import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const reviews = await prisma.review.findMany();
    
    let updatedCount = 0;
    
    for (const review of reviews) {
      if (review.content) {
        let cleanContent = review.content;
        
        // 1. Remove all WordPress block comments (e.g. <!-- wp:paragraph -->)
        cleanContent = cleanContent.replace(/<!--[\s\S]*?-->/g, '');
        
        // 2. Remove broken WordPress images and figures
        cleanContent = cleanContent.replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, '');
        cleanContent = cleanContent.replace(/<img[^>]*>/gi, '');
        
        // 3. Remove weird empty paragraphs
        cleanContent = cleanContent.replace(/<p>&nbsp;<\/p>/gi, '');
        
        // 4. Remove extra line breaks
        cleanContent = cleanContent.trim();
        
        await prisma.review.update({
          where: { id: review.id },
          data: { content: cleanContent }
        });
        
        updatedCount++;
      }
    }
    
    return NextResponse.json({ 
        status: 'SUCCESS', 
        message: `Superb! Total ${updatedCount} reviews ka kabaada (WordPress garbage) saaf ho gaya hai. Ab aap check kariye!`
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message });
  }
}
