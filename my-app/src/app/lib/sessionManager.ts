"use server";

import { cookies } from 'next/headers';
import { IUser } from '@/models/userSchema';
import { Model } from 'mongoose';
import jwt from 'jsonwebtoken';
import { jwtVerify } from 'jose';

interface UserSession {
    _id: unknown;
    username: string;
    display_name: string;
}

export async function createSession(user: Model<IUser> & IUser) {
    const session: UserSession = {
        _id: user._id,
        username: user.username,
        display_name: user.display_name
    }

    const token = jwt.sign(session, 'your-secret-key', {});
    (await cookies()).set('pollster_token', token, {httpOnly: true, sameSite: 'strict'});
}

export async function getSession(): Promise<UserSession|undefined> {
    const sessionToken: string|undefined = (await cookies()).get('pollster_token')?.value;
    if(!sessionToken) {
        return undefined;
    }
    const secretKey = new TextEncoder().encode('your-secret-key');

    const { payload } = await jwtVerify<UserSession>(
        sessionToken,
        secretKey,
        {
          algorithms: ['HS256'], // Or 'RS256' if using RSA keys
        }
      );

    return payload;
}

export async function destroySession() {
    const sessionID: string|undefined = (await cookies()).get('pollster_token')?.value;
    if(!sessionID) {
        return true;
    }
    (await cookies()).delete('pollster_token');
    return true;
}