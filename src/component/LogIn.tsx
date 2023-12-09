'use client'

import axios from "axios"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

function LogIn() {

    const [open, setOpen] = useState(true)
    const [loading, setLoading] = useState(true);
    const nameRef = useRef<HTMLInputElement>(null)
    const handleRef = useRef<HTMLInputElement>(null)
    const searchParams = useSearchParams()
    const router = useRouter()
    const path = usePathname()

    const handleEnter = async () => {
        if (!nameRef.current?.value || !handleRef.current?.value) {
            return;
        } 
 
        const params = new URLSearchParams(searchParams)
        params.set("displayName", nameRef.current!.value)
        params.set("handle", handleRef.current!.value)
        router.push(`${path}?${params.toString()}`);
        axios.post("/api/login", {
            "displayName": nameRef.current.value,
            "handle": handleRef.current.value
        }).then(()=>{setOpen(false)})
        .catch(error => alert(error))
        
    }

    useEffect(()=>{
        if (!searchParams.get("displayName") || !searchParams.get("handle")) {
            setOpen(true)
        } else {
            setOpen(false)
        }
        setLoading(false);
    }, [searchParams])

    return (
        <>
            {!loading ? <>
                <div className={`login`} style={{display: `${open? "flex":"none"}`}}>
                    <p>Name</p>
                    <input type="text" ref={nameRef} />
                    <p>Handle</p>
                    <input type="text" ref={handleRef} />
                    <button onClick={handleEnter}>Enter</button>
                </div>
            </> : ""}
        </>
    )
}

export default LogIn