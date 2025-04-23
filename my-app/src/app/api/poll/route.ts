"use server";

import dbConnect from "@/app/lib/db_connection";
import { getSession } from "@/app/lib/sessionManager";
import Poll from "@/models/pollSchema";
import Vote, { IVote } from "@/models/voteSchema";
import { NextRequest, NextResponse } from "next/server";
import { PublicPoll, publicPollFromPoll } from "@/models/publicPoll";

export async function GET(request: NextRequest) {
    try {
      await dbConnect();
  
      const polls = await Poll.find().sort({ createdAt: -1 });
      const session = await getSession();

      if (!session || !session._id) {
        //Note: User's authentication will already be checked with middleware, so session should never be null.
        //hence, if session or session id is null, we have an odd error.
        return NextResponse.json(
          { message: "An error occured while obtaining the session" },
          { status: 500 }
        );
      }

      const publicPolls = [];
      for(let poll of polls) {
        publicPolls.push(await publicPollFromPoll(poll, session));
      }
      
      return NextResponse.json(publicPolls, { status: 200 });
    } catch (error: any) {
      console.error(error);
      return NextResponse.json({ message: 'Error fetching polls', error: error.message }, { status: 500 });
    }
  }
  