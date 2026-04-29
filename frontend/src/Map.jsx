
import React,{useEffect,useState} from "react";
import Draggable from "react-draggable";

export default function Map({token}){
 const [machines,setMachines]=useState([]);
 const [layout,setLayout]=useState("");
 const headers={Authorization:token};

 useEffect(()=>{
  fetch("/api/machines",{headers}).then(r=>r.json()).then(setMachines);
  fetch("/api/layout",{headers}).then(r=>r.json()).then(d=>setLayout(d.layout));
 },[]);

 return(
  <div style={{position:"relative"}}>
    {layout ? <img src={"/api"+layout} style={{width:"100%"}}/> :
      <div style={{padding:40}}>Nincs layout (/admin)</div>
    }

    {machines.map(m=>(
      <Draggable key={m.id} defaultPosition={{x:m.x,y:m.y}}>
        <div style={{position:"absolute",background:"orange",padding:10}}>⚙</div>
      </Draggable>
    ))}
  </div>
 );
}
