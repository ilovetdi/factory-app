
import React,{useState,useEffect} from "react";
import {useParams} from "react-router-dom";

export default function Machine(){
  const {id}=useParams();
  const [logs,setLogs]=useState([]);
  const [text,setText]=useState("");
  const [file,setFile]=useState(null);

  const load=async()=>{
    const r=await fetch("/api/logs/"+id).then(r=>r.json());
    setLogs(r);
  };

  useEffect(()=>{load();},[]);

  const submit=async()=>{
    let img="";
    if(file){
      const form=new FormData();
      form.append("file",file);
      const up=await fetch("/api/upload",{method:"POST",body:form}).then(r=>r.json());
      img=up.path;
    }
    await fetch("/api/logs",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({machine_id:id,text,image:img})});
    setText(""); setFile(null);
    load();
  };

  return (
    <div style={{padding:20}}>
      <h2>Machine {id}</h2>

      <input style={{width:"100%",padding:15,fontSize:18}} value={text} onChange={e=>setText(e.target.value)} placeholder="Mi történt?"/>
      <input type="file" accept="image/*" capture="environment" onChange={e=>setFile(e.target.files[0])}/>
      {file && <img src={URL.createObjectURL(file)} style={{width:200}}/>}
      <button onClick={submit}>MENTÉS</button>

      {logs.map(l=>(
        <div key={l.id} style={{marginTop:10,border:"1px solid #333",padding:10}}>
          <div>{l.text}</div>
          {l.image && <img src={l.image.startsWith("http") ? l.image : "/api"+l.image} style={{width:150}}/>}
        </div>
      ))}
    </div>
  );
}
