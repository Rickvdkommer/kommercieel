import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const CALENDLY = 'https://calendly.com/rickvandenkommer/new-meeting';

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('kc-theme') as 'light' | 'dark') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('kc-theme', theme);
  }, [theme]);

  const toggle = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <div className="home-page">
      {/* ── Header ── */}
      <header className="home-header">
        <Link to="/" className="home-header-logo">kommercieel</Link>
        <nav className="home-header-nav">
          <a href="#services">Services</a>
          <a href="#process">Process</a>
          <a href="#proof">Results</a>
          <button className="theme-toggle" onClick={toggle} aria-label="Toggle theme">
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
          <a href={CALENDLY} className="home-nav-cta" target="_blank" rel="noopener noreferrer">
            Book a Call <ArrowIcon />
          </a>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="home-hero">
        <div className="home-hero-content">
          <span className="home-hero-badge">GTM ENGINE BUILDERS</span>
          <h1>We build the systems<br />that fill your pipeline.</h1>
          <p className="home-hero-sub">
            Outbound infrastructure, data enrichment, and pipeline automation
            for B2B SaaS companies that want predictable growth.
          </p>
          <div className="home-hero-ctas">
            <a href={CALENDLY} className="btn-primary" target="_blank" rel="noopener noreferrer">
              Book a Discovery Call <ArrowIcon />
            </a>
            <Link to="/engine" className="btn-outline">See Our Work</Link>
          </div>
        </div>
        <div className="home-hero-gfx">
          <HeroGraphics />
        </div>
      </section>

      {/* ── Ticker ── */}
      <div className="home-ticker">
        {['DATA ENRICHMENT', 'PIPELINE AUTOMATION', 'OUTBOUND SEQUENCING', 'CRM INTEGRATION', 'INTENT SIGNALS', 'LEAD SCORING'].flatMap((label, i) => [
          <span key={`t${i}`}>{label}</span>,
          i < 5 ? <div key={`d${i}`} className="home-ticker-dot" /> : null,
        ])}
      </div>

      {/* ── Metrics ── */}
      <section className="home-metrics">
        {[
          { val: '50+', label: 'B2B Clients' },
          { val: '3.2x', label: 'Avg Pipeline Growth' },
          { val: '$12M+', label: 'Pipeline Generated' },
          { val: '240%', label: 'Reply Rate Increase' },
        ].flatMap((m, i) => [
          <div key={`m${i}`} className="home-metric">
            <span className="home-metric-val">{m.val}</span>
            <span className="home-metric-label">{m.label}</span>
          </div>,
          i < 3 ? <div key={`s${i}`} className="home-metric-sep" /> : null,
        ])}
      </section>

      {/* ── Services ── */}
      <section className="home-services" id="services">
        <div className="home-services-header">
          <span className="home-section-label">WHAT WE DO</span>
          <h2 className="home-section-h2">Three pillars of<br />predictable growth.</h2>
          <p className="home-section-desc">We don't just set up tools. We architect complete revenue engines.</p>
        </div>
        <div className="home-services-grid">
          <div className="home-service-card">
            <div className="home-service-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <div className="home-service-title">Data<br />Enrichment</div>
            <p className="home-service-desc">Enrich your ICP data with 40+ sources. Build laser-targeted prospect lists automatically.</p>
          </div>
          <div className="home-service-card accent">
            <div className="home-service-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </div>
            <div className="home-service-title">Outbound<br />Automation</div>
            <p className="home-service-desc">Multi-channel sequencing across email, LinkedIn, and phone. Personalized at scale.</p>
          </div>
          <div className="home-service-card">
            <div className="home-service-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            </div>
            <div className="home-service-title">Pipeline<br />Analytics</div>
            <p className="home-service-desc">Real-time dashboards showing exactly what's working and what needs optimization.</p>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="home-how" id="process">
        <div className="home-how-header">
          <span className="home-section-label">HOW IT WORKS</span>
          <h2 className="home-section-h2">From zero to pipeline<br />in 4 weeks.</h2>
        </div>
        <div className="home-steps">
          {[
            { num: '01', title: 'Audit & Strategy', desc: 'Deep dive into your ICP, existing processes, and tech stack to map the ideal GTM engine.' },
            { num: '02', title: 'Build & Integrate', desc: 'Set up data enrichment, sequencing tools, and CRM integrations tailored to your workflow.' },
            { num: '03', title: 'Launch & Optimize', desc: 'Go live with full sequences. We monitor, A/B test, and optimize for maximum pipeline.' },
            { num: '04', title: 'Scale & Expand', desc: 'Once proven, we expand to new verticals, channels, and territories. Compounding growth.' },
          ].flatMap((step, i) => [
            <div key={`step${i}`} className="home-step">
              <span className="home-step-num">{step.num}</span>
              <span className="home-step-title">{step.title}</span>
              <p className="home-step-desc">{step.desc}</p>
            </div>,
            i < 3 ? <div key={`sep${i}`} className="home-step-sep" /> : null,
          ])}
        </div>
      </section>

      {/* ── Social Proof ── */}
      <section className="home-proof" id="proof">
        <div className="home-proof-header">
          <div className="home-proof-left">
            <span className="home-section-label">SOCIAL PROOF</span>
            <h2 className="home-section-h2">Trusted by revenue teams<br />across B2B SaaS.</h2>
          </div>
          <p className="home-proof-right">
            We've helped 50+ companies build predictable pipelines. Here's what they say.
          </p>
        </div>
        <div className="home-testimonials">
          <div className="home-testimonials-col">
            <Testimonial
              quote='"Kommercieel transformed our outbound. We went from 2 meetings/week to 15 in just 6 weeks."'
              name="Sarah Johnson"
              role="VP Sales, TechCorp"
              initials="SJ"
            />
            <Testimonial
              quote='"The data enrichment alone saved us 20 hours per week. Our SDR team finally focuses on selling, not researching."'
              name="Mark Rivera"
              role="Head of Growth, ScaleUp"
              initials="MR"
              alt
            />
          </div>
          <div className="home-testimonials-col">
            <Testimonial
              quote='"Finally, an agency that actually understands B2B outbound. Not just tools, but real strategy."'
              name="Anna Kim"
              role="CEO, DataFlow"
              initials="AK"
              alt
            />
            <Testimonial
              quote='"Our reply rate went from 2% to 9% in the first month. The ROI was immediate and undeniable."'
              name="David Lee"
              role="CRO, RevStack"
              initials="DL"
            />
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="home-cta-section">
        <div className="home-cta-orbit" style={{ width: 300, height: 300, top: -80, left: -80 }} />
        <div className="home-cta-orbit" style={{ width: 400, height: 400, bottom: -50, right: -100 }} />
        <div className="home-cta-content">
          <span className="home-section-label">READY TO GROW?</span>
          <h2 className="home-section-h2">Let's build your<br />GTM engine.</h2>
          <p className="home-section-desc">
            Book a 15-minute discovery call. No commitment, no pitch deck.<br />
            Just an honest conversation about your pipeline.
          </p>
          <div className="home-cta-btns">
            <a href={CALENDLY} className="btn-primary" target="_blank" rel="noopener noreferrer">
              Book a Discovery Call <ArrowIcon />
            </a>
            <Link to="/engine" className="btn-outline">View Case Studies</Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="home-footer">
        <div className="home-footer-top">
          <div className="home-footer-brand">
            <span className="home-footer-logo">kommercieel</span>
            <p className="home-footer-tagline">
              Building GTM engines for B2B SaaS companies that want predictable, scalable growth.
            </p>
          </div>
          <div className="home-footer-col">
            <span className="home-footer-col-title">Services</span>
            <a href="#services">Data Enrichment</a>
            <a href="#services">Outbound Automation</a>
            <a href="#services">Pipeline Analytics</a>
            <a href="#services">CRM Integration</a>
          </div>
          <div className="home-footer-col">
            <span className="home-footer-col-title">Company</span>
            <a href="#proof">About</a>
            <a href="#proof">Case Studies</a>
            <Link to="/engine">Engine</Link>
            <Link to="/gtm-engineers">Careers</Link>
          </div>
          <div className="home-footer-col">
            <span className="home-footer-col-title">Legal</span>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
        <div className="home-footer-bottom">
          <span className="home-footer-copy">© 2026 Kommercieel. All rights reserved.</span>
          <a href="mailto:info@kommercieel.com" className="home-footer-email">info@kommercieel.com</a>
        </div>
      </footer>
    </div>
  );
}

