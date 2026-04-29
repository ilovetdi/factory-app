
import React,{useEffect,useState} from "react";
import {useParams,useNavigate} from "react-router-dom";

export default function Machine(){
  const {id}=useParams();
  const [logs,setLogs]=useState([]);
  const [text,setText]=useState("");
  const nav=useNavigate();

  const load=async()=>{
    const l=await fetch("/api/logs/"+id).then(r=>r.json());
    setLogs(l);
  };

  useEffect(()=>{load();},[]);

  const add=async()=>{
    await fetch("/api/logs",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({machine_id:id,text})});
    setText("");
    load();
  };

  return (
    <div style={{padding:20}}>
      <button onClick={()=>nav("/panel")}>← vissza</button>
      <h2>Machine #{id}</h2>

      <input value={text} onChange={e=>setText(e.target.value)}/>
      <button onClick={add}>Add log</button>

      {logs.map(l=>(
        <div key={l.id} style={{border:"1px solid #444",marginTop:10,padding:10}}>
          {l.text}
        </div>
      ))}
    </div>
  );
}
