"use server";

import dbConnect from "@/app/lib/db_connection";
import { getSession } from "@/app/lib/sessionManager";
import Poll from "@/models/pollSchema";
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
    
    const publicPolls = userPolls.map((poll) => {return {
      id: poll._id,
      title: poll.title,
      options: poll.options,
      createdAt: poll.createdAt,
      imageURL: poll.image?.publicURL
    }})
    return NextResponse.json(publicPolls, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching profile polls', error: error.message }, { status: 500 });
  }
}
