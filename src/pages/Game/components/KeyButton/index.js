import "./styles.scss";

import React from "react";

export function RestartButton({ onClick }) {
  return (
    <button className="key-button restart-button" onClick={onClick}>
      Restart
      <div className="key">SPACE</div>
    </button>
  );
}

export function GameOptionsButton({ description, onClick }) {
  return (
    <button className="key-button game-options-button" onClick={onClick}>
      <div className="key">ESC</div>
      {description}
    </button>
  );
}
