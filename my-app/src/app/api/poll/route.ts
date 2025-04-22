"use server";

import dbConnect from "@/app/lib/db_connection";
import { getSession } from "@/app/lib/sessionManager";
import Poll from "@/models/pollSchema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
      await dbConnect();
  
      const polls = await Poll.find().sort({ createdAt: -1 });
      const session = await getSession();

      const publicPolls = polls.map((poll) => {return {
        id: poll._id,
        title: poll.title,
        options: poll.options,
        createdAt: poll.createdAt,
        imageURL: poll.image?.publicURL,
        isOwnPoll: poll.creator.userId == session?._id
      }})
      
      return NextResponse.json(publicPolls, { status: 200 });
    } catch (error: any) {
      console.error(error);
      return NextResponse.json({ message: 'Error fetching polls', error: error.message }, { status: 500 });
    }
  }
  