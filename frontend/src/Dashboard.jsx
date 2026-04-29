
import React,{useEffect,useState} from "react";
import Draggable from "react-draggable";
import {useNavigate} from "react-router-dom";

export default function Dashboard(){
  const [machines,setMachines]=useState([]);
  const nav=useNavigate();

  const load=async()=>{
    const r=await fetch("/api/machines").then(r=>r.json());
    setMachines(r);
  };

  useEffect(()=>{load();},[]);

  const add=async()=>{
    await fetch("/api/machines",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:"Machine",x:100,y:100})});
    load();
  };

  const update=async(id,x,y)=>{
    await fetch("/api/machines/"+id,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({x,y})});
  };

  return (
    <div style={{padding:20}}>
      <h1>🏭 Industrial Panel</h1>
      <button onClick={add}>+ Machine</button>

      <div style={{position:"relative",height:"80vh",border:"1px solid #555",marginTop:20}}>
        {machines.map(m=>(
          <Draggable key={m.id} defaultPosition={{x:m.x,y:m.y}} onStop={(e,d)=>update(m.id,d.x,d.y)}>
            <div
              onClick={()=>nav("/machine/"+m.id)}
              title={`ID:${m.id}`}
              style={{width:100,height:60,background:"#0a0",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
              {m.name}
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
}
