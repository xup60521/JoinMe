import { NextResponse, type NextRequest } from "next/server";
import {z} from "zod"
import {db} from "@/db"
import { attendeeTable, eventTable } from "@/db/schema";
import { and, eq, } from "drizzle-orm";

const postEventSchema = z.object({
    userHandle: z.string().min(1).max(50),
    title: z.string().min(1).max(50),
    startedAt: z.string().min(1).max(50),
    endAt: z.string().min(1).max(50),
})

export async function POST(request: NextRequest) {

    const data = await request.json()
    try {
        postEventSchema.parse(data);
    } catch(error) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    
    const {title, startedAt, endAt} = data as z.infer<typeof postEventSchema>
    try {
        await db
        .insert(eventTable)
        .values(
            {title, startedAt, endAt}
        )
        .execute()
        const {eventID} = (await db
                            .select({eventID: eventTable.id})
                            .from(eventTable)
                            .where(and(
                                and(
                                    eq(eventTable.title, title),
                                    eq(eventTable.startedAt, startedAt),
                                ),
                                eq(eventTable.endAt, endAt)
                            ))
                            .execute())[0]
        await db
            .insert(attendeeTable)
            .values({
                "userHandle": data.userHandle,
                "targetEvent": eventID,
                "spareTime": "[]",
            })
            .execute()

    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
        )
    }
    return new NextResponse("OK", { status: 200 });
}
