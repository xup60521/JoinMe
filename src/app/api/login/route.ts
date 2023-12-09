import { NextResponse, type NextRequest } from "next/server";
import {z} from "zod"
import {db} from "@/db"
import { userTable } from "@/db/schema";

const postUserSchema = z.object({
    displayName: z.string().min(1).max(50),
    handle: z.string().min(1).max(50)
})

export async function POST(request: NextRequest) {

    const data = await request.json()
    try {
        postUserSchema.parse(data);
    } catch(error) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    
    
    try {
        await db
            .insert(userTable)
            .values(data)
            .onConflictDoUpdate({
                target: userTable.handle,
                set: {displayName: data.displayName,},
            })
            .execute();
    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
        )
    }
    return new NextResponse("OK", { status: 200 });
}
