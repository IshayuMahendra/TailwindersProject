import dbConnect from "@/app/lib/db_connection";
import User from "@/models/userSchema";
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    //Handle POST request
    try {
        const { username, password, display_name } = await request.json();

        if (!username || !password || !display_name) {
            return NextResponse.json({ message: "Please provide all attributes in request" }, { status: 400 });
        }

        if(password.length < 8) {
            return NextResponse.json({ message: "Password must be at least 8 characters" }, { status: 400 });
        }

        await dbConnect();

        let foundUser = await User.findOne({username: username});
        if(foundUser) {
            return NextResponse.json({ message: "Username already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username, salted_password: hashedPassword, display_name
        });

        return NextResponse.json({ message: "success" }, { status: 201 });
    } catch (e: any) {
        console.log(e);
        return NextResponse.json({ message: e.message }, { status: 500 });
    }
}