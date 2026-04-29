
import React,{useState} from "react";

export default function Admin(){
 const [file,setFile]=useState(null);

 const upload=async()=>{
  const f=new FormData();
  f.append("file",file);
  await fetch("/api/layout",{method:"POST",body:f});
  alert("feltöltve");
 };

 const addMachine=async(e)=>{
  e.preventDefault();
  const data=new FormData(e.target);
  await fetch("/api/machines",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
   name:data.get("name"),
   x:Number(data.get("x")),
   y:Number(data.get("y"))
  })});
  alert("gép hozzáadva");
 };

 return(
  <div style={{padding:20}}>
   <h2>Admin</h2>

   <h3>Layout feltöltés</h3>
   <input type="file" onChange={e=>setFile(e.target.files[0])}/>
   <button onClick={upload}>Upload</button>

   <h3>Gép hozzáadás</h3>
   <form onSubmit={addMachine}>
    <input name="name" placeholder="név"/>
    <input name="x" placeholder="x"/>
    <input name="y" placeholder="y"/>
    <button>Add</button>
   </form>
  </div>
 );
}
