import React, { useState } from "react";
import Draggable from "react-draggable";

export default function App() {
  const [machines, setMachines] = useState([]);

  const addMachine = () => {
    setMachines([
      ...machines,
      { id: Date.now(), x: 100, y: 100 }
    ]);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🏭 Factory Panel</h1>

      <button onClick={addMachine}>
        + Machine
      </button>

      <div style={{ position: "relative", width: "100%", height: "80vh", border: "1px solid #ccc" }}>
        {machines.map(m => (
          <Draggable key={m.id} defaultPosition={{ x: m.x, y: m.y }}>
            <div
              style={{
                width: 50,
                height: 50,
                background: "orange",
                position: "absolute",
                cursor: "move",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              ⚙
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
}