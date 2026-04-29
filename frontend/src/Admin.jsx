import React, { useState } from "react";

export default function Admin({ token }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const upload = async () => {
    if (!file) return alert("Válassz fájlt");

    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/layout", {
      method: "POST",
      headers: {
        Authorization: token
      },
      body: form
    });

    if (res.ok) {
      setStatus("✔ Feltöltve");
    } else {
      setStatus("❌ Hiba");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin - Layout feltöltés</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button
        onClick={upload}
        style={{
          padding: 12,
          background: "#4caf50",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: 6
        }}
      >
        Feltöltés
      </button>

      <div style={{ marginTop: 10 }}>{status}</div>
    </div>
  );
}