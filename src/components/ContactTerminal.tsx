import React, { useState } from 'react';
import { ArrowRight, Building2, CheckCircle2, GraduationCap, Mail, MapPin, Phone } from 'lucide-react';
import { BRAND_INFO, FAQ_ITEMS } from '../data/nandlabData';

interface ContactTerminalProps {
  defaultIntent?: 'b2c' | 'b2b';
  preselectedSubject?: string;
}

export const ContactTerminal: React.FC<ContactTerminalProps> = ({
  defaultIntent = 'b2c',
  preselectedSubject = ''
}) => {
  const [intent, setIntent] = useState<'b2c' | 'b2b'>(defaultIntent);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [focusArea, setFocusArea] = useState(preselectedSubject);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    setIntent(defaultIntent);
  }, [defaultIntent]);

  React.useEffect(() => {
    if (preselectedSubject) setFocusArea(preselectedSubject);
  }, [preselectedSubject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="contact-grid">
      <div className="glass-panel contact-form-panel">
        <div className="intent-tabs" role="tablist" aria-label="Select Inquiry Path">
          <button
            type="button"
            role="tab"
            aria-selected={intent === 'b2c'}
            className={`intent-tab ${intent === 'b2c' ? 'intent-tab--active-b2c' : ''}`}
            onClick={() => {
              setIntent('b2c');
              setSubmitted(false);
            }}
          >
            <GraduationCap size={17} />
            <span>B2C Career & Cohort Admissions</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={intent === 'b2b'}
            className={`intent-tab ${intent === 'b2b' ? 'intent-tab--active-b2b' : ''}`}
            onClick={() => {
              setIntent('b2b');
              setSubmitted(false);
            }}
          >
            <Building2 size={17} />
            <span>B2B MIS, Automation & Web Audit</span>
          </button>
        </div>

        {submitted ? (
          <div className="submission-success" role="status">
            <CheckCircle2 size={36} className={intent === 'b2c' ? 'accent-cyan' : 'accent-amber'} />
            <h3>Signal Received at NAND Lab</h3>
            <p>
              Thank you, <strong>{name}</strong>. Your{' '}
              {intent === 'b2c' ? 'training counseling & syllabus request' : 'B2B systems audit brief'} has
              been logged. Our engineering/admissions desk will reach out via <strong>{contact}</strong> within
              1 business day.
            </p>
            <button type="button" className="btn btn--ghost" onClick={() => setSubmitted(false)}>
              Send Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="terminal-form">
            <div className="form-row">
              <label>
                <span>Your Name *</span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={intent === 'b2c' ? 'e.g., Aarav Patel' : 'e.g., Rohan Mehta, Operations Head'}
                />
              </label>

              <label>
                <span>Phone / WhatsApp or Email *</span>
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="+91 98XXX XXXXX or you@company.com"
                />
              </label>
            </div>

            <label>
              <span>
                {intent === 'b2c' ? 'Target Skill Track' : 'Primary Operational Bottleneck'}
              </span>
              <input
                type="text"
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
                placeholder={
                  intent === 'b2c'
                    ? 'Corporate MIS & Excel / SQL / Power BI / Python / Full-Stack Web'
                    : 'Automated MIS / Power BI Dashboard / ETL Pipeline / Custom Web App'
                }
              />
            </label>

            <label>
              <span>Context & Current Baseline</span>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  intent === 'b2c'
                    ? 'Share your current background (student, analyst, career switcher) and target timeline...'
                    : 'Describe your current tools (Excel, Tally, Zoho, SQL, etc.) and where manual hours are lost...'
                }
              />
            </label>

            <button
              type="submit"
              className={`btn btn--full ${intent === 'b2c' ? 'btn--primary' : 'btn--amber'}`}
            >
              <span>
                {intent === 'b2c'
                  ? 'Request Syllabus & Batch Schedule'
                  : 'Book 45-Min Systems & MIS Audit'}
              </span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>

      <div className="contact-side">
        <div className="glass-panel direct-details">
          <span className="mono-tag">DIRECT TELEMETRY // NANDLAB.IN</span>
          <h3>Visit or Connect Directly</h3>
          <ul className="contact-list">
            <li>
              <Mail size={16} className="accent-cyan" />
              <a href={`mailto:${BRAND_INFO.email}`}>{BRAND_INFO.email}</a>
            </li>
            <li>
              <Phone size={16} className="accent-cyan" />
              <a href={`tel:${BRAND_INFO.phone.replace(/\s+/g, '')}`}>{BRAND_INFO.phone}</a>
            </li>
            <li>
              <MapPin size={16} className="accent-amber" />
              <span>{BRAND_INFO.location}</span>
            </li>
          </ul>
        </div>

        <div className="glass-panel faq-panel">
          <span className="mono-tag">FREQUENTLY ASKED QUESTIONS</span>
          <div className="faq-list">
            {FAQ_ITEMS.map((item) => (
              <details key={item.question} className="faq-item">
                <summary>
                  <span className="faq-cat">{item.category}</span>
                  <span>{item.question}</span>
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};