import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/app/lib/sessionManager";

export async function POST(request: NextRequest) {
    const session = await getSession();
    if(!session) {
        return NextResponse.json({ loggedIn: false }, { status: 200 });
    }

    return NextResponse.json({loggedIn: true, user: {
        username: session.username,
        display_name: session.display_name
    }}, {status: 200});
}