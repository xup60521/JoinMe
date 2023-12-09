'use client'

import { useEffect, useRef, useState } from "react"
import Popup from "reactjs-popup"
import Card from "./Card";

function SearchPage({eventList, attendees, handle, displayName}: {eventList: {
        title: string;
        id: number;
        startedAt: string;
        endAt: string;
    }[], attendees: {
        id: number;
        userHandle: string;
        targetEvent: number;
        spareTime: string | null;
    }[], handle: string, displayName: string}) {

    const [open, setOpen] = useState(false)
    const searchRef = useRef<HTMLInputElement>(null)
    const [search, setSearch] = useState("")

    useEffect(()=>{
        searchRef.current?.focus()
        setSearch("")
    }, [open])

    return (
    <>
        <input type="text" className="search" placeholder="🔍 Search" onClick={()=>setOpen(true)} value="" />
        <Popup open={open} closeOnDocumentClick onClose={()=>setOpen(false)}>
            <div className="search-popup">
                <input type="text" ref={searchRef} value={search} onChange={(e)=>setSearch(e.target.value)} />
                <div className="searchResult">
                {eventList.filter(item=>item.title.includes(search)).map((d)=>{
                    const peopleTable = attendees.filter((item)=>item.targetEvent===d.id)
                    const peopleCount = peopleTable.length
                    const amIhere = peopleTable.map((data)=>{return data.userHandle}).includes(handle)
      
                    return (
                      <Card key={d.title} title={d.title} id={d.id} displayName={displayName} handle={handle} amIhere={amIhere} peopleCount={peopleCount} />)
                })}
                </div>
            </div>
            
        </Popup>
    </>)
}

export default SearchPage