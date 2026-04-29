
import React,{useState,useEffect} from "react";
import {useParams} from "react-router-dom";

export default function Machine(){
 const {id}=useParams();
 const [logs,setLogs]=useState([]);
 const [open,setOpen]=useState(null);
 const [text,setText]=useState("");

 const load=()=>fetch("/api/logs/"+id).then(r=>r.json()).then(setLogs);
 useEffect(load,[]);

 const add=async()=>{
  await fetch("/api/logs",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({machine_id:id,text})});
  setText(""); load();
 };

 return(
  <div style={{padding:20}}>
   <h2>Machine {id}</h2>
   <input value={text} onChange={e=>setText(e.target.value)} placeholder="mi történt?"/>
   <button onClick={add}>MENTÉS</button>

   {logs.map(l=>(
    <div key={l.id} onClick={()=>setOpen(open===l.id?null:l.id)} style={{border:"1px solid #333",margin:10,padding:10}}>
      <div>{l.created_at}</div>
      {open===l.id && <div>{l.text}</div>}
    </div>
   ))}
  </div>
 );
}
