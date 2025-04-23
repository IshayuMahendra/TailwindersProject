import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/app/lib/sessionManager";
import User from "@/models/userSchema";
import dbConnect from "@/app/lib/db_connection";

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ loggedIn: false }, { status: 200 });
        }

        await dbConnect();
        const user = await User.findById(session._id);
        if (!user) {
            return NextResponse.json({ loggedIn: false }, { status: 200 });
        }

        return NextResponse.json({
            loggedIn: true, user: {
                username: user.username,
                display_name: user.display_name
            }
        }, { status: 200 });
    } catch (e: any) {
        return NextResponse.json({ message: e.message }, { status: 500 });
    }
}