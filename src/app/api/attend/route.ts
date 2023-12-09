import { NextResponse, type NextRequest } from "next/server";
import {db} from "@/db"
import { attendeeTable } from "@/db/schema";

export async function POST(request: NextRequest) {
    const data = await request.json()

    try {
        await db
            .insert(attendeeTable)
            .values(data)
            .execute()
    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
        )
    }
    return new NextResponse("OK", { status: 200 });
}   

