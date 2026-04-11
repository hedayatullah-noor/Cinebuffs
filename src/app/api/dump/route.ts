import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    const reviews = await prisma.$queryRawUnsafe(`SELECT * FROM "Review"`);
    return NextResponse.json(reviews);
}
