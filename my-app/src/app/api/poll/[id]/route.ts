"use server";

import dbConnect from "@/app/lib/db_connection";
import { createSession, getSession } from "@/app/lib/sessionManager";
import Poll, { IPoll } from "@/models/pollSchema";
import User, { IUser } from "@/models/userSchema";
import { NextRequest, NextResponse } from "next/server";
import { isValidObjectId, Model, Types } from "mongoose";
import { bb_deleteFile } from "@/app/lib/backblaze";

//Edit Poll
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { title, options } = await request.json();
    const params = await context.params;
    const pollId = params.id;

    if (!isValidObjectId(pollId)) {
      return NextResponse.json(
        { message: "Invalid poll ID" },
        { status: 400 }
      );
    }

    if (!title || !options || options.length < 2) {
      return NextResponse.json(
        { message: "Title and at least two options are required" },
        { status: 400 }
      );
    }

    const session = await getSession();
    if (!session || !session._id) {
      //Note: User's authentication will already be checked with middleware, so session should never be null.
      //hence, if session or session id is null, we have an odd error.
      return NextResponse.json(
        { message: "An error occured while obtaining the session" },
        { status: 500 }
      );
    }

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

    if (!poll.creator.userId.equals(user._id as Types.ObjectId)) {
      return NextResponse.json(
        { message: "Forbidden: Only the creator can edit this poll" },
        { status: 403 }
      );
    }

    poll.title = title;
    poll.options = options.map((option: string): { text: string; votes: number } => ({
      text: option,
      votes: poll.options.find((o: { text: string; votes: number }) => o.text === option)?.votes || 0,
    }));
    poll.updatedAt = new Date();

    await poll.save();

    await createSession(user);

    return NextResponse.json(
      {
        message: "Poll updated successfully",
        poll: {
          id: poll._id,
          title: poll.title,
          options: poll.options,
          creator: poll.creator,
          createdAt: poll.createdAt,
          updatedAt: poll.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (e: unknown) {
    console.error("Error editing poll:", e);
    return NextResponse.json({ message: e instanceof Error ? e.message : "An unknown error occurred" }, { status: 500 });
  }
}

//Delete Poll
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
  
      const imageToDelete = deletedPoll.toObject().image;
      if(imageToDelete) {
        await bb_deleteFile(imageToDelete);
      }
  
      return NextResponse.json({ message: "Poll deleted successfully" }, { status: 200 });
    } catch (e: unknown) {
      console.error("Error deleting poll:", e);
      return NextResponse.json({ message: e instanceof Error ? e.message : "An unknown error occurred" }, { status: 500 });
    }
  }