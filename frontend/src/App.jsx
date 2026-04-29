import React,{useState,useEffect} from "react";

export default function App(){
 const [token,setToken]=useState(localStorage.getItem("token"));
 const [machines,setMachines]=useState([]);
 const [layout,setLayout]=useState("");

 const headers={Authorization:token};

 if(!token){
  return <button onClick={()=>{localStorage.setItem("token","ok");setToken("ok");}}>LOGIN</button>;
 }

 useEffect(()=>{
  fetch("/api/machines",{headers}).then(r=>r.json()).then(setMachines);
  fetch("/api/layout",{headers}).then(r=>r.json()).then(d=>setLayout(d.layout));
 },[]);

 const add=async(e)=>{
  const name=prompt("név");
  if(!name)return;
  const rect=e.target.getBoundingClientRect();
  const x=e.clientX-rect.left;
  const y=e.clientY-rect.top;
  await fetch("/api/machines",{method:"POST",headers:{...headers,"Content-Type":"application/json"},body:JSON.stringify({name,x,y})});
  location.reload();
 };

 return(
  <div>
    {layout && <div style={{position:"relative"}} onClick={add}>
      <img src={"/api"+layout} style={{width:"100%"}}/>
      {machines.map(m=><div key={m.id} style={{position:"absolute",left:m.x,top:m.y,background:"orange",padding:5}}>⚙</div>)}
    </div>}
  </div>
 );
}
