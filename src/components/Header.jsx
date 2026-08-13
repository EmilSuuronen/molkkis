import React from "react";

export default function Header({ gameActive }) {
  if (gameActive) return null;

  return (
    <header className="app-header">
      <img src="./icons/icon-192.png" className="img-header" alt="Mölkkis icon" />
      <h1>Mölkkis</h1>
    </header>
  );
}
