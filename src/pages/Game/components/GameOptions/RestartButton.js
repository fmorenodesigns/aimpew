import React from "react";

export default function RestartButton({ onClick }) {
  return (
    <button className="key-button restart-button" onClick={onClick}>
      Restart
      <div className="key">SPACE</div>
    </button>
  );
}
