import React from "react";

export default function CurrentPlayerCard({ player, gameActive }) {
  if (!gameActive || !player || player.eliminated) return null;

  const remaining = Math.max(50 - player.total, 0);
  const pct = Math.min((player.total / 50) * 100, 100);

  return (
    <div id="currentPlayerCard" className="card current-player-card" style={{ display: "block" }}>
      <h3 style={{ color: player.color }}>{player.name}'s Turn</h3>
      <p>
        <strong>{remaining}</strong> points to win
      </p>
      <div className="turn-progress-track">
        <div
          className="turn-progress-fill"
          style={{ width: `${pct}%`, backgroundColor: player.color }}
        />
      </div>
    </div>
  );
}
