
import React,{useState} from "react";
import Login from "./Login";
import Map from "./Map";
import Admin from "./Admin";

export default function App(){
 const [token,setToken]=useState(localStorage.getItem("token"));
 if(!token) return <Login setToken={setToken}/>;

 if(window.location.pathname==="/admin")
  return <Admin token={token}/>;

 return <Map token={token}/>;
}
