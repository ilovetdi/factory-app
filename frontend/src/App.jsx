
import React from "react";
import {Routes,Route} from "react-router-dom";
import Dashboard from "./Dashboard";
import Machine from "./Machine";
import Login from "./Login";

export default function App(){
  return (
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/panel" element={<Dashboard/>}/>
      <Route path="/machine/:id" element={<Machine/>}/>
    </Routes>
  );
}
