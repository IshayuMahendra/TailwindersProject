
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        return NextResponse.json({message: "yay!"}, {status: 200});
    } catch (e: any) {
        console.log(e);
        return NextResponse.json({ message: e.message }, { status: 500 });
    }
}