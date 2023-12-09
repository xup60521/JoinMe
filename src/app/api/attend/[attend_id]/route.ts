import { db } from "@/db";
import { attendeeTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import type {NextRequest} from "next/server";

type Context = {
    params: {
        attend_id: number
    }
}

export async function DELETE(_request: NextRequest, context: Context) {
    
    try {
        await db
        .delete(attendeeTable)
        .where(eq(attendeeTable.id, context.params.attend_id))
        .execute()
            
    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 },
        )
    }
    return new NextResponse("OK", { status: 200 });
}