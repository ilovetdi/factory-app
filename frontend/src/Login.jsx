
import React,{useState} from "react";
import {useNavigate} from "react-router-dom";

export default function Login(){
  const [u,setU]=useState("");
  const [p,setP]=useState("");
  const nav=useNavigate();

  const login=async()=>{
    const r=await fetch("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:u,password:p})});
    if(r.ok){
      localStorage.setItem("user",JSON.stringify(await r.json()));
      nav("/machine/1");
    } else alert("hiba");
  };

  return (
    <div style={{padding:20}}>
      <input placeholder="user" onChange={e=>setU(e.target.value)}/>
      <input type="password" placeholder="pass" onChange={e=>setP(e.target.value)}/>
      <button onClick={login}>Login</button>
    </div>
  );
}
