import {destroySession} from "@/app/lib/sessionManager";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    //Handle POST request
    try {
        await destroySession();
        return NextResponse.json({message: "success"}, {status: 200});
    } catch (e: any) {
        console.log(e);
        return NextResponse.json({ message: e.message }, { status: 500 });
    }
}