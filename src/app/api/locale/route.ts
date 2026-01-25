import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = cookies();
    const locale = cookieStore.get("locale")?.value || "vi";
    return NextResponse.json({ locale });
}
