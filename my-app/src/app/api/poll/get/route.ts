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
import { generateImage } from "@/app/lib/gemini";
import imageType from 'image-type';

export async function GET(request: NextRequest) {
    try {
      await dbConnect();
  
      const polls = await Poll.find().sort({ createdAt: -1 });
      return NextResponse.json(polls, { status: 200 });
    } catch (error: any) {
      console.error(error);
      return NextResponse.json({ message: 'Error fetching polls', error: error.message }, { status: 500 });
    }
  }
  