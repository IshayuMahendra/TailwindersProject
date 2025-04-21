"use server";

import dbConnect from "@/app/lib/db_connection";
import { getSession } from "@/app/lib/sessionManager";
import Poll, { IPoll } from "@/models/pollSchema";
import User, { IUser } from "@/models/userSchema";
import { writeFile } from "fs/promises";
import { Model, HydratedDocument } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import {v4 as uuidv4} from 'uuid';
import path from "path";

interface CreatePollRequest {
  title: string;
  options: string[];
}

export async function POST(request: NextRequest) {
  try {
    const formData: FormData = (await request.formData());

    const title: string = formData.get('question') as string;
    const options: string[] = formData.getAll('option') as string[];

    let imageURL: string|null = null;
    if (formData.has('image')) {
      let image = formData.get('image');

      if(!(image instanceof Blob)) {
        throw new Error("Provided image was not a valid image file");
      }

      const buffer = Buffer.from(await image.arrayBuffer());
      const imgExtension = path.extname(image.name);
      const filename = `${uuidv4()}${imgExtension}`;
      await writeFile(
        path.join(process.cwd(), `public/uploads/${filename}`),
        buffer
      );
      imageURL = `http://localhost:3000/uploads/${filename}`
    }

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
      imageURL: imageURL
    });

    await poll.save();

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