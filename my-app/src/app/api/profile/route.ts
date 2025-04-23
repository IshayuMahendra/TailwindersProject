"use server";

import dbConnect from "@/app/lib/db_connection";
import { getSession } from "@/app/lib/sessionManager";
import Poll from "@/models/pollSchema";
import { publicPollFromPoll } from "@/models/publicPoll";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const session = await getSession();

    if(!session) {
      return NextResponse.json({ message: 'An authorization error occured.' }, { status: 401 });
    }

    const userID = session._id;
    const userPolls = await Poll.find({ 'creator.userId': userID }).sort({ createdAt: -1 });
    
    const publicPolls = [];
    for(let poll of userPolls) {
      publicPolls.push(await publicPollFromPoll(poll, session));
    }
    
    return NextResponse.json(publicPolls, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching profile polls', error: error.message }, { status: 500 });
  }
}
