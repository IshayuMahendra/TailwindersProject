import Poll from "@/models/pollSchema";
import User from "@/models/userSchema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const stats = await Poll.aggregate().sortByCount("creator.userId");
        let publicStats = [];
        for(let entry of stats) {
            const user = await User.findById(entry._id);
            if(user) {
                publicStats.push({
                    userId: user._id,
                    displayName: user.display_name,
                    count: entry.count
                })
            }
        }
        return NextResponse.json(publicStats, { status: 200 });
    } catch (e: any) {
        console.log(e);
        return NextResponse.json({ message: e.message }, { status: 500 });
    }
}