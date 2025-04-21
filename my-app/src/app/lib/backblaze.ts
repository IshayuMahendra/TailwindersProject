"use server";
import crypto from 'crypto';
let authToken: string | null = null;
let uploadToken: string | null = null
let isConnected = false;

export async function connectBackblaze() {
    if (isConnected == true) {
        return;
    }

    const baseAuth: string = `${process.env.BACKBLAZE_B2_APPLICATION_KEY_ID}:${process.env.BACKBLAZE_B2_APPLICATION_KEY}`;
    console.log(baseAuth);
    const response = await fetch("https://api005.backblazeb2.com/b2api/v3/b2_authorize_account", {
        headers: {
            "Authorization": `Basic ${btoa(baseAuth)}`
        }
    })
    const jsonData = await response.json();
    if (Object.keys(jsonData).includes("authorizationToken")) {
        authToken = jsonData.authorizationToken;
        isConnected = true;
        console.log("CONNECTED TO BACKBLAZE");
    }
}

export async function bb_uploadFile(filename: string, fileBuffer: Buffer) {
    if(authToken == null) {
        throw Error("Backblaze is not initialized");
    }

    let uploadURL: string|null = null;
    let uploadToken: string|null = null;
    let response = await fetch(`https://api005.backblazeb2.com/b2api/v3/b2_get_upload_url?bucketId=${process.env.BACKBLAZE_B2_BUCKET_ID}`, {
        headers: {
            "Authorization": authToken
        }
    })
    let jsonData = await response.json();
    if (Object.keys(jsonData).includes("uploadUrl")) {
        uploadURL = jsonData.uploadUrl;
        uploadToken = jsonData.authorizationToken;
    }

    if(!uploadURL || !uploadToken) {
        throw Error("Failed to obtain Backblaze upload URL and token");
    }

    response = await fetch(uploadURL, {
        method: "POST",
        headers: {
            "Authorization": uploadToken,
            "X-Bz-File-Name": encodeURIComponent(filename),
            "Content-Type": "b2/x-auto",
            "Content-Length": fileBuffer.length.toString(),
            "X-Bz-Content-Sha1": crypto.createHash('sha1').update(fileBuffer).digest('hex')
        },
        body: fileBuffer
    })
    jsonData = await response.json();
    return `https://${process.env.BACKBLAZE_S3_PUBLIC_DOMAIN}/${filename}`;
}

