
import React,{useState} from "react";
import {useNavigate} from "react-router-dom";

export default function Login(){
  const [u,setU]=useState("");
  const [p,setP]=useState("");
  const nav=useNavigate();

  const login=async()=>{
    const r=await fetch("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:u,password:p})});
    if(r.ok) nav("/panel");
    else alert("hiba");
  };

  return (
    <div style={{display:"flex",height:"100vh",justifyContent:"center",alignItems:"center"}}>
      <div>
        <h2>Login</h2>
        <input placeholder="user" onChange={e=>setU(e.target.value)}/><br/>
        <input placeholder="pass" type="password" onChange={e=>setP(e.target.value)}/><br/>
        <button onClick={login}>Login</button>
      </div>
    </div>
  );
}
