import React from "react";
import { UndoIcon } from "../icons/Icons";

export default function Keypad({ onKeyPress, onUndo, isEditing = false, t }) {
  const keys = Array.from({ length: 12 }, (_, i) => i + 1);

  const getT = (key, fallback) => (t ? t(key) : fallback);

  return (
    <section className={`keypad card ${isEditing ? "editing-active" : ""}`}>
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
      </div>
      <div className="keypad-bottom-row">
        <button
          type="button"
          id="missBtn"
          className="btn-miss"
          data-value="X"
          onClick={() => onKeyPress("X")}
        >
          X
        </button>
        <button
          type="button"
          id="undoBtn"
          className="btn-undo"
          onClick={onUndo}
        >
          <UndoIcon size={16} /> {getT("undoBtn", "Undo")}
        </button>
      </div>
    </section>
  );
}
