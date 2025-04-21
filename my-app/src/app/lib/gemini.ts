"use server";

interface AIPoll {
    title: string;
    options: string[];
}

interface GeminiResponse {
    candidates: {
        finishReason?: string;
        content?: {
            parts: {
                text?: string
                inlineData?: {
                    data: string;
                    mimeType: string;
                }
            }[]
        }
    }[]
}

export async function generatePoll(demographic: string): Promise<AIPoll> {
    console.log("[GEMINI] Generating Poll");
    let r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [
                {
                    "parts": [{ "text": `Generate a unique poll for ${demographic}.  Return a JSON object with the title of the poll as 'title' and  four options as a string array of 'options'.  Only return the JSON object, nothing else.` }]
                }
            ],
            generationConfig: { "response_mime_type": "application/json" }
        })
    })
    let jsonData: GeminiResponse = await r.json();

    if(!jsonData.candidates || !jsonData.candidates[0] || !jsonData.candidates[0].content || !jsonData.candidates[0].content.parts || !jsonData.candidates[0].content.parts[0] || !jsonData.candidates[0].content.parts[0].text) {
        let errorMsg = "unknown error";
        if(jsonData.candidates && jsonData.candidates[0] && jsonData.candidates[0].finishReason) {
            errorMsg = jsonData.candidates[0].finishReason;
        }
        throw new Error(`Error generating content: ${errorMsg}`);
    }

    let generatedPoll: AIPoll = JSON.parse(jsonData.candidates[0].content.parts[0].text);
    return generatedPoll;
}

export async function generateImage(prompt: string): Promise<Buffer> {
    console.log(`[GEMINI] Generating image: ${prompt}`)
    let r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [
                {
                    "parts": [{ "text": prompt }]
                }
            ],
            generationConfig: {"responseModalities":["TEXT", "IMAGE"]}
        })
    })
    let jsonData: GeminiResponse = await r.json();

    if(!jsonData.candidates || !jsonData.candidates[0] || !jsonData.candidates[0].content || !jsonData.candidates[0].content.parts[0] || !jsonData.candidates[0].content.parts[0].inlineData) {
        //Response is not as expected
        let errorMsg = "unknown error";
        if(jsonData.candidates && jsonData.candidates[0] && jsonData.candidates[0].finishReason) {
            errorMsg = jsonData.candidates[0].finishReason;
        }
        throw new Error(errorMsg);
    }
    const generatedImage = Buffer.from(jsonData.candidates[0].content.parts[0].inlineData.data, 'base64')
    return generatedImage;
}