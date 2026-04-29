
import React,{useState} from "react";
import Login from "./Login";
import Map from "./Map";

export default function App(){
 const [token,setToken]=useState(localStorage.getItem("token"));

 if(!token) return <Login setToken={setToken}/>;

 return <Map token={token}/>;
}
