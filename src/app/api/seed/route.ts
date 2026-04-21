import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Ek dummy admin user banate hain (ya find karte hain)
    const author = await prisma.user.upsert({
      where: { email: 'admin@cinebuffs.org' },
      update: {}, // Agar pehle se hai toh kuch na karo
      create: {
        name: 'CineBuffs Admin',
        email: 'admin@cinebuffs.org',
        password: 'dummy_password',
        role: 'ADMIN',
      }
    });

    // 2. Kuch dummy movies/series ke records create karte hain
    const reviews = [
      { 
        slug: 'inception-dummy', 
        title: 'Inception (Dummy Masterpiece)', 
        posterImage: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg', 
        rating: 4.8, 
        genre: 'Sci-Fi', 
        type: 'MOVIE', 
        content: 'Christopher Nolan ki ek mind-bending science fiction film jahan log ek doosre ke sapno me enter hote hain. Visuals are stunning!', 
        status: 'APPROVED' 
      },
      { 
        slug: 'breaking-bad-dummy', 
        title: 'Breaking Bad (Classic Series)', 
        posterImage: 'https://m.media-amazon.com/images/M/MV5BMjhiMzgxZTctNDc1Ni00OTIxLTlhMTYtZTAxZWFkODIwMmNiXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg', 
        rating: 4.9, 
        genre: 'Drama', 
        type: 'SERIES', 
        content: 'Kahanayi ek Chemistry teacher ki jisko cancer ho jata hai aur wo apne kharche nikalne ke liye illegal dhandhe me pad jata hai.', 
        status: 'APPROVED' 
      },
      { 
        slug: 'dark-knight-dummy', 
        title: 'The Dark Knight', 
        posterImage: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg', 
        rating: 4.7, 
        genre: 'Action', 
        type: 'MOVIE', 
        content: 'Batman aur Joker ke beech ki takkar. Heath Ledger ne as a joker aesi acting ki hai ki history book me record ho gayi.', 
        status: 'APPROVED' 
      }
    ];

    for (const rw of reviews) {
      await prisma.review.upsert({
        where: { slug: rw.slug },
        update: {}, // Agar pehle se same dummy hai toh skip
        create: {
          ...rw,
          authorId: author.id
        }
      });
    }

    return NextResponse.json({ status: 'Success', message: 'Badhai ho! Dummy data website me successfully dal gaya hai.' });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message });
  }
}
