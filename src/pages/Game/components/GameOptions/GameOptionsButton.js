import React from "react";

export default function GameOptionsButton({ description, onClick }) {
  return (
    <button className="game-options-button" onClick={onClick}>
      <div className="key">ESC</div>
      {description}
    </button>
  );
}
