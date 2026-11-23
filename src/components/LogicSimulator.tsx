import React from 'react';
import { Activity, CheckCircle2, Cpu } from 'lucide-react';

interface LogicSimulatorProps {
  inputA: 0 | 1;
  inputB: 0 | 1;
  onToggleA: () => void;
  onToggleB: () => void;
}

const TRUTH_TABLE: Array<{ a: 0 | 1; b: 0 | 1; out: 0 | 1; businessMeaning: string }> = [
  { a: 0, b: 0, out: 1, businessMeaning: 'Clean slate → High upside potential with structured training' },
  { a: 0, b: 1, out: 1, businessMeaning: 'Domain knowledge without tools → Unlocked via MIS & SQL' },
  { a: 1, b: 0, out: 1, businessMeaning: 'Raw tools without workflow → Unified via BI & Automation' },
  { a: 1, b: 1, out: 0, businessMeaning: 'Manual bloat + Siloed data → Eliminated to ZERO friction' }
];

export const LogicSimulator: React.FC<LogicSimulatorProps> = ({
  inputA,
  inputB,
  onToggleA,
  onToggleB
}) => {
  const output: 0 | 1 = inputA === 1 && inputB === 1 ? 0 : 1;

  return (
    <div className="simulator-card glass-panel">
      <div className="simulator-card__header">
        <div className="simulator-card__title-group">
          <Cpu size={18} className="accent-cyan" />
          <span className="mono-tag">INTERACTIVE 3D NAND GATE // LIVE TRUTH TABLE</span>
        </div>
        <span className={`signal-pill ${output === 1 ? 'signal-pill--high' : 'signal-pill--low'}`}>
          <Activity size={13} />
          <span>OUT: {output} ({output === 1 ? 'ACTIVE SIGNAL' : 'FRICTION ZEROED'})</span>
        </span>
      </div>

      <p className="simulator-card__desc">
        Toggle Inputs <strong>A</strong> and <strong>B</strong> below to drive the 3D NAND sculpture in real time.
        Every complex enterprise pipeline or analytical career starts from this single universal truth table.
      </p>

      <div className="simulator-controls">
        <button
          type="button"
          className={`gate-switch ${inputA === 1 ? 'gate-switch--on' : ''}`}
          onClick={onToggleA}
          aria-pressed={inputA === 1}
        >
          <span className="mono-tag">INPUT A (DATA / SKILL)</span>
          <strong>{inputA}</strong>
          <small>Click to toggle</small>
        </button>

        <div className="gate-operator mono-tag">NAND</div>

        <button
          type="button"
          className={`gate-switch ${inputB === 1 ? 'gate-switch--on' : ''}`}
          onClick={onToggleB}
          aria-pressed={inputB === 1}
        >
          <span className="mono-tag">INPUT B (SYSTEM / LOGIC)</span>
          <strong>{inputB}</strong>
          <small>Click to toggle</small>
        </button>

        <div className="gate-operator mono-tag">→</div>

        <div className={`gate-output ${output === 1 ? 'gate-output--high' : 'gate-output--low'}`}>
          <span className="mono-tag">OUTPUT ¬(A ∧ B)</span>
          <strong>{output}</strong>
          <small>{output === 1 ? 'Signal Propagated' : 'Bottleneck Eliminated'}</small>
        </div>
      </div>

      <div className="truth-table" role="table" aria-label="NAND Gate Truth Table">
        <div className="truth-table__head" role="row">
          <span>A</span>
          <span>B</span>
          <span>NAND OUT</span>
          <span>NAND Lab Operational Translation</span>
        </div>
        {TRUTH_TABLE.map((row) => {
          const isCurrent = row.a === inputA && row.b === inputB;
          return (
            <div
              key={`${row.a}-${row.b}`}
              role="row"
              className={`truth-table__row ${isCurrent ? 'truth-table__row--active' : ''}`}
            >
              <span className="mono-tag">{row.a}</span>
              <span className="mono-tag">{row.b}</span>
              <span className="mono-tag accent-cyan">{row.out}</span>
              <span className="truth-table__meaning">
                {isCurrent && <CheckCircle2 size={14} className="accent-cyan" />}
                {row.businessMeaning}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};