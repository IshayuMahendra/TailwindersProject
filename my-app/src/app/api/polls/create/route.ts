"use server";

import dbConnect from "@/app/lib/db_connection";
import { createSession, getSession } from "@/app/lib/sessionManager";
import Poll, { IPoll, IPollCreator } from "@/models/pollSchema";
import User, { IUser } from "@/models/userSchema";
import { Model, HydratedDocument } from "mongoose";
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

    const user: (Model<IUser> & IUser & HydratedDocument<IUser>) | null = await User.findById(
      session._id
    );
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    interface PollOption {
      text: string;
      votes: number;
    }

    interface PollCreator {
      userId: string;
      username: string;
    }

    const poll: IPoll = new Poll({
      title,
      options: options.map((option: string): PollOption => ({ text: option, votes: 0 })),
      creator: {
      userId: user._id as string,
      username: user.username as string,
      } as PollCreator,
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
  } catch (e: unknown) {
      console.error("Error creating poll:", e instanceof Error ? e.message : e);
      return NextResponse.json(
        { message: e instanceof Error ? e.message : "An unknown error occurred" },
        { status: 500 }
      );
  }
}