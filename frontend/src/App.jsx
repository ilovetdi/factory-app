
import React from "react";
import {Routes,Route} from "react-router-dom";
import Login from "./Login";
import Machine from "./Machine";
import Admin from "./Admin";

export default function App(){
  return (
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/machine/:id" element={<Machine/>}/>
      <Route path="/admin" element={<Admin/>}/>
    </Routes>
  );
}
