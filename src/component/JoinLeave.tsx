'use client'

import axios from "axios";
import { useRouter } from "next/navigation";

function JoinLeave({eventID, handle, attendees}: 
    {eventID: number, handle: string,
    attendees: {
        id: number;
        userHandle: string;
        targetEvent: number;
        spareTime: string;
    }[]}) {

    const router = useRouter()
    const handleLeave = async () => {
        const attendID = attendees.filter((item)=>item.userHandle==handle)[0].id
        axios.delete(`/api/attend/${attendID}`).then(()=>router.refresh()).catch(error=>alert(error))
    }
    const handleJoin = async () => {
        axios.post("/api/attend", {
            "userHandle": handle,
            "targetEvent": eventID,
            "spareTime": "[]",
        }).then(()=>router.refresh())
        .catch(error=>alert(error));
    }

    return <>
        {(attendees.map((d)=>d.userHandle).includes(handle) ? <button onClick={handleLeave} >Leave</button> : <button onClick={handleJoin}>Join!</button>)}
    </>
}

export default JoinLeave