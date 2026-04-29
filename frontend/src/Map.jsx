
import React,{useEffect,useState} from "react";

export default function Map({token}){
 const [layout,setLayout]=useState("");
 const [machines,setMachines]=useState([]);
 const headers={Authorization:token};

 useEffect(()=>{
  fetch("/api/layout",{headers}).then(r=>r.json()).then(d=>setLayout(d.layout));
  fetch("/api/machines",{headers}).then(r=>r.json()).then(setMachines);
 },[]);

 const addMachine=async(e)=>{
  const name=prompt("Gép neve?");
  if(!name) return;

  const rect=e.target.getBoundingClientRect();
  const x=e.clientX-rect.left;
  const y=e.clientY-rect.top;

  await fetch("/api/machines",{
    method:"POST",
    headers:{...headers,"Content-Type":"application/json"},
    body:JSON.stringify({name,x,y})
  });

  location.reload();
 };

 return(
  <div>
   {layout ? (
    <div style={{position:"relative"}} onClick={addMachine}>
     <img src={"/api"+layout} style={{width:"100%"}}/>
     {machines.map(m=>(
      <div key={m.id} style={{
        position:"absolute",
        left:m.x,
        top:m.y,
        background:"orange",
        padding:5
      }}>
        ⚙
      </div>
     ))}
    </div>
   ):<div style={{padding:40}}>Nincs layout</div>}
  </div>
 );
}
