
import React,{useEffect,useState} from "react";

export default function Admin(){
  const [users,setUsers]=useState([]);
  const [u,setU]=useState("");
  const [p,setP]=useState("");
  const [role,setRole]=useState("user");

  const load=async()=>{
    const r=await fetch("/api/users").then(r=>r.json());
    setUsers(r);
  };

  useEffect(()=>{load();},[]);

  const add=async()=>{
    await fetch("/api/users",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:u,password:p,role})});
    load();
  };

  return (
    <div style={{padding:20}}>
      <h2>Admin Panel</h2>

      <input placeholder="user" onChange={e=>setU(e.target.value)}/>
      <input placeholder="pass" onChange={e=>setP(e.target.value)}/>
      <select onChange={e=>setRole(e.target.value)}>
        <option value="user">user</option>
        <option value="admin">admin</option>
      </select>
      <button onClick={add}>Add</button>

      {users.map(u=>(
        <div key={u.id}>{u.username} ({u.role})</div>
      ))}
    </div>
  );
}
