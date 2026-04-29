
import React from "react";
import {Routes,Route} from "react-router-dom";
import Login from "./Login";
import Machine from "./Machine";
import Settings from "./Settings";

export default function App(){
  return (
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/machine/:id" element={<Machine/>}/>
      <Route path="/settings" element={<Settings/>}/>
    </Routes>
  );
}
