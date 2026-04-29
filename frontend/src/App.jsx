
import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";

export default function App() {
  const [machines, setMachines] = useState([]);
  const [layout, setLayout] = useState(null);

  const load = async () => {
    const m = await fetch("/api/machines").then(r => r.json());
    setMachines(m);

    const l = await fetch("/api/layout").then(r => r.json());
    setLayout(l.image);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    await fetch("/api/machines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Machine", x: 100, y: 100 })
    });
    load();
  };

  const update = async (id, x, y) => {
    await fetch("/api/machines/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x, y })
    });
  };

  const upload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async () => {
      await fetch("/api/layout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: reader.result })
      });
      load();
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🏭 Industrial Panel</h1>

      <button onClick={add}>+ Machine</button>
      <input type="file" onChange={upload} />

      <div style={{
        position: "relative",
        height: "80vh",
        border: "2px solid #ccc",
        marginTop: 20,
        backgroundImage: layout ? `url(${layout})` : "none",
        backgroundSize: "cover"
      }}>
        {machines.map(m => (
          <Draggable
            key={m.id}
            defaultPosition={{ x: m.x, y: m.y }}
            onStop={(e, d) => update(m.id, d.x, d.y)}
          >
            <div
              onClick={() => alert("Machine ID: " + m.id)}
              style={{
                position: "absolute",
                width: 100,
                height: 60,
                background: "green",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer"
              }}
            >
              {m.name}
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
}
