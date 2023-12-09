'use client'

import Link from "next/link"
import { TiTickOutline } from "react-icons/ti"

function Card({title, id, displayName, handle, amIhere, peopleCount}:
              {title: string, id: number, displayName: string, handle: string, amIhere: boolean, peopleCount: number} ) {

    return (
        <Link key={title} href={{
            pathname: `/event/${id}`,
            query: {
              displayName,
              handle
            }
            }} style={{textDecoration: "none"}}>
            <div className="card">
              <h3>{title}</h3>
              <div>
                <span style={{fontSize: "1.5rem"}}>{(amIhere ? <TiTickOutline /> : "")}</span>
                <p>{`${peopleCount} 人`}</p>
              </div>
            </div>
        </Link>)
}

export default Card