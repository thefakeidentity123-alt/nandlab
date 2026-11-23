export interface TrainingTrack {
  id: string;
  code: string;
  title: string;
  tagline: string;
  duration: string;
  mode: string;
  nodeIndex: number;
  tools: string[];
  outcomes: string[];
}

export interface B2BSolution {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  impactMetric: string;
}

export interface ArchitectureLayer {
  step: string;
  title: string;
  logicRole: string;
  description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'B2C Training' | 'B2B Consulting';
}

export const BRAND_INFO = {
  name: 'NAND Lab',
  domain: 'https://nandlab.in',
  tagline: 'Universal Logic for Talent & Enterprise Systems',
  email: 'hello@nandlab.in',
  phone: '+91 98765 43210',
  location: 'Ahmedabad, Gujarat, India (Offline Lab + Live Remote)',
  philosophy:
    'In digital electronics, the NAND gate is functionally complete—every processor and system can be built from it. At NAND Lab, we apply that same modular precision to human skill-building and business automation.'
};

export const ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
  {
    step: 'LAYER 01 // INPUT BUS',
    title: 'Raw Data & Foundational Literacy',
    logicRole: 'Signal Acquisition (Inputs A & B)',
    description:
      'Whether starting from zero in spreadsheets or dealing with fragmented ERP/CRM exports, every reliable system begins with clean, structured inputs.'
  },
  {
    step: 'LAYER 02 // NAND MATRIX',
    title: 'Boolean & Relational Logic',
    logicRole: 'Deterministic Transformation',
    description:
      'We replace guesswork and manual copy-pasting with deterministic formulas, normalized SQL schemas, and repeatable business rules.'
  },
  {
    step: 'LAYER 03 // AUTOMATION ENGINE',
    title: 'Python, Pipelines & Web Interfaces',
    logicRole: 'Zero-Friction Execution',
    description:
      'Repetitive reporting and operational bottlenecks are automated via Python scripts, scheduled ETL workflows, and custom web applications.'
  },
  {
    step: 'LAYER 04 // DECISION OUTPUT',
    title: 'Executive Intelligence & Career Readiness',
    logicRole: 'Verified High-Signal Output',
    description:
      'Students graduate with deployable portfolios; businesses operate on real-time Power BI dashboards and single-source-of-truth MIS.'
  }
];

export const B2C_TRACKS: TrainingTrack[] = [
  {
    id: 'mis-excel',
    code: 'TRK-01',
    title: 'Corporate MIS & Advanced Excel Mastery',
    tagline: 'From raw spreadsheets to automated boardroom reporting systems.',
    duration: '8 Weeks • Practical Lab',
    mode: 'Offline Center + Live Cohort',
    nodeIndex: 0,
    tools: ['Dynamic Arrays', 'Power Query (M)', 'Power Pivot', 'Pivot Architecture', 'VBA/Macros'],
    outcomes: [
      'Build zero-touch monthly MIS packs using Power Query & Data Models',
      'Master XLOOKUP, INDEX-MATCH, LET, LAMBDA, and financial/ops modeling',
      'Solve real corporate dataset case studies under timed conditions'
    ]
  },
  {
    id: 'sql-analytics',
    code: 'TRK-02',
    title: 'SQL & Relational Data Engineering',
    tagline: 'Query, model, and audit multi-million-row business databases with confidence.',
    duration: '6 Weeks • Query Intensive',
    mode: 'Offline Center + Live Cohort',
    nodeIndex: 1,
    tools: ['PostgreSQL / MySQL', 'Window Functions', 'CTEs', 'Schema Design', 'Query Tuning'],
    outcomes: [
      'Write complex cohort, retention, funnel, and variance queries using Window Functions',
      'Design normalized 3NF relational tables and star-schema analytics views',
      'Translate ambiguous business questions into auditable SQL logic'
    ]
  },
  {
    id: 'power-bi',
    code: 'TRK-03',
    title: 'Power BI & Executive Storytelling',
    tagline: 'Architect interactive KPI ecosystems that drive immediate operational decisions.',
    duration: '8 Weeks • Capstone Driven',
    mode: 'Offline Center + Live Cohort',
    nodeIndex: 2,
    tools: ['Power BI Desktop', 'DAX Engine', 'Star Schema Modeling', 'Row-Level Security', 'BI Service'],
    outcomes: [
      'Engineer clean Star Schemas and high-performance DAX time-intelligence measures',
      'Design clutter-free executive dashboards with drill-through & dynamic parameters',
      'Deploy automated workspace refreshes with role-based access control'
    ]
  },
  {
    id: 'python-data',
    code: 'TRK-04',
    title: 'Python for Data Analytics & Automation',
    tagline: 'Automate heavy data cleaning, API extraction, and statistical workflows.',
    duration: '10 Weeks • Code First',
    mode: 'Offline Center + Live Cohort',
    nodeIndex: 3,
    tools: ['Python 3', 'Pandas & NumPy', 'Automated Reporting', 'REST APIs', 'Jupyter / Scripts'],
    outcomes: [
      'Eliminate hours of manual CSV/Excel wrangling with reproducible Pandas pipelines',
      'Pull live data from APIs and databases into automated email/PDF summaries',
      'Perform exploratory data analysis and anomaly detection on business datasets'
    ]
  },
  {
    id: 'web-fullstack',
    code: 'TRK-05',
    title: 'Modern Web Engineering & Internal Tools',
    tagline: 'Build fast, responsive websites, client portals, and data-backed web apps.',
    duration: '12 Weeks • Studio Build',
    mode: 'Offline Center + Live Cohort',
    nodeIndex: 4,
    tools: ['HTML/CSS/TS', 'React', 'Node.js / APIs', 'Database Integration', 'Deployment'],
    outcomes: [
      'Architect responsive, accessible frontends with modern TypeScript & React',
      'Connect web interfaces to live databases and authentication workflows',
      'Ship production web applications from domain setup to CI/CD deployment'
    ]
  }
];

export const B2B_SOLUTIONS: B2BSolution[] = [
  {
    id: 'b2b-mis',
    code: 'SYS-01',
    title: 'Custom MIS & Executive BI Architecture',
    subtitle: 'Single Source of Truth for Founders & Operations Leaders',
    description:
      'We audit your fragmented Excel sheets, Tally/ERP exports, and CRM logs to engineer a unified, automated MIS and Power BI reporting command center.',
    deliverables: [
      'Automated P&L, cashflow, inventory, and sales-velocity dashboards',
      'Zero-manual-entry Power Query / SQL / Python data consolidation',
      'SOP documentation & internal team handover training'
    ],
    impactMetric: '80%+ reduction in manual weekly reporting hours'
  },
  {
    id: 'b2b-automation',
    code: 'SYS-02',
    title: 'Data Pipelines & Workflow Automation',
    subtitle: 'Deterministic Scripts & Integrations That Run While You Sleep',
    description:
      'Eliminate human copy-paste errors across departments. We connect your spreadsheets, databases, email, and WhatsApp/API alerts into resilient automated pipelines.',
    deliverables: [
      'Scheduled ETL scripts & automated reconciliation engines',
      'Exception alerting for stockouts, overdue receivables, and SLA breaches',
      'Lightweight self-hosted or low-TCO cloud deployment'
    ],
    impactMetric: 'Zero recurring SaaS bloat; built on open standards'
  },
  {
    id: 'b2b-web',
    code: 'SYS-03',
    title: 'High-Craft Web Platforms & Custom Portals',
    subtitle: 'Conversion-Engineered Web Presence & Internal Operations Apps',
    description:
      'From flagship brand websites to custom client/vendor portals and internal data-entry tools, we engineer fast, secure web software tailored to your exact workflow.',
    deliverables: [
      'Custom React / TypeScript web applications & SEO-optimized brand sites',
      'Role-based internal dashboards, lead capture, and CRM integrations',
      'Sub-second load performance, technical SEO, and clean maintainable code'
    ],
    impactMetric: '100% custom architecture with zero template lock-in'
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    category: 'B2C Training',
    question: 'Do I need a prior coding or IT background to join the MIS or Data Analytics tracks?',
    answer:
      'No. Every cohort starts from first principles—how business data is structured and how logic operates—before progressing into Excel, SQL, Power BI, and Python. Commerce, management, and engineering learners all follow a structured, hands-on progression.'
  },
  {
    category: 'B2C Training',
    question: 'How is NAND Lab different from pre-recorded video courses?',
    answer:
      'You build real, messy business systems live with practitioner mentorship—debugging broken formulas, optimizing slow SQL queries, and defending your dashboard logic in weekly code/MIS reviews.'
  },
  {
    category: 'B2B Consulting',
    question: 'Can you automate our existing Excel/Tally/CRM workflows without forcing expensive new software?',
    answer:
      'Yes. Our core engineering principle is maximizing your existing stack first—connecting Excel, SQL, Power BI, Python, and lightweight web interfaces so you avoid unnecessary recurring SaaS subscriptions.'
  },
  {
    category: 'B2B Consulting',
    question: 'How does a B2B MIS or Web Engineering engagement begin?',
    answer:
      'We start with a focused 45-minute Systems & Data Audit where we map your current bottlenecks, data sources, and manual hours, then deliver a fixed-scope implementation blueprint before writing a single line of code.'
  }
];