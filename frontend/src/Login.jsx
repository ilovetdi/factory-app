
import React,{useState} from "react";

export default function Login({setToken}){
 const [u,setU]=useState("");
 const [p,setP]=useState("");

 const login=async()=>{
  const r=await fetch("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:u,password:p})});
  if(r.ok){
    const d=await r.json();
    localStorage.setItem("token",d.token);
    setToken(d.token);
  } else alert("hiba");
 };

 return(
  <div style={{padding:20}}>
    <h2>Bejelentkezés</h2>
    <input placeholder="user" onChange={e=>setU(e.target.value)}/>
    <input type="password" placeholder="pass" onChange={e=>setP(e.target.value)}/>
    <button onClick={login}>Login</button>
  </div>
 );
}
