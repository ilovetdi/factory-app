
import React,{useState,useEffect} from "react";

export default function Settings(){
  const [url,setUrl]=useState("");

  useEffect(()=>{
    fetch("/api/settings").then(r=>r.json()).then(d=>setUrl(d.external_url||""));
  },[]);

  const save=async()=>{
    await fetch("/api/settings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({external_url:url})});
    alert("saved");
  };

  return (
    <div style={{padding:20}}>
      <h2>Storage URL</h2>
      <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="http://nas/images"/>
      <button onClick={save}>Save</button>
    </div>
  );
}
