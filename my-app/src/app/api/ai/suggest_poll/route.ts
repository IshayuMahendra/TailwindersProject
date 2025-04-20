import { NextRequest, NextResponse } from "next/server";

interface AIPoll {
    title: string;
    options: string[];
}

interface GeminiResponse {
    candidates: {
        content: {
            parts: {
                text: string
            }[]
        }
    }[]
}

async function generatePoll(): Promise<AIPoll> {
    let r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [
                {
                    "parts": [{ "text": "Generate a unique poll for university students of the University of Georgia in Athens, GA.  Return a JSON object with the title of the poll as 'title' and  four options as a string array of 'options'.  Only return the JSON object, nothing else." }]
                }
            ],
            generationConfig: { "response_mime_type": "application/json" }
        })
    })
    let jsonData: GeminiResponse = await r.json();
    let generatedPoll: AIPoll = JSON.parse(jsonData.candidates[0].content.parts[0].text);
    return generatedPoll;
}

export async function GET(request: NextRequest) {
    try {
        let generatedPoll = await generatePoll();
        return NextResponse.json(generatedPoll, { status: 200 });
    } catch (e: any) {
        console.log(e);
        return NextResponse.json({ message: e.message }, { status: 500 });
    }
}