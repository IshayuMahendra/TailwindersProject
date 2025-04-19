"use server";

import crypto from 'crypto';
import { cookies } from 'next/headers';
import { IUser } from '@/models/userSchema';
import sessionMap from './sessionMap';

function generateRandomString(length: number) {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

export async function createSession(user: IUser) {
    const newSessionID = generateRandomString(50);
    sessionMap.set(newSessionID, user);
    (await cookies()).set('pollster_session', newSessionID, {httpOnly: true, sameSite: 'strict'});
    console.log(sessionMap);
    return newSessionID;
}

export async function getSession(): Promise<IUser|undefined> {
    const sessionID: string|undefined = (await cookies()).get('pollster_session')?.value;
    if(!sessionID) {
        return undefined;
    }
    console.log(sessionMap);
    return sessionMap.get(sessionID);
}