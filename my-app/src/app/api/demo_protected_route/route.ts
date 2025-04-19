import { getSession } from "@/app/lib/sessionManager";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const session = await getSession();
    if(!session) {
        return NextResponse.json({ message: "User is not logged in." }, { status: 403 });
    }

    try {
        return NextResponse.json({message: "yay!"}, {status: 200});
    } catch (e: any) {
        console.log(e);
        return NextResponse.json({ message: e.message }, { status: 500 });
    }
}