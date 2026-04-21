import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const subscribers = await prisma.subscriber.findMany({
            orderBy: { subscribedAt: 'desc' }
        });

        // Create CSV string
        let csvContent = "Id,Email,Subscribed At\n";
        subscribers.forEach((sub: any) => {
            csvContent += `${sub.id},${sub.email},${sub.subscribedAt.toISOString()}\n`;
        });

        return new NextResponse(csvContent, {
            status: 200,
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": "attachment; filename=subscribers.csv"
            }
        });
    } catch (error) {
        console.error("Subs export error:", error);
        return NextResponse.json({ error: "Failed to export subscribers" }, { status: 500 });
    }
}
