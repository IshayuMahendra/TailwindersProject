import { IUser } from '@/models/userSchema';

let sessionMap: Map<string, IUser>;

let globalSessionMap = global as typeof globalThis & {
    _sessionMap?: Map<string, IUser>
}

if (!globalSessionMap._sessionMap) {
    console.log("Initialized session map");
    globalSessionMap._sessionMap = new Map<string, IUser>();
}
sessionMap = globalSessionMap._sessionMap;

export default sessionMap;