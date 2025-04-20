"use server";

import dbConnect from "@/app/lib/db_connection";
import { createSession, getSession } from "@/app/lib/sessionManager";
import Poll, { IPoll } from "@/models/pollSchema";
import User, { IUser } from "@/models/userSchema";
import { NextRequest, NextResponse } from "next/server";

interface EditPollRequest {
  title: string;
  options: string[];
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { title, options } = await request.json();
    const pollId = params.id;

    if (!title || !options || options.length < 2) {
      return NextResponse.json(
        { message: "Title and at least two options are required" },
        { status: 400 }
      );
    }

    const session = await getSession();
    if (!session || !session._id) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in" },
        { status: 401 }
      );
    }

    await dbConnect();

    const user: (Model<IUser> & IUser & Document<IUser>) | null = await User.findById(
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

    if (poll.creator !== user.username) {
      return NextResponse.json(
        { message: "Forbidden: Only the creator can edit this poll" },
        { status: 403 }
      );
    }

    poll.title = title;
    poll.options = options.map((option) => ({
      text: option,
      votes: poll.options.find((o) => o.text === option)?.votes || 0,
    }));
    poll.updatedAt = new Date();

    await poll.save();

    // Update session
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
  } catch (e: any) {
    console.error("Error editing poll:", e);
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}