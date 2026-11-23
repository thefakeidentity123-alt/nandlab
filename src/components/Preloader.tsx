import React, { useEffect, useState } from 'react';

interface PreloaderProps {
  ready: boolean;
}

export const Preloader: React.FC<PreloaderProps> = ({ ready }) => {
  const [percent, setPercent] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setPercent((prev) => {
        if (ready) return Math.min(100, prev + 18);
        return prev < 88 ? prev + 6 : prev;
      });
    }, 35);

    return () => clearInterval(timer);
  }, [ready]);

  useEffect(() => {
    if (percent >= 100 && ready) {
      const timeout = setTimeout(() => setHidden(true), 360);
      return () => clearTimeout(timeout);
    }
  }, [percent, ready]);

  if (hidden) return null;

  return (
    <div
      className={`preloader ${percent >= 100 ? 'preloader--exit' : ''}`}
      role="status"
      aria-label="Initializing NAND Lab 3D Environment"
    >
      <div className="preloader__inner">
        <div className="preloader__gate-badge">
          <span className="mono-tag">GATE_00 // NOT-AND ENGINE</span>
        </div>
        <div className="preloader__bar-track">
          <div className="preloader__bar-fill" style={{ width: `${percent}%` }} />
        </div>
        <div className="preloader__meta">
          <span>COMPILING SHADERS & LOGIC TOPOLOGY</span>
          <span className="mono-tag">{percent}%</span>
        </div>
      </div>
    </div>
  );
};