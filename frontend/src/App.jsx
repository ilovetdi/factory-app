import React,{useState} from "react";
import Login from "./Login";
import Map from "./Map";

export default function App(){
  const [token,setToken]=useState(localStorage.getItem("token"));

  try {
    if(!token) return <Login setToken={setToken}/>;
    return <Map token={token}/>;
  } catch(e){
    console.error("APP CRASH:", e);
    return <div style={{padding:20}}>Hiba történt</div>;
  }
}