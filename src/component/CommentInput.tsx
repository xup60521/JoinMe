'use client'

import axios from "axios";
import { useRouter } from "next/navigation";
import { useRef } from "react";

function CommentInput({eventID, displayName, handle, attendees}: 
    {eventID: number,displayName: string ,handle: string, 
    attendees: {
        id: number;
        userHandle: string;
        targetEvent: number;
        spareTime: string | null;
    }[]})  {
    
    const inputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    const allowComment = (attendees.map((d)=>d.userHandle).includes(handle)) ? true : false;
    const handlePostComment = async () => {
        if (!inputRef.current?.value) {
            return;
        }
        axios.post("/api/comment", {
            "userHandle": handle,
            "content": inputRef.current.value,
            "targetEvent": eventID,
        }).then(()=>{router.refresh(); inputRef.current?.value==""}).catch(error=>alert(error))
    }

    return (
        <div className={`inputcomment`}>
            {(allowComment ? 
            <>
                <span>{`${displayName}@${handle}`}</span>
                <input type="text" id="inputcomment" ref={inputRef} />
                <button onClick={handlePostComment}>Post</button>
            </>: 
                <span>參加以留言</span>)}
        </div>        
    )
}

export default CommentInput