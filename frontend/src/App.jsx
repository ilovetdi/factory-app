
import React,{useEffect,useState} from "react";

export default function App(){
 const [logs,setLogs]=useState([]);
 const [text,setText]=useState("");
 const [file,setFile]=useState(null);

 const username="admin";

 const load=()=>fetch("/api/logs/1").then(r=>r.json()).then(setLogs);
 useEffect(load,[]);

 const add=async()=>{
  let img="";
  if(file){
    const f=new FormData();
    f.append("file",file);
    const up=await fetch("/api/upload",{method:"POST",body:f}).then(r=>r.json());
    img=up.path;
  }
  await fetch("/api/logs",{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({machine_id:1,text,image:img,username})});
  setText(""); setFile(null); load();
 };

 const del=id=>{
  fetch("/api/logs/"+id,{method:"DELETE"}).then(load);
 };

 const edit=id=>{
  const t=prompt("új szöveg:");
  if(t) fetch("/api/logs/"+id,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:t})}).then(load);
 };

 return(
  <div style={{padding:20}}>
    <h2>Log rendszer</h2>

    <input value={text} onChange={e=>setText(e.target.value)} placeholder="mi történt?" style={{width:"100%",padding:15}}/>
    <input type="file" accept="image/*" capture="environment" onChange={e=>setFile(e.target.files[0])}/>
    {file && <img src={URL.createObjectURL(file)} style={{width:150}}/>}
    <button onClick={add}>MENTÉS</button>

    {logs.map(l=>(
      <div key={l.id} style={{border:"1px solid #333",marginTop:10,padding:10}}>
        <div>{new Date(l.created_at).toLocaleString()}</div>
        <div>👤 {l.username}</div>
        <div>{l.text}</div>
        {l.image && <img src={"/api"+l.image} style={{width:150}}/>}
        <button onClick={()=>edit(l.id)}>✏️</button>
        <button onClick={()=>del(l.id)}>🗑️</button>
      </div>
    ))}
  </div>
 );
}
