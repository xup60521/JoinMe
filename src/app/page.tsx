import LogIn from "@/component/LogIn";
import Link from "next/link";
import NewEvent from "@/component/NewEvent";
import SearchPage from "@/component/SearchPage";
import { db } from "@/db";
import { attendeeTable, eventTable } from "@/db/schema";
import Card from "@/component/Card";

export default async function Home({searchParams}: {searchParams: {displayName?: string, handle?: string}}) {

  const {displayName, handle} = searchParams;
  const eventList = await db
                          .select()
                          .from(eventTable)
                          .execute()
  const attendees = await db
                          .select()
                          .from(attendeeTable)
                          .execute()

  

  return (
    <>
      {(!displayName || !handle)? <main>
      </main> : 
      <>
        <main>
          <div className="top">
            <span>{`${displayName?? ""}@${handle?? ""}`}</span>
            <div>
              <strong>Join Me</strong>
              <SearchPage eventList={eventList} attendees={attendees} handle={handle} displayName={displayName} />
            </div>
            <div>
              <span><Link href="/">Log out</Link></span>
              <NewEvent userHandle={handle} />
            </div>
          </div>
          <div className="event-list">
            {eventList.map((d)=>{

              const peopleTable = attendees.filter((item)=>item.targetEvent===d.id)
              const peopleCount = peopleTable.length
              const amIhere = peopleTable.map((data)=>{return data.userHandle}).includes(handle)

              return (
                <Card key={d.title} title={d.title} id={d.id} displayName={displayName} handle={handle} amIhere={amIhere} peopleCount={peopleCount} />)
            })}
          </div>
        </main>
      </>}
      <LogIn />
    </>
  )
}
