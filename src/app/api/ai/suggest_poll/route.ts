import { generatePoll } from "@/app/lib/gemini";
import { NextRequest, NextResponse } from "next/server";
// const targetDemographics = [
//     "university students of the University of Georgia in Athens, GA",
//     "american college students",
//     "students",
//     "Athens, GA, USA residents"
// ]

const targetDemographics = ["tired students in an 8AM web programming class at the university of georgia", "students watching a product demo for an anonymous university poll service named Pollster"]

//GET /api/api/suggest_poll
export async function GET(request: NextRequest) {
    try {
        const randomIndex = Math.floor(Math.random() * targetDemographics.length);
        let randomDemographic = targetDemographics[randomIndex];
        let generatedPoll = await generatePoll(randomDemographic);
        return NextResponse.json(generatedPoll, { status: 200 });
    } catch (e: any) {
        console.log(e);
        return NextResponse.json({ message: e.message }, { status: 500 });
    }
}