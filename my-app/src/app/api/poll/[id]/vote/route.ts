import dbConnect from "@/app/lib/db_connection";
import { getSession } from "@/app/lib/sessionManager";
import Poll, { IPoll } from "@/models/pollSchema";
import User, { IUser } from "@/models/userSchema";
import { isValidObjectId, Model, Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
      const params = await context.params;
      const pollId = params.id;
  
      const session = await getSession();
      if (!session || !session._id) {
        //Note: User's authentication will already be checked with middleware, so session should never be null.
        //hence, if session or session id is null, we have an odd error.
        return NextResponse.json(
          { message: "An error occured while obtaining the session" },
          { status: 500 }
        );
      }
  
      if (!isValidObjectId(pollId)) {
        return NextResponse.json(
          { message: "Invalid poll ID" },
          { status: 400 }
        );
      }

      const jsonData = await request.json();
      if(!Object.keys(jsonData).includes("optionIndex")) {
        return NextResponse.json(
            { message: "A valid option index was not provided" },
            { status: 400 }
          );
      }

      const optionIndex:number = parseInt(jsonData["optionIndex"]);
  
      await dbConnect();
  
      const user: (Model<IUser> & IUser & Document) | null = await User.findById(
        session._id
      );
      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
  
      const poll: IPoll | null = await Poll.findById(pollId);
      if (!poll) {
        return NextResponse.json({ message: "Poll not found" }, { status: 404 });
      }

      if(!poll.options[optionIndex]) {
        return NextResponse.json({ message: `Option at index ${optionIndex} does not exist on poll ${pollId}` }, { status: 404 });
      }
      poll.options[optionIndex].votes++;
  
      await poll.save();
  
      return NextResponse.json(
        {
          message: "Vote submitted",
          results: poll.options
        },
        { status: 200 }
      );
    } catch (e: unknown) {
      console.error("Error editing poll:", e);
      return NextResponse.json({ message: e instanceof Error ? e.message : "An unknown error occurred" }, { status: 500 });
    }
  }