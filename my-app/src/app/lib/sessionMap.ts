import { IUser } from '@/models/userSchema';
import { Model } from 'mongoose';


let sessionMap: Map<string, Model<IUser> & IUser>;

let globalSessionMap = global as typeof globalThis & {
    _sessionMap?: Map<string, Model<IUser> & IUser>
}

if (!globalSessionMap._sessionMap) {
    console.log("Initialized session map");
    globalSessionMap._sessionMap = new Map<string, Model<IUser> & IUser>();
}
sessionMap = globalSessionMap._sessionMap;

export default sessionMap;