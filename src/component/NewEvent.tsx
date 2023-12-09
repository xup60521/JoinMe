'use client'

import axios from "axios";
import { useRef, useState } from "react";
import Popup from "reactjs-popup";
import { useRouter } from "next/navigation";

function NewEvent({userHandle}:{userHandle: string}) {

    const [open, setOpen] = useState(false)
    const router = useRouter()
    const titleRef = useRef<HTMLInputElement>(null)
    const fromDateRef = useRef<HTMLInputElement>(null)
    const fromTimeRef = useRef<HTMLSelectElement>(null)
    const toDateRef = useRef<HTMLInputElement>(null)
    const toTimeRef = useRef<HTMLSelectElement>(null)

    const handleNewEvent = async () => {
        const title = titleRef.current?.value
        const fromDate = fromDateRef.current?.value
        const fromTime = fromTimeRef.current?.value
        const toDate = toDateRef.current?.value
        const toTime = toTimeRef.current?.value

        if (!title || !fromDate || !fromTime || !toDate || !toTime) {
            return;
        } else if ((Number(new Date(toDate)) - Number(new Date(fromDate)))/ (1000*3600*24) >= 7) {
            alert("請將範圍限制在7天內")
            return;
        } else if ((Number(new Date(toDate)) - Number(new Date(fromDate)))/ (1000*3600*24)<0) {
            alert("Invalid Time")
            return;
        } else if (((Number(new Date(toDate)) - Number(new Date(fromDate)))/ (1000*3600*24)===0) && Number(fromTime) > Number(toTime)) {
            alert("Invalid Time")
            return;
        }
        const startedAt = JSON.stringify([fromDate, fromTime])
        const endAt = JSON.stringify([toDate, toTime])
        axios.post("/api/event", {
            userHandle,
            title,
            startedAt,
            endAt
        }).then(()=>{
            alert("Success")
            setOpen(false)
            router.refresh()
        }).catch(error=>alert(error))
        
    }

    return (
        <>
            <button onClick={()=>setOpen(true)}>New Event</button>
            <Popup open={open} closeOnDocumentClick onClose={()=>{setOpen(false)}}>
                <div className="newevent">
                    <button className="close" onClick={()=>setOpen(false)}>X</button>
                    <div>
                        <p>Title</p>
                        <input type="text" ref={titleRef} />
                    </div>
                    <div>
                        <p>From</p>
                        <input type="date" ref={fromDateRef} />
                        <select ref={fromTimeRef} defaultValue={8} >
                            {Array.from(Array(24).keys()).map((d, i)=>{
                                return <option value={i} key={i}>{i}</option>
                            })}
                        </select>
                    </div>
                    <div>
                        <p>To</p>
                        <input type="date" ref={toDateRef} />
                        <select ref={toTimeRef} defaultValue={16} >
                            {Array.from(Array(24).keys()).map((d, i)=>{
                                return <option value={i} key={i}>{i}</option>
                            })}
                        </select>
                    </div>
                    <button className="new-event" onClick={handleNewEvent}>New Event</button>
                </div>
            </Popup>
        </>
    )
}

export default NewEvent;