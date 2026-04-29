
import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";

export default function App() {
  const [machines, setMachines] = useState([]);

  useEffect(()=>{
    fetch("/api/machines")
      .then(r=>r.json())
      .then(setMachines);
  },[]);

  const add = async ()=>{
    const m = {name:"Machine",x:100,y:100,status:"green"};
    await fetch("/api/machines",{method:"POST",headers:{'Content-Type':'application/json'},body:JSON.stringify(m)});
    location.reload();
  };

  const update = async (id,x,y)=>{
    await fetch("/api/machines/"+id,{method:"PUT",headers:{'Content-Type':'application/json'},body:JSON.stringify({x,y})});
  };

  return (
    <div style={{padding:20}}>
      <h1>🏭 Industrial Panel</h1>
      <button onClick={add}>+ Machine</button>

      <div style={{position:"relative",height:"80vh",border:"1px solid #ccc"}}>
        {machines.map(m=>(
          <Draggable
            key={m.id}
            defaultPosition={{x:m.x,y:m.y}}
            onStop={(e,data)=>update(m.id,data.x,data.y)}
          >
            <div style={{
              position:"absolute",
              width:80,
              height:50,
              background:"green",
              color:"white",
              display:"flex",
              alignItems:"center",
              justifyContent:"center"
            }}>
              {m.name}
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
}
