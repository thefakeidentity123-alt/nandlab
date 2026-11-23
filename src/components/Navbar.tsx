import React from 'react';
import { ArrowUpRight, Cpu } from 'lucide-react';

interface NavbarProps {
  scrollProgress: number;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ scrollProgress, onNavigate }) => {
  const pct = Math.round(scrollProgress * 100);

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <button
          type="button"
          className="navbar__brand"
          onClick={() => onNavigate('chapter-hero')}
          aria-label="NAND Lab Home"
        >
          <span className="navbar__logo-mark">
            <Cpu size={18} />
          </span>
          <span className="navbar__brand-text">
            NAND<span className="accent-cyan">LAB</span>
          </span>
        </button>

        <nav className="navbar__links" aria-label="Primary Navigation">
          <button type="button" onClick={() => onNavigate('chapter-architecture')}>
            Architecture
          </button>
          <button type="button" onClick={() => onNavigate('chapter-b2c')}>
            B2C Training
          </button>
          <button type="button" onClick={() => onNavigate('chapter-b2b')}>
            B2B Systems
          </button>
          <button type="button" onClick={() => onNavigate('chapter-sandbox')}>
            Logic Lab
          </button>
        </nav>

        <div className="navbar__actions">
          <span className="navbar__telemetry mono-tag" aria-hidden="true">
            Z:{pct.toString().padStart(3, '0')}%
          </span>
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => onNavigate('chapter-contact')}
          >
            <span>Initialize</span>
            <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
      <div className="navbar__progress-line" style={{ transform: `scaleX(${scrollProgress})` }} />
    </header>
  );
};