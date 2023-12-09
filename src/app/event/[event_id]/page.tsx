
import CommentInput from "@/component/CommentInput"
import JoinLeave from "@/component/JoinLeave"
import TimeTable from "@/component/TimeTable"
import { db } from "@/db"
import { attendeeTable, commentTable, eventTable, userTable } from "@/db/schema"
import { eq } from "drizzle-orm"
import Link from "next/link"


const Event = async ({params, searchParams}: {params: {"event_id": number}, searchParams: {displayName: string, handle: string}}) => {
    const eventID = params.event_id
    const {displayName, handle} = searchParams
    const event_detail = (await db
                                .select()
                                .from(eventTable)
                                .where(eq(eventTable.id, eventID))
                                .execute())[0]
    const attendees = await db
                            .select()
                            .from(attendeeTable)
                            .where(eq(attendeeTable.targetEvent, eventID))
                            .execute()
    const commentList = await db
                            .select()
                            .from(commentTable)
                            .where(eq(commentTable.targetEvent, eventID))
                            .orderBy(commentTable.createdAt)
                            .execute()
    const userHandle2Name = (await db
                            .select()
                            .from(userTable)
                            .execute())

    return (
        <main>
            <div className="event">
                <div className="top">
                    <Link style={{all: "unset", cursor: "pointer"}} href={{
                        pathname: "/",
                        query: {
                            displayName,
                            handle
                        }
                    }}>{"<"}</Link>
                    <strong>Join Me</strong>
                    <JoinLeave eventID={eventID} handle={handle} attendees={attendees} />
                </div>
                <div className="eventcontent">
                    <div className="left">
                        <h3>{event_detail.title}</h3>                        
                        <span id="time-notation">開始時間 </span>
                        <span>{`${JSON.parse(event_detail.startedAt)[0]} ${JSON.parse(event_detail.startedAt)[1]}:00`}</span>                                       
                        <span id="time-notation">結束時間 </span>
                        <span>{`${JSON.parse(event_detail.endAt)[0]} ${JSON.parse(event_detail.endAt)[1]}:00`}</span>                    
                    </div>
                    <div className="right">
                        <TimeTable event_detail={event_detail} attendees={attendees} handle={handle} />
                    </div>
                </div>
                <div className="commentsection">
                    <CommentInput eventID={eventID} handle={handle} attendees={attendees} displayName={displayName}/>
                    {commentList.map((item)=>{
                        const displayUserName = userHandle2Name.filter((d)=>d.handle==item.userHandle)[0].displayName
                        return (
                            <div className="commentItem" key={item.id}>
                                <span>{`${displayUserName}@${item.userHandle} ${item.createdAt}`}</span>
                                <div id="commentContent">
                                    {item.content}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </main>
    )
}

export default Event