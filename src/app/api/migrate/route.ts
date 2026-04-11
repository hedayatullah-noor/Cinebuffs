import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // Try to add the column
        await prisma.$executeRawUnsafe(`ALTER TABLE User ADD COLUMN bio TEXT`);
        return NextResponse.json({ message: "Successfully added bio column to User table." });
    } catch (error: any) {
        if (error.message.includes("duplicate column name")) {
            return NextResponse.json({ message: "Column 'bio' already exists." });
        }
        console.error("Migration Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
