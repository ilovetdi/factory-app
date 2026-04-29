
import React, {useEffect,useState} from "react";
import Draggable from "react-draggable";

export default function App(){
  const [machines,setMachines]=useState([]);

  useEffect(()=>{
    fetch("http://localhost:3000/machines")
    .then(r=>r.json())
    .then(setMachines);
  },[]);

  const add=()=>{
    const m={name:"Machine "+(machines.length+1),x:100,y:100};
    fetch("http://localhost:3000/machines",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(m)
    }).then(()=>window.location.reload());
  };

  return(
    <div style={{padding:20}}>
      <h1>🏭 Industrial Panel</h1>
      <button onClick={add}>+ Machine</button>

      <div style={{
        position:"relative",
        height:"80vh",
        border:"2px solid #333",
        marginTop:20
      }}>
        {machines.map(m=>(
          <Draggable key={m.id} defaultPosition={{x:m.x,y:m.y}}>
            <div style={{
              width:80,
              height:50,
              background:"green",
              color:"#fff",
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              position:"absolute"
            }}>
              {m.name}
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
}