function Testimonial({ quote, name, role, initials, alt }: {
  quote: string; name: string; role: string; initials: string; alt?: boolean;
}) {
  return (
    <div className={`home-testimonial${alt ? ' alt' : ''}`}>
      <p className="home-testimonial-quote">{quote}</p>
      <div className="home-testimonial-author">
        <div className="home-testimonial-avatar">{initials}</div>
        <div>
          <div className="home-testimonial-name">{name}</div>
          <div className="home-testimonial-role">{role}</div>
        </div>
      </div>
    </div>
  );
}

function HeroGraphics() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 660 600" fill="none">
      {/* Orbit rings */}
      <ellipse cx="330" cy="290" rx="240" ry="240" stroke="var(--home-orbit-stroke)" strokeWidth="1" transform="rotate(15 330 290)" />
      <ellipse cx="330" cy="290" rx="200" ry="200" stroke="var(--home-orbit-stroke)" strokeWidth="1" transform="rotate(-10 330 290)" />
      <ellipse cx="330" cy="290" rx="140" ry="140" stroke="var(--home-orbit-stroke)" strokeWidth="1.5" transform="rotate(25 330 290)" />
      {/* Center dot */}
      <circle cx="320" cy="290" r="25" fill="var(--home-orbit-dot)" />
      {/* Orbit dots */}
      <circle cx="548" cy="278" r="8" fill="var(--home-orbit-dot)" />
      <circle cx="308" cy="56" r="6" fill="var(--home-text-muted)" />
      <circle cx="138" cy="406" r="5" fill="var(--home-accent-sub)" />
      <circle cx="468" cy="478" r="7" fill="var(--home-accent-sub)" />
      {/* Float rectangles */}
      <rect x="540" y="150" width="60" height="60" rx="2" transform="rotate(45 570 180)" stroke="var(--home-orbit-stroke)" strokeWidth="1" fill="var(--home-bg2)" />
      <rect x="48" y="208" width="36" height="36" rx="2" transform="rotate(15 66 226)" fill="var(--home-orbit-dot)" />
      <rect x="408" y="36" width="28" height="28" rx="2" transform="rotate(-20 422 50)" stroke="var(--home-orbit-dot)" strokeWidth="1.5" fill="none" />
      {/* Dash lines */}
      <line x1="108" y1="128" x2="204" y2="178" stroke="var(--home-accent-sub)" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="428" y1="388" x2="508" y2="358" stroke="var(--home-accent-sub)" strokeWidth="1" strokeDasharray="4 4" />
      {/* Float Card 1 */}
      <g>
        <rect x="438" y="148" width="180" height="108" rx="12" fill="var(--home-bg)" stroke="var(--home-orbit-stroke)" strokeWidth="1" />
        <text x="454" y="174" fill="var(--home-text-dim)" fontSize="11" fontFamily="Inter" fontWeight="500">Pipeline Value</text>
        <text x="454" y="206" fill="var(--home-text)" fontSize="28" fontFamily="Outfit" fontWeight="900" letterSpacing="-1">$2.4M</text>
        <circle cx="454" cy="232" r="4" fill="var(--home-accent-teal)" />
        <text x="464" y="236" fill="var(--home-accent-teal)" fontSize="11" fontFamily="Inter" fontWeight="500">+32% this month</text>
      </g>
      {/* Float Card 2 */}
      <g>
        <rect x="28" y="348" width="160" height="88" rx="12" fill="var(--home-accent)" />
        <text x="42" y="374" fill="var(--home-accent-sub)" fontSize="11" fontFamily="Inter" fontWeight="500">Meetings Booked</text>
        <text x="42" y="410" fill="var(--home-bg)" fontSize="32" fontFamily="Outfit" fontWeight="900" letterSpacing="-1">147</text>
      </g>
      {/* Float Card 3 */}
      <g>
        <rect x="348" y="428" width="200" height="36" rx="18" fill="var(--home-bg)" stroke="var(--home-orbit-stroke)" strokeWidth="1" />
        <circle cx="366" cy="446" r="4" fill="var(--home-accent-teal)" />
        <text x="378" y="450" fill="var(--home-text-muted)" fontSize="12" fontFamily="Inter" fontWeight="500">Syncing 12 data sources</text>
      </g>
    </svg>
  );
}
