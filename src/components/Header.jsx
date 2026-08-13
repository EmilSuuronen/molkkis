import React from "react";

export default function Header({ gameActive }) {
  if (gameActive) return null;

  return (
    <header className="app-header">
      <h1 className="logo">Mölkkis</h1>
      <p className="tagline">Mölkky Scoreboard & Rules</p>
    </header>
  );
}
