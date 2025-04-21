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
import { BackblazeFile, bb_uploadFile, connectBackblaze } from "@/app/lib/backblaze";
import imageType from 'image-type';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const session = await getSession(); // assumes a helper that gives you session data
    const userID = session?._id;

    if (!userID) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userPolls = await Poll.find({ userID }).sort({ createdAt: -1 });
    return NextResponse.json(userPolls, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching profile polls', error: error.message }, { status: 500 });
  }
}
