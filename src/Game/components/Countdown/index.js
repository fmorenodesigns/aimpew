import "./styles.scss";

import React, { useEffect, useState } from "react";

export default function Countdown({ startValue, setStarted }) {
  const [count, setCount] = useState(startValue / 1000);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (count - 1 === 0) {
        setStarted(true);
        return;
      }

      setCount((cur) => cur - 1);
    }, [1000]);

    return () => clearTimeout(timeout);
  }, [count, setStarted]);

  return (
    <div className="overlay">
      <div className="countdown-text">{count}</div>
    </div>
  );
}
