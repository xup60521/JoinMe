'use client'

import axios from "axios";
import { useRouter } from "next/navigation";

type TimeTableParams = {
    event_detail: {
        id: number;
        title: string;
        startedAt: string;
        endAt: string;
    },
    attendees: {
        id: number;
        userHandle: string;
        targetEvent: number;
        spareTime: string ;
    }[],
    handle: string
}

type SpareTimeType = {
    "date": string,
    "hour": number,
}[]

function TimeTable({event_detail, attendees, handle}: TimeTableParams)  {

    const startedDateobj = new Date(JSON.parse(event_detail.startedAt)[0])
    const bufday = startedDateobj
    const endDateobj = new Date(JSON.parse(event_detail.endAt)[0])
    const router = useRouter()
    let datelist = []
    
    const amIhere = attendees.map((item)=>item.userHandle).includes(handle);
    const spareTime:SpareTimeType = (amIhere? JSON.parse((attendees.filter(item=>item.userHandle===handle)[0].spareTime)) : [])
    console.log(spareTime);
    
    
    if ((Number(endDateobj)-Number(startedDateobj))==0) {
        datelist = [startedDateobj.getFullYear() + "-" + (new String(startedDateobj.getMonth()+1)).padStart(2, "0") + "-" + (new String(startedDateobj.getDate())).padStart(2, "0")]
    } else {
        for (let i=0;i<=((Number(endDateobj)-Number(startedDateobj))/(1000*3600*24)+2);i++) {
            datelist.push(bufday.getFullYear() + "-" + (new String(bufday.getMonth()+1)).padStart(2, "0") + "-" + (new String(bufday.getDate())).padStart(2, "0"))
            bufday.setDate(bufday.getDate()+1);
        }
    }


    return (
        <div className="timetable">
            <div className="timeColumn">
                <span id="left">
                    <p id="date">日期\時間</p> 
                </span>
                <span id="right">
                    {Array.from(Array(24)).map((d, i)=>{
                            return <span key={i} className="timeCell notation">{i}</span>
                        })}
                </span>                
            </div>
            {datelist.map((date, i)=>{
                return (
                <div className="timeColumn" key={i}>
                    <span id="left">
                        <p id="date">{date}</p>
                    </span>
                    <span id="right">
                        {Array.from(Array(24)).map((zero, hour)=>{
                            
                            let howManyPeople = 0;
                            attendees.forEach((item)=>{
                                const sp:SpareTimeType = JSON.parse(item.spareTime)
                                sp.forEach(e=>{
                                    if (e.date===date&&e.hour===hour) {
                                        howManyPeople++
                                    }
                                })
                            })
                            
                            
                            let bgNotation = "p5";
                            if (howManyPeople==1) {
                                bgNotation = "p1"
                            } else if (howManyPeople==0) {
                                bgNotation = ""
                            } else if (howManyPeople==2) {
                                bgNotation = "p2"
                            } else if (howManyPeople==3) {
                                bgNotation = "p3"
                            } else if (howManyPeople==4) {
                                bgNotation = "p4"
                            } 
                            console.log(bgNotation);
                            
                            let includetime = false;
                            spareTime.forEach((item)=>{
                                if (item.date==date && item.hour==hour) {
                                    includetime = true
                                }
                            })
                            const handeClick = async () => {
                                if (!amIhere) {
                                    return;
                                };
                                const attendID = attendees.filter(item=>item.userHandle===handle)[0].id
                                if (includetime) {
                                    
                                    const bufSpareTime = spareTime.map((item)=>{
                                        if (item.date==date&&item.hour==hour) {
                                            return ;
                                        } else {
                                            return item
                                        }
                                    }).filter(a=>a)
                                    axios.delete(`/api/attend/${attendID}`).then(()=>{
                                        axios.post(`/api/attend`, {
                                            "userHandle": handle,
                                            "targetEvent": event_detail.id,
                                            "spareTime": JSON.stringify([...bufSpareTime]),
                                        }).then(()=>router.refresh()).catch(error=>alert(error))
                                    }).catch(error=>alert(error))
                                    
                                } else if (!includetime) {
                                    console.log("ok");
                                    
                                    
                                    axios.delete(`/api/attend/${attendID}`).then(()=>{
                                        axios.post(`/api/attend`, {
                                            "userHandle": handle,
                                            "targetEvent": event_detail.id,
                                            "spareTime": JSON.stringify([...spareTime, {date, hour}]),
                                        }).then(()=>router.refresh()).catch(error=>alert(error))
                                    }).catch(error=>alert(error))
                                }
                                
                            }
                            if ((date==JSON.parse(event_detail.startedAt)[0] && hour <  JSON.parse(event_detail.startedAt)[1])||(date==JSON.parse(event_detail.endAt)[0] && hour >=  JSON.parse(event_detail.endAt)[1])) {
                                return <span key={i+hour} className="timeCell disable">{"  d  "}</span>
                            } else {
                                return <span key={i+hour} className={`timeCell ${(includetime? "selected" : " ")} ${bgNotation}`} onClick={handeClick}>{hour}</span>
                            }
                        })}
                        
                    </span>
                    
                </div>)
            })}     
                <div className="legend">
                    <span>{"0/5"}</span>    
                    {Array.from(Array(5)).map((d,i)=>{
                        return <span className={`timeCell p${i+1}`} key={`p${i+1}`} >{`//${i+1}//`}</span>
                    })}
                    <span>{"5/5"}</span>
                    <span>Out of range</span>
                    <span className="timeCell disable">
                        disable
                    </span>
                </div>       
        </div>
    )
}

export default TimeTable;