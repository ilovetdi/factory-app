import React,{useState} from "react";

export default function App(){
 const [logged,setLogged]=useState(false);

 if(!logged){
  return (
   <div style={{padding:20}}>
    <h2>Login</h2>
    <button onClick={()=>setLogged(true)}>Belépés</button>
   </div>
  );
 }

 return <div style={{padding:20}}>APP OK ✔</div>;
}
