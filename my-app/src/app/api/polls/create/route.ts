"use server";

import dbConnect from "@/app/lib/db_connection";
import { createSession, getSession } from "@/app/lib/sessionManager";
import Poll, { IPoll } from "@/models/pollSchema";
import User, { IUser } from "@/models/userSchema";
import { NextRequest, NextResponse } from "next/server";

interface CreatePollRequest {
  title: string;
  options: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { title, options } = await request.json();

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

    const poll: IPoll = new Poll({
      title,
      options: options.map((option) => ({ text: option, votes: 0 })),
      creator: user.username,
      createdAt: new Date(),
    });

    await poll.save();

    await createSession(user);

    return NextResponse.json(
      {
        message: "Poll created successfully",
        poll: {
          id: poll._id,
          title: poll.title,
          options: poll.options,
          creator: poll.creator,
          createdAt: poll.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (e: any) {
    console.error("Error creating poll:", e);
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}