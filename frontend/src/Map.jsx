
import React,{useEffect,useState} from "react";
import Draggable from "react-draggable";

export default function Map({token}){
 const [machines,setMachines]=useState([]);
 const [layout,setLayout]=useState("");

 const headers={Authorization:token};

 const load=()=>{
  fetch("/api/machines",{headers}).then(r=>r.json()).then(setMachines);
  fetch("/api/layout",{headers}).then(r=>r.json()).then(d=>setLayout(d.layout));
 };

 useEffect(load,[]);

 const isMobile=window.innerWidth<768;

 if(isMobile){
  return(
    <div style={{padding:20}}>
      {machines.map(m=><div key={m.id} style={{padding:15,border:"1px solid #333",marginBottom:10}}>{m.name}</div>)}
    </div>
  );
 }

 return(
  <div style={{position:"relative"}}>
    {layout && <img src={"/api"+layout} style={{width:"100%"}}/>}
    {machines.map(m=>(
      <Draggable key={m.id} defaultPosition={{x:m.x,y:m.y}}>
        <div style={{position:"absolute",background:"#ff9800",padding:10}}>⚙</div>
      </Draggable>
    ))}
  </div>
 );
}
