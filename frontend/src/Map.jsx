
import React,{useEffect,useState} from "react";
import {useNavigate} from "react-router-dom";

export default function Map(){
 const [machines,setMachines]=useState([]);
 const [layout,setLayout]=useState("");
 const nav=useNavigate();

 useEffect(()=>{
  fetch("/api/machines").then(r=>r.json()).then(setMachines);
  fetch("/api/layout").then(r=>r.json()).then(d=>setLayout(d.layout));
 },[]);

 return(
  <div style={{position:"relative"}}>
   {layout && <img src={"/api"+layout} style={{width:"100%"}}/>}
   {machines.map(m=>(
    <div key={m.id}
     onClick={()=>nav("/machine/"+m.id)}
     style={{
      position:"absolute",
      left:m.x,top:m.y,
      background:"orange",
      padding:10,
      cursor:"pointer"
     }}>
     ⚙
    </div>
   ))}
  </div>
 );
}
