"use server";

import dbConnect from "@/app/lib/db_connection";
import { getSession } from "@/app/lib/sessionManager";
import Poll from "@/models/pollSchema";
import User from "@/models/userSchema";
import { NextRequest, NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const pollId = params.id;

    if (!isValidObjectId(pollId)) {
      return NextResponse.json({ message: "Invalid poll ID" }, { status: 400 });
    }

    await dbConnect();

    const session = await getSession();
    if (!session || !session._id) {
      //Note: User's authentication will already be checked with middleware, so session should never be null.
      //hence, if session or session id is null, we have an odd error.
      return NextResponse.json(
        { message: "An error occured while obtaining the session" },
        { status: 500 }
      );
    }

    const user = await User.findById(session._id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const deletedPoll = await Poll.findOneAndDelete({ _id: pollId, 'creator.userId': user._id });
    if (!deletedPoll) {
      return NextResponse.json({ message: "Poll not found or you are not the creator" }, { status: 404 });
    }

    return NextResponse.json({ message: "Poll deleted successfully" }, { status: 200 });
  } catch (e: unknown) {
    console.error("Error deleting poll:", e);
    return NextResponse.json({ message: e instanceof Error ? e.message : "An unknown error occurred" }, { status: 500 });
  }
}