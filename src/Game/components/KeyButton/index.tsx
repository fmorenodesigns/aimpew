import "./styles.scss";

interface KeyButton {
  onClick: () => void;
  description?: string;
}

export function RestartButton({ onClick }: KeyButton) {
  return (
    <button className="key-button restart-button" onClick={onClick}>
      Restart
      <div className="key">SPACE</div>
    </button>
  );
}

export function GameSettingsButton({ description, onClick }: KeyButton) {
  return (
    <button className="key-button game-options-button" onClick={onClick}>
      <div className="key">ESC</div>
      {description}
    </button>
  );
}
