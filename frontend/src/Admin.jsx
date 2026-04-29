
import React,{useState} from "react";

export default function Admin({token}){
 const [file,setFile]=useState(null);
 const upload=async()=>{
  const f=new FormData();
  f.append("file",file);
  await fetch("/api/layout",{method:"POST",headers:{Authorization:token},body:f});
  alert("feltöltve");
 };
 return(
  <div style={{padding:20}}>
   <h2>Layout feltöltés</h2>
   <input type="file" onChange={e=>setFile(e.target.files[0])}/>
   <button onClick={upload}>Feltöltés</button>
  </div>
 );
}
