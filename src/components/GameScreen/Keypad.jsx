import React from "react";

export default function Keypad({ onKeyPress, onUndo, onEndGame }) {
  const keys = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <section className="keypad card">
      <div className="keypad-grid" id="keypad">
        {keys.map((k) => (
          <button
            key={k}
            type="button"
            className="key"
            data-value={k}
            onClick={() => onKeyPress(k)}
          >
            {k}
          </button>
        ))}
        <button
          type="button"
          className="key"
          id="missBtn"
          data-value="X"
          onClick={() => onKeyPress("X")}
        >
          X
        </button>
      </div>
      <div className="keypad-actions">
        <button
          type="button"
          id="undoBtn"
          className="btn ghost"
          onClick={onUndo}
        >
          Undo
        </button>
        <button
          type="button"
          id="endGameBtn"
          className="btn danger"
          onClick={onEndGame}
        >
          End game
        </button>
      </div>
    </section>
  );
}
