import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {
  ArrowDownRight,
  ArrowRight,
  Building2,
  Check,
  Code2,
  Database,
  GraduationCap,
  Layers,
  Sparkles,
  Terminal
} from 'lucide-react';
import {
  ARCHITECTURE_LAYERS,
  B2B_SOLUTIONS,
  B2C_TRACKS,
  BRAND_INFO
} from './data/nandlabData';
import { NandSceneEngine } from './three/NandSceneEngine';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import { LogicSimulator } from './components/LogicSimulator';
import { ContactTerminal } from './components/ContactTerminal';

gsap.registerPlugin(ScrollTrigger);

export function App() {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<NandSceneEngine | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const [sceneReady, setSceneReady] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeTrackIdx, setActiveTrackIdx] = useState(0);
  const [inputA, setInputA] = useState<0 | 1>(1);
  const [inputB, setInputB] = useState<0 | 1>(1);
  const [contactIntent, setContactIntent] = useState<'b2c' | 'b2b'>('b2c');
  const [contactSubject, setContactSubject] = useState('');

  // Initialize Three.js Scene Engine + Lenis Smooth Scroll + GSAP ScrollTrigger
  useEffect(() => {
    if (!canvasMountRef.current) return;

    const engine = new NandSceneEngine(canvasMountRef.current, () => {
      setSceneReady(true);
    });
    engineRef.current = engine;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });
    lenisRef.current = lenis;

    lenis.on('scroll', (e: { progress: number; velocity: number }) => {
      ScrollTrigger.update();
      engine.state.progress = e.progress;
      engine.state.velocity = e.velocity * 0.04;
      setScrollProgress(e.progress);
    });

    const tickerFn = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    // Subtle DOM reveal choreography synced to ScrollTrigger
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.reveal-card').forEach((card) => {
        gsap.fromTo(
          card,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 86%',
              once: true
            }
          }
        );
      });
    });

    return () => {
      ctx.revert();
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
      engine.dispose();
    };
  }, []);

  const handleSelectTrack = (index: number) => {
    setActiveTrackIdx(index);
    engineRef.current?.setActiveTrack(index);
  };

  const handleToggleA = () => {
    const nextA: 0 | 1 = inputA === 1 ? 0 : 1;
    setInputA(nextA);
    engineRef.current?.setLogicInputs(nextA, inputB);
  };

  const handleToggleB = () => {
    const nextB: 0 | 1 = inputB === 1 ? 0 : 1;
    setInputB(nextB);
    engineRef.current?.setLogicInputs(inputA, nextB);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: -72 });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const routeToInquiry = (intent: 'b2c' | 'b2b', subject: string) => {
    setContactIntent(intent);
    setContactSubject(subject);
    scrollToSection('chapter-contact');
  };

  const selectedTrack = B2C_TRACKS[activeTrackIdx];

  return (
    <div className="app-shell">
      <Preloader ready={sceneReady} />

      {/* Persistent 60fps Interactive WebGL Stage */}
      <div ref={canvasMountRef} className="webgl-stage" aria-hidden="true" />
      <div className="vignette-overlay" aria-hidden="true" />

      <Navbar scrollProgress={scrollProgress} onNavigate={scrollToSection} />

      <main className="scroll-narrative">
        {/* CHAPTER 01: HERO — THE UNIVERSAL LOGIC GATE */}
        <section id="chapter-hero" className="chapter chapter--hero">
          <div className="container">
            <div className="hero-content">
              <div className="eyebrow-pill">
                <Terminal size={14} className="accent-cyan" />
                <span className="mono-tag">NANDLAB.IN // UNIVERSAL LOGIC GATE ARCHITECTURE</span>
              </div>

              <h1 className="hero-title">
                Build Any Skill.
                <br />
                <span className="text-gradient">Automate Any System.</span>
              </h1>

              <p className="hero-subtitle">
                Named after the universal <strong>NAND</strong> digital logic gate from which every processor
                is built, <strong>NAND Lab</strong> is a dual-engine technical institute and engineering
                studio—transforming ambitious learners into job-ready data/web practitioners and businesses
                into automated, MIS-driven enterprises.
              </p>

              <div className="hero-cta-group">
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => scrollToSection('chapter-b2c')}
                >
                  <GraduationCap size={18} />
                  <span>Explore B2C Training Tracks</span>
                  <ArrowDownRight size={16} />
                </button>

                <button
                  type="button"
                  className="btn btn--amber-outline"
                  onClick={() => scrollToSection('chapter-b2b')}
                >
                  <Building2 size={18} />
                  <span>B2B MIS & Automation Systems</span>
                  <ArrowDownRight size={16} />
                </button>
              </div>

              <div className="hero-metrics">
                <div className="metric-chip">
                  <span className="mono-tag accent-cyan">05 CORE TRACKS</span>
                  <span>MIS, Excel, SQL, Power BI, Python & Web</span>
                </div>
                <div className="metric-chip">
                  <span className="mono-tag accent-amber">B2B ENGINEERING</span>
                  <span>Automated Pipelines, BI & Custom Web Apps</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 02: EXPLODED VIEW — ATOMIC LOGIC ARCHITECTURE */}
        <section id="chapter-architecture" className="chapter chapter--split-left">
          <div className="container">
            <div className="section-column">
              <div className="section-header reveal-card">
                <span className="mono-tag accent-cyan">CHAPTER 02 // FIRST-PRINCIPLES METHODOLOGY</span>
                <h2>Why the NAND Gate?</h2>
                <p>{BRAND_INFO.philosophy}</p>
              </div>

              <div className="layers-stack">
                {ARCHITECTURE_LAYERS.map((layer) => (
                  <article key={layer.step} className="glass-panel layer-card reveal-card">
                    <div className="layer-card__top">
                      <span className="mono-tag accent-cyan">{layer.step}</span>
                      <span className="layer-role">{layer.logicRole}</span>
                    </div>
                    <h3>{layer.title}</h3>
                    <p>{layer.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 03: B2C TALENT FOUNDRY */}
        <section id="chapter-b2c" className="chapter chapter--split-right">
          <div className="container">
            <div className="section-column section-column--right">
              <div className="section-header reveal-card">
                <span className="mono-tag accent-cyan">CHAPTER 03 // B2C TRAINING & CAREER LAB</span>
                <h2>Practitioner-Led Technical Cohorts</h2>
                <p>
                  Zero fluff, zero passive slide-reading. Select a curriculum node to inspect the
                  exact tools, workflows, and deployable outcomes you master in the lab.
                </p>
              </div>

              <div className="track-selector reveal-card" role="tablist" aria-label="B2C Training Tracks">
                {B2C_TRACKS.map((track, idx) => (
                  <button
                    key={track.id}
                    type="button"
                    role="tab"
                    aria-selected={activeTrackIdx === idx}
                    className={`track-pill ${activeTrackIdx === idx ? 'track-pill--active' : ''}`}
                    onClick={() => handleSelectTrack(idx)}
                  >
                    <span className="mono-tag">{track.code}</span>
                    <span>{track.title.split('&')[0].trim()}</span>
                  </button>
                ))}
              </div>

              <div className="glass-panel track-detail-card reveal-card">
                <div className="track-detail-card__meta">
                  <span className="mono-tag accent-cyan">{selectedTrack.code}</span>
                  <span>{selectedTrack.duration}</span>
                  <span>•</span>
                  <span>{selectedTrack.mode}</span>
                </div>

                <h3>{selectedTrack.title}</h3>
                <p className="track-tagline">{selectedTrack.tagline}</p>

                <div className="tool-tags">
                  {selectedTrack.tools.map((tool) => (
                    <span key={tool} className="tool-tag mono-tag">
                      {tool}
                    </span>
                  ))}
                </div>

                <ul className="outcome-list">
                  {selectedTrack.outcomes.map((outcome) => (
                    <li key={outcome}>
                      <Check size={16} className="accent-cyan" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>

                <div className="track-detail-card__footer">
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() => routeToInquiry('b2c', selectedTrack.title)}
                  >
                    <span>Enroll / Request {selectedTrack.code} Syllabus</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 04: B2B ENTERPRISE ENGINE */}
        <section id="chapter-b2b" className="chapter chapter--split-left">
          <div className="container">
            <div className="section-column">
              <div className="section-header reveal-card">
                <span className="mono-tag accent-amber">CHAPTER 04 // B2B MIS, AUTOMATION & WEB</span>
                <h2>Turn Operational Chaos Into Structured Intelligence</h2>
                <p>
                  We partner with founders, CFOs, and operations teams to eliminate manual spreadsheet
                  drudgery—building reliable MIS, automated data pipelines, and custom web applications
                  with lean total cost of ownership.
                </p>
              </div>

              <div className="b2b-cards">
                {B2B_SOLUTIONS.map((sol, idx) => (
                  <article key={sol.id} className="glass-panel b2b-card reveal-card">
                    <div className="b2b-card__header">
                      <span className="mono-tag accent-amber">{sol.code}</span>
                      <span className="impact-badge">{sol.impactMetric}</span>
                    </div>

                    <div className="b2b-card__title-row">
                      {idx === 0 && <Database size={20} className="accent-amber" />}
                      {idx === 1 && <Layers size={20} className="accent-amber" />}
                      {idx === 2 && <Code2 size={20} className="accent-amber" />}
                      <h3>{sol.title}</h3>
                    </div>

                    <p className="b2b-subtitle">{sol.subtitle}</p>
                    <p className="b2b-desc">{sol.description}</p>

                    <ul className="outcome-list outcome-list--amber">
                      {sol.deliverables.map((item) => (
                        <li key={item}>
                          <Sparkles size={15} className="accent-amber" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      className="btn btn--amber-outline btn--sm"
                      onClick={() => routeToInquiry('b2b', sol.title)}
                    >
                      <span>Scope This System</span>
                      <ArrowRight size={15} />
                    </button>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 05: INTERACTIVE LOGIC LAB */}
        <section id="chapter-sandbox" className="chapter chapter--centered">
          <div className="container">
            <div className="section-header section-header--center reveal-card">
              <span className="mono-tag accent-cyan">CHAPTER 05 // INTERACTIVE CIRCUIT PROOF</span>
              <h2>Test the Universal NAND Engine</h2>
              <p>
                Interact directly with our WebGL logic gate. Flip the input states to observe how
                deterministic rules govern both skill acquisition and enterprise automation.
              </p>
            </div>

            <div className="reveal-card">
              <LogicSimulator
                inputA={inputA}
                inputB={inputB}
                onToggleA={handleToggleA}
                onToggleB={handleToggleB}
              />
            </div>
          </div>
        </section>

        {/* CHAPTER 06: CONVERSION & CONTACT TERMINAL */}
        <section id="chapter-contact" className="chapter chapter--finale">
          <div className="container">
            <div className="section-header section-header--center reveal-card">
              <span className="mono-tag accent-amber">CHAPTER 06 // INITIALIZE CONNECTION</span>
              <h2>Start Your Next Build With NAND Lab</h2>
              <p>
                Whether you are upgrading your technical career or architecting an automated MIS &
                web ecosystem for your company, choose your lane below.
              </p>
            </div>

            <div className="reveal-card">
              <ContactTerminal
                defaultIntent={contactIntent}
                preselectedSubject={contactSubject}
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <div>
            <strong>NAND LAB</strong> — Universal Logic for Talent, MIS, Data & Web Engineering.
          </div>
          <div className="mono-tag">
            © {new Date().getFullYear()} {BRAND_INFO.domain} • ALL SYSTEMS OPERATIONAL
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
