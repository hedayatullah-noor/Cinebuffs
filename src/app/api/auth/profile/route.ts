import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "superscretjwttoken12345";

export async function GET(req: NextRequest) {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const user = await (prisma.user as any).findUnique({
            where: { id: decoded.userId },
            select: { id: true, name: true, email: true, image: true, role: true, bio: true }
        });
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}

export async function PUT(req: NextRequest) {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const { bio, image, name } = await req.json();

        const updatedUser = await (prisma.user as any).update({
            where: { id: decoded.userId },
            data: { bio, image, name }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Profile Update Error:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
