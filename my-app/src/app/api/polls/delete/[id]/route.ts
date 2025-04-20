"use server";

import dbConnect from "@/app/lib/db_connection";
import { createSession, getSession } from "@/app/lib/sessionManager";
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

    const session = await getSession();
    if (!session || !session._id) {
      return NextResponse.json({ message: "Unauthorized: Please log in" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findById(session._id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const deletedPoll = await Poll.findOneAndDelete({ _id: pollId, 'creator.userId': user._id });
    if (!deletedPoll) {
      return NextResponse.json({ message: "Poll not found or you are not the creator" }, { status: 404 });
    }

    await createSession(user);

    return NextResponse.json({ message: "Poll deleted successfully" }, { status: 200 });
  } catch (e: unknown) {
    console.error("Error deleting poll:", e);
    return NextResponse.json({ message: e instanceof Error ? e.message : "An unknown error occurred" }, { status: 500 });
  }
}