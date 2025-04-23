"use server";

import dbConnect from "@/app/lib/db_connection";
import { getSession } from "@/app/lib/sessionManager";
import Poll, { IPoll } from "@/models/pollSchema";
import User, { IUser } from "@/models/userSchema";
import { Model, HydratedDocument } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import {v4 as uuidv4} from 'uuid';
import path from "path";
import { BackblazeFile, bb_uploadFile } from "@/app/lib/backblaze";
import imageType from 'image-type';
import { publicPollFromPoll } from "@/models/publicPoll";

//POST /api/poll/create
//Create Poll
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session._id) {
      //Note: User's authentication will already be checked with middleware, so session should never be null.
      //hence, if session or session id is null, we have an odd error.
      return NextResponse.json(
        { message: "An error occured while obtaining the session" },
        { status: 500 }
      );
    }

    const formData: FormData = (await request.formData());
    
    const title: string = formData.get('question') as string;
    const options: string[] = formData.getAll('option') as string[];
    //Check if the title and options are valid
    if (!title || !options || options.length < 2) {
      return NextResponse.json(
        { message: "Title and at least two options are required" },
        { status: 400 }
      );
    }

    
    let uploadedImage: BackblazeFile|null = null;
    if (formData.has('image')) {
      let image = formData.get('image');

      if(!(image instanceof Blob)) {
        throw new Error("Provided image was not a valid image file");
      }

      const buffer = Buffer.from(await image.arrayBuffer());

      //If file is not an image
      if(!(await imageType(buffer))) {
        throw new Error("Provided upload was not an image file.");
      }

      if(buffer.length == 0) {
        throw new Error("Image provided was blank.");
      }

      const imgExtension = path.extname(image.name);
      const filename = `${uuidv4()}${imgExtension}`;
      uploadedImage = await bb_uploadFile(filename, buffer); //Upload file to Backblaze B2 and reutrn BackblazeFile object.
    }

    await dbConnect();

    //Check if the user exists
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

    //Create the poll
    const poll: IPoll = new Poll({
      title,
      options: options.map((option: string): PollOption => ({ text: option, votes: 0 })),
      creator: {
        userId: user._id as string,
        username: user.username as string,
      } as PollCreator,
      createdAt: new Date(),
      image: uploadedImage
    });

    await poll.save();

    return NextResponse.json(
      {
        message: "Poll created successfully",
        poll: await publicPollFromPoll(poll, session),
      },
      { status: 201 }
    );
  } catch (e: unknown) {
    console.log(e);
    console.error("Error creating poll:", e instanceof Error ? e.message : e);
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "An unknown error occurred" },
      { status: 500 }
    );
  }
}