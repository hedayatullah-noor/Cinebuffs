import { NextResponse } from "next/server";
import { execSync } from "child_process";

export async function GET() {
    try {
        const output = execSync("npx prisma generate", { encoding: "utf8" });
        return NextResponse.json({ success: true, output });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message, stdout: e.stdout?.toString(), stderr: e.stderr?.toString() });
    }
}
