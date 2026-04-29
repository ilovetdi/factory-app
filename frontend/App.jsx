import React, { useState } from "react";
import Draggable from "react-draggable";

export default function App() {
  const [machines, setMachines] = useState([]);

  const addMachine = () => {
    setMachines([...machines, { id: Date.now(), x: 100, y: 100 }]);
  };

  return (
    <div>
      <h1>Factory Dashboard</h1>
      <button onClick={addMachine}>+ Gép</button>

      {machines.map(m => (
        <Draggable key={m.id} defaultPosition={{x: m.x, y: m.y}}>
          <div style={{
            width: 50,
            height: 50,
            background: "orange",
            position: "absolute",
            cursor: "move"
          }}>
            ⚙
          </div>
        </Draggable>
      ))}
    </div>
  );
}
