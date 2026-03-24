import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const CALENDLY = 'https://calendly.com/rickvandenkommer/new-meeting';

const ENGINE_SECTIONS = [
  { name: 'Asset Engine', type: 'engine' },
  { name: 'Data Layer', type: 'layer' },
  { name: 'Signal Engine', type: 'engine' },
  { name: 'Enrichment Layer', type: 'layer' },
  { name: 'Outbound Engine', type: 'engine' },
  { name: 'Feedback Layer', type: 'layer' },
] as const;

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

  const [engineActive, setEngineActive] = useState(0);
  const engineWrapRef = useRef<HTMLDivElement>(null);
  const gearSvgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('kc-theme', theme);
  }, [theme]);

  // Engine scroll logic
  useEffect(() => {
    const handleScroll = () => {
      const el = engineWrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const scrolled = -rect.top;
      if (scrolled < 0 || scrolled > scrollable) return;
      const progress = Math.max(0, Math.min(1, scrolled / scrollable));
      const index = Math.min(5, Math.floor(progress * 6));
      setEngineActive(index);
      if (gearSvgRef.current) {
        gearSvgRef.current.style.transform = `rotate(${-progress * 360}deg)`;
      }
      const sat1 = document.getElementById('home-sat-1');
      const sat2 = document.getElementById('home-sat-2');
      if (sat1) sat1.style.transform = `rotate(${progress * 360 * 1.6}deg)`;
      if (sat2) sat2.style.transform = `rotate(${progress * 360 * 2.1}deg)`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Tooth highlighting
  useEffect(() => {
    for (let i = 0; i < 6; i++) {
      const t = document.getElementById('home-tooth-' + i);
      if (!t) continue;
      const isActive = i === engineActive;
      const isEngine = ENGINE_SECTIONS[i].type === 'engine';
      if (isEngine) {
        const rect = t.querySelector('rect');
        if (rect) {
          rect.setAttribute('fill', isActive ? 'rgba(200,169,110,0.42)' : 'rgba(200,169,110,0.07)');
          rect.setAttribute('stroke', isActive ? 'rgba(200,169,110,0.95)' : 'rgba(200,169,110,0.2)');
          rect.setAttribute('stroke-width', isActive ? '2.5' : '1');
        }
      } else {
        const polys = t.querySelectorAll('polygon');
        const dot = t.querySelector('circle');
        if (polys[0]) {
          polys[0].setAttribute('fill', isActive ? 'rgba(122,184,164,0.28)' : 'rgba(122,184,164,0.08)');
          polys[0].setAttribute('stroke', isActive ? 'rgba(122,184,164,0.95)' : 'rgba(122,184,164,0.35)');
          polys[0].setAttribute('stroke-width', isActive ? '2' : '1.5');
        }
        if (polys[1]) polys[1].setAttribute('fill', isActive ? 'rgba(122,184,164,0.55)' : 'rgba(122,184,164,0.2)');
        if (dot) {
          dot.setAttribute('fill', isActive ? 'rgba(122,184,164,1)' : 'rgba(122,184,164,0.45)');
          dot.setAttribute('r', isActive ? '5' : '3.5');
        }
      }
    }
  }, [engineActive]);

  const toggle = () => setTheme(t => t === 'light' ? 'dark' : 'light');
  const isLayer = ENGINE_SECTIONS[engineActive].type === 'layer';

  return (
    <div className="home-page">
      {/* ── Header ── */}
      <header className="home-header">
        <Link to="/" className="home-header-logo">kommercieel</Link>
        <nav className="home-header-nav">
          <a href="#services">Services</a>
          <a href="#engine">Engine</a>
          <a href="#process">Process</a>
          <Link to="/gtm-engineers">GTM Engineers</Link>
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
            <a href="#engine" className="btn-outline">See Our Engine</a>
          </div>
        </div>
        <div className="home-hero-gfx">
          <HeroGraphics />
        </div>
      </section>

      {/* ── Engine Section ── */}
      <section className="engine-section" id="engine" ref={engineWrapRef}>
        <div className="engine-sticky">
          <div className="engine-gear-side">
            <div className="engine-gear-wrap">
              <svg ref={gearSvgRef} className="engine-gear" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="eng-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(200,169,110,0.1)" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                </defs>
                <circle cx="400" cy="400" r="390" fill="url(#eng-glow)" />

                {/* Outer ticks */}
                <g opacity="0.1" stroke="var(--eng-tick)" strokeWidth="1">
                  {Array.from({ length: 24 }, (_, i) => {
                    const angle = i * 15;
                    const isMajor = angle % 60 === 0;
                    const isMid = angle % 30 === 0 && !isMajor;
                    const y1 = isMajor ? 22 : 28;
                    const y2 = isMajor ? 44 : isMid ? 38 : 38;
                    return (
                      <g key={i} transform={`rotate(${angle},400,400)`}>
                        <line x1="400" y1={y1} x2="400" y2={y2} />
                      </g>
                    );
                  })}
                </g>

                {/* Orbit rings */}
                <circle cx="400" cy="400" r="358" stroke="var(--eng-orbit)" strokeWidth="1" />
                <circle cx="400" cy="400" r="298" stroke="var(--eng-orbit-mid)" strokeWidth="1" strokeDasharray="3 9" />
                <circle cx="400" cy="400" r="244" stroke="var(--eng-orbit-strong)" strokeWidth="1" />
                <circle cx="400" cy="400" r="188" stroke="rgba(200,169,110,0.08)" strokeWidth="1.5" />
                <circle cx="400" cy="400" r="128" stroke="var(--eng-orbit-strong)" strokeWidth="1" />

                {/* Gear body */}
                <circle cx="400" cy="400" r="178" fill="rgba(200,169,110,0.025)" stroke="rgba(200,169,110,0.2)" strokeWidth="1.5" />

                {/* TOOTH 0 — Asset Engine */}
                <g id="home-tooth-0" style={{ transformOrigin: '400px 400px' }}>
                  <rect x="376" y="186" width="48" height="36" rx="5" fill="rgba(200,169,110,0.35)" stroke="rgba(200,169,110,0.8)" strokeWidth="2" />
                  <rect x="384" y="198" width="32" height="4" rx="2" fill="rgba(200,169,110,0.6)" />
                  <rect x="384" y="206" width="20" height="3" rx="1.5" fill="rgba(200,169,110,0.3)" />
                </g>

                {/* TOOTH 1 — Data Layer */}
                <g id="home-tooth-1" style={{ transformOrigin: '400px 400px' }} transform="rotate(60,400,400)">
                  <polygon points="400,188 416,204 400,220 384,204" fill="rgba(122,184,164,0.15)" stroke="rgba(122,184,164,0.6)" strokeWidth="1.5" />
                  <polygon points="400,196 408,204 400,212 392,204" fill="rgba(122,184,164,0.35)" />
                  <circle cx="400" cy="204" r="3.5" fill="rgba(122,184,164,0.7)" />
                </g>

                {/* TOOTH 2 — Signal Engine */}
                <g id="home-tooth-2" style={{ transformOrigin: '400px 400px' }} transform="rotate(120,400,400)">
                  <rect x="376" y="186" width="48" height="36" rx="5" fill="rgba(200,169,110,0.07)" stroke="rgba(200,169,110,0.2)" strokeWidth="1" />
                  <rect x="384" y="198" width="32" height="4" rx="2" fill="rgba(200,169,110,0.2)" />
                </g>

                {/* TOOTH 3 — Enrichment Layer */}
                <g id="home-tooth-3" style={{ transformOrigin: '400px 400px' }} transform="rotate(180,400,400)">
                  <polygon points="400,188 416,204 400,220 384,204" fill="rgba(122,184,164,0.08)" stroke="rgba(122,184,164,0.35)" strokeWidth="1.5" />
                  <polygon points="400,196 408,204 400,212 392,204" fill="rgba(122,184,164,0.2)" />
                  <circle cx="400" cy="204" r="3.5" fill="rgba(122,184,164,0.45)" />
                </g>

                {/* TOOTH 4 — Outbound Engine */}
                <g id="home-tooth-4" style={{ transformOrigin: '400px 400px' }} transform="rotate(240,400,400)">
                  <rect x="376" y="186" width="48" height="36" rx="5" fill="rgba(200,169,110,0.07)" stroke="rgba(200,169,110,0.2)" strokeWidth="1" />
                  <rect x="384" y="198" width="32" height="4" rx="2" fill="rgba(200,169,110,0.2)" />
                </g>

                {/* TOOTH 5 — Feedback Layer */}
                <g id="home-tooth-5" style={{ transformOrigin: '400px 400px' }} transform="rotate(300,400,400)">
                  <polygon points="400,188 416,204 400,220 384,204" fill="rgba(122,184,164,0.08)" stroke="rgba(122,184,164,0.35)" strokeWidth="1.5" />
                  <polygon points="400,196 408,204 400,212 392,204" fill="rgba(122,184,164,0.2)" />
                  <circle cx="400" cy="204" r="3.5" fill="rgba(122,184,164,0.45)" />
                </g>

                {/* Spokes */}
                <g stroke="rgba(200,169,110,0.09)" strokeWidth="1.5">
                  {[0, 60, 120, 180, 240, 300].map(angle => (
                    <g key={angle} transform={`rotate(${angle},400,400)`}>
                      <line x1="400" y1="272" x2="400" y2="224" />
                    </g>
                  ))}
                </g>

                {/* Inner rings */}
                <circle cx="400" cy="400" r="88" stroke="rgba(200,169,110,0.1)" strokeWidth="1" strokeDasharray="3 7" />
                <circle cx="400" cy="400" r="58" fill="rgba(200,169,110,0.04)" stroke="rgba(200,169,110,0.16)" strokeWidth="1.5" />
                <circle cx="400" cy="400" r="26" fill="rgba(200,169,110,0.12)" stroke="rgba(200,169,110,0.35)" strokeWidth="2" />
                <circle cx="400" cy="400" r="9" fill="rgba(200,169,110,0.7)" />

                {/* Center bolt */}
                <line x1="400" y1="374" x2="400" y2="390" stroke="var(--eng-bolt)" strokeWidth="2.5" />
                <line x1="400" y1="410" x2="400" y2="426" stroke="var(--eng-bolt)" strokeWidth="2.5" />
                <line x1="374" y1="400" x2="390" y2="400" stroke="var(--eng-bolt)" strokeWidth="2.5" />
                <line x1="410" y1="400" x2="426" y2="400" stroke="var(--eng-bolt)" strokeWidth="2.5" />

                {/* Inner holes */}
                <g fill="var(--eng-hole)" stroke="rgba(200,169,110,0.1)" strokeWidth="1">
                  {[0, 60, 120, 180, 240, 300].map(angle => (
                    <g key={angle} transform={`rotate(${angle},400,400)`}>
                      <circle cx="400" cy="344" r="5" />
                    </g>
                  ))}
                </g>

                {/* Satellite gear top-right */}
                <g transform="translate(575,172)" id="home-sat-1">
                  <circle cx="0" cy="0" r="46" fill="rgba(200,169,110,0.02)" stroke="rgba(200,169,110,0.16)" strokeWidth="1" />
                  <circle cx="0" cy="0" r="18" fill="rgba(200,169,110,0.06)" stroke="rgba(200,169,110,0.16)" strokeWidth="1" />
                  <circle cx="0" cy="0" r="6" fill="rgba(200,169,110,0.26)" />
                  <rect x="-6" y="-56" width="12" height="14" rx="2" fill="rgba(200,169,110,0.16)" />
                  <rect x="-6" y="42" width="12" height="14" rx="2" fill="rgba(200,169,110,0.16)" />
                  <rect x="-56" y="-6" width="14" height="12" rx="2" fill="rgba(200,169,110,0.16)" />
                  <rect x="42" y="-6" width="14" height="12" rx="2" fill="rgba(200,169,110,0.16)" />
                  <g transform="rotate(45)">
                    <rect x="-6" y="-56" width="12" height="14" rx="2" fill="rgba(200,169,110,0.09)" />
                    <rect x="-6" y="42" width="12" height="14" rx="2" fill="rgba(200,169,110,0.09)" />
                    <rect x="-56" y="-6" width="14" height="12" rx="2" fill="rgba(200,169,110,0.09)" />
                    <rect x="42" y="-6" width="14" height="12" rx="2" fill="rgba(200,169,110,0.09)" />
                  </g>
                  <line x1="0" y1="-12" x2="0" y2="12" stroke="var(--eng-bolt)" strokeWidth="1.5" />
                  <line x1="-12" y1="0" x2="12" y2="0" stroke="var(--eng-bolt)" strokeWidth="1.5" />
                </g>

                {/* Satellite gear bottom-left */}
                <g transform="translate(198,598)" id="home-sat-2">
                  <circle cx="0" cy="0" r="34" fill="rgba(200,169,110,0.02)" stroke="rgba(200,169,110,0.1)" strokeWidth="1" />
                  <circle cx="0" cy="0" r="13" fill="rgba(200,169,110,0.05)" stroke="rgba(200,169,110,0.1)" strokeWidth="1" />
                  <circle cx="0" cy="0" r="4" fill="rgba(200,169,110,0.2)" />
                  <rect x="-5" y="-44" width="10" height="12" rx="2" fill="rgba(200,169,110,0.12)" />
                  <rect x="-5" y="32" width="10" height="12" rx="2" fill="rgba(200,169,110,0.12)" />
                  <rect x="-44" y="-5" width="12" height="10" rx="2" fill="rgba(200,169,110,0.12)" />
                  <rect x="32" y="-5" width="12" height="10" rx="2" fill="rgba(200,169,110,0.12)" />
                </g>

                {/* Dashed connectors */}
                <line x1="548" y1="215" x2="523" y2="225" stroke="var(--eng-orbit-strong)" strokeWidth="1" strokeDasharray="3 7" />
                <line x1="228" y1="564" x2="242" y2="548" stroke="var(--eng-orbit-strong)" strokeWidth="1" strokeDasharray="3 7" />
              </svg>
            </div>
          </div>

          <div className={`engine-content-side${isLayer ? ' teal' : ''}`}>
            <div className="engine-panels">
              {/* 0: Asset Engine */}
              <div className={`engine-panel${engineActive === 0 ? ' active' : ''}`}>
                <div className="ep-num">01</div>
                <div className="ep-tag">Engine</div>
                <h2 className="ep-title">Prospects find <em>you</em> first</h2>
                <p className="ep-desc">Content and lead magnets that pull your ICP in — before you ever send a cold email. Your best outbound starts with inbound.</p>
                <ul className="ep-items">
                  <li>LinkedIn content built around real proof points</li>
                  <li>Gated playbooks that attract ICP-matched founders</li>
                  <li>Community as an always-on trust engine</li>
                  <li>Diagnostic offer as lowest-friction entry point</li>
                </ul>
                <div className="ep-bottom">
                  <div className="ep-stat">
                    <span className="ep-stat-num">34%</span>
                    <span className="ep-stat-label">Reply rate on asset-led outbound</span>
                  </div>
                  <a href={CALENDLY} className="ep-cta" target="_blank" rel="noopener noreferrer">Book a Call &rarr;</a>
                </div>
              </div>

              {/* 1: Data Layer */}
              <div className={`engine-panel is-layer${engineActive === 1 ? ' active' : ''}`}>
                <div className="ep-layer-tag">Connection Layer</div>
                <div className="ep-bridge">
                  <div className="ep-bridge-node">Asset Engine</div>
                  <div className="ep-bridge-line" data-label="feeds into" />
                  <div className="ep-bridge-node">Signal Engine</div>
                </div>
                <h2 className="ep-layer-title">Clean data,<br /><em>zero guesswork</em></h2>
                <p className="ep-layer-desc">The foundation connecting what you publish to who you target. Every lead is sourced, verified, and scored before anyone touches it.</p>
                <ul className="ep-layer-items">
                  <li>LinkedIn Sales Nav for real-time prospect sourcing</li>
                  <li>Waterfall enrichment across 12+ data providers</li>
                  <li>Verified emails, direct dials, tech stack, funding data</li>
                  <li>Refreshed weekly — no stale lists, no bounced emails</li>
                </ul>
                <div className="ep-bottom">
                  <div className="ep-stat layer">
                    <span className="ep-stat-num">40+</span>
                    <span className="ep-stat-label">Data points per prospect</span>
                  </div>
                  <a href={CALENDLY} className="ep-cta layer" target="_blank" rel="noopener noreferrer">Book a Call &rarr;</a>
                </div>
              </div>

              {/* 2: Signal Engine */}
              <div className={`engine-panel${engineActive === 2 ? ' active' : ''}`}>
                <div className="ep-num">02</div>
                <div className="ep-tag">Engine</div>
                <h2 className="ep-title">Know who's ready <em>this week</em></h2>
                <p className="ep-desc">Intent signals that surface buyers actively researching your category — so you reach them at the right moment, not on an arbitrary cadence.</p>
                <ul className="ep-items">
                  <li>Competitor content engagers (likers, commenters)</li>
                  <li>Hiring signals: GTM, SDR, and sales roles</li>
                  <li>Tech stack adoption signals (Clay, Instantly, Apollo)</li>
                  <li>ICP filter: B2B SaaS founders, Seed to Series B</li>
                </ul>
                <div className="ep-bottom">
                  <div className="ep-stat">
                    <span className="ep-stat-num">3x</span>
                    <span className="ep-stat-label">Higher conversion vs cold lists</span>
                  </div>
                  <a href={CALENDLY} className="ep-cta" target="_blank" rel="noopener noreferrer">Book a Call &rarr;</a>
                </div>
              </div>

              {/* 3: Enrichment Layer */}
              <div className={`engine-panel is-layer${engineActive === 3 ? ' active' : ''}`}>
                <div className="ep-layer-tag">Connection Layer</div>
                <div className="ep-bridge">
                  <div className="ep-bridge-node">Signal Engine</div>
                  <div className="ep-bridge-line" data-label="enriches" />
                  <div className="ep-bridge-node">Outbound Engine</div>
                </div>
                <h2 className="ep-layer-title">Every message<br /><em>feels personal</em></h2>
                <p className="ep-layer-desc">Turns raw signals into personalized context. Every contact gets scored, enriched, and loaded with personalization tokens before a single sequence fires.</p>
                <ul className="ep-layer-items">
                  <li>Automated enrichment via Bitscale + Clay waterfall</li>
                  <li>Role, tech stack, and growth stage per prospect</li>
                  <li>ICP scoring so your SDR talks to buyers, not tourists</li>
                  <li>Auto-personalization tokens for every sequence</li>
                </ul>
                <div className="ep-bottom">
                  <div className="ep-stat layer">
                    <span className="ep-stat-num">20h</span>
                    <span className="ep-stat-label">Saved per week on SDR research</span>
                  </div>
                  <a href={CALENDLY} className="ep-cta layer" target="_blank" rel="noopener noreferrer">Book a Call &rarr;</a>
                </div>
              </div>

              {/* 4: Outbound Engine */}
              <div className={`engine-panel${engineActive === 4 ? ' active' : ''}`}>
                <div className="ep-num">03</div>
                <div className="ep-tag">Engine</div>
                <h2 className="ep-title">Meetings that <em>book themselves</em></h2>
                <p className="ep-desc">Multi-channel sequences triggered by intent, not arbitrary cadence. Email + LinkedIn working together so your calendar fills while you build product.</p>
                <ul className="ep-items">
                  <li>Cold email sequences scored by live signal data</li>
                  <li>LinkedIn DM flows tied to content engagement</li>
                  <li>Personalized value props per ICP segment</li>
                  <li>Pipeline automation: replies route straight to your CRM</li>
                </ul>
                <div className="ep-bottom">
                  <div className="ep-stat">
                    <span className="ep-stat-num">460</span>
                    <span className="ep-stat-label">Replies from 2,600 leads</span>
                  </div>
                  <a href={CALENDLY} className="ep-cta" target="_blank" rel="noopener noreferrer">Book a Call &rarr;</a>
                </div>
              </div>

              {/* 5: Feedback Layer */}
              <div className={`engine-panel is-layer${engineActive === 5 ? ' active' : ''}`}>
                <div className="ep-layer-tag">Connection Layer</div>
                <div className="ep-bridge">
                  <div className="ep-bridge-node">Outbound Engine</div>
                  <div className="ep-bridge-line" data-label="compounds into" />
                  <div className="ep-bridge-node">Asset Engine</div>
                </div>
                <h2 className="ep-layer-title">Gets smarter<br /><em>every cycle</em></h2>
                <p className="ep-layer-desc">The loop that closes the flywheel. Every reply, every booking, every close feeds back into targeting and content — so month 6 outperforms month 1 by default.</p>
                <ul className="ep-layer-items">
                  <li>Reply rates and meeting data tracked per sequence</li>
                  <li>Winning messages recycled into new content assets</li>
                  <li>ICP definition sharpened every 30 days from real data</li>
                  <li>Compounding returns: same spend, better results each month</li>
                </ul>
                <div className="ep-bottom">
                  <div className="ep-stat layer">
                    <span className="ep-stat-num">&infin;</span>
                    <span className="ep-stat-label">Compounding loop</span>
                  </div>
                  <a href={CALENDLY} className="ep-cta layer" target="_blank" rel="noopener noreferrer">Book a Call &rarr;</a>
                </div>
              </div>
            </div>
          </div>

          {/* Counter dots */}
          <div className="engine-counter">
            <div className="engine-counter-dots">
              {ENGINE_SECTIONS.map((s, i) => (
                <div key={i} className={`engine-dot ${s.type}-dot${i === engineActive ? ' active' : ''}`} />
              ))}
            </div>
            <span className={`engine-counter-label${isLayer ? ' teal' : ''}`}>{ENGINE_SECTIONS[engineActive].name}</span>
          </div>
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
            <a href="#engine" className="btn-outline">View Our Engine</a>
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
            <a href="#engine">Engine</a>
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
          <span className="home-footer-copy">&copy; 2026 Kommercieel. All rights reserved.</span>
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
      <ellipse cx="330" cy="290" rx="240" ry="240" stroke="var(--home-orbit-stroke)" strokeWidth="1" transform="rotate(15 330 290)" />
      <ellipse cx="330" cy="290" rx="200" ry="200" stroke="var(--home-orbit-stroke)" strokeWidth="1" transform="rotate(-10 330 290)" />
      <ellipse cx="330" cy="290" rx="140" ry="140" stroke="var(--home-orbit-stroke)" strokeWidth="1.5" transform="rotate(25 330 290)" />
      <circle cx="320" cy="290" r="25" fill="var(--home-orbit-dot)" />
      <circle cx="548" cy="278" r="8" fill="var(--home-orbit-dot)" />
      <circle cx="308" cy="56" r="6" fill="var(--home-text-muted)" />
      <circle cx="138" cy="406" r="5" fill="var(--home-accent-sub)" />
      <circle cx="468" cy="478" r="7" fill="var(--home-accent-sub)" />
      <rect x="540" y="150" width="60" height="60" rx="2" transform="rotate(45 570 180)" stroke="var(--home-orbit-stroke)" strokeWidth="1" fill="var(--home-bg2)" />
      <rect x="48" y="208" width="36" height="36" rx="2" transform="rotate(15 66 226)" fill="var(--home-orbit-dot)" />
      <rect x="408" y="36" width="28" height="28" rx="2" transform="rotate(-20 422 50)" stroke="var(--home-orbit-dot)" strokeWidth="1.5" fill="none" />
      <line x1="108" y1="128" x2="204" y2="178" stroke="var(--home-accent-sub)" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="428" y1="388" x2="508" y2="358" stroke="var(--home-accent-sub)" strokeWidth="1" strokeDasharray="4 4" />
      <g>
        <rect x="438" y="148" width="180" height="108" rx="12" fill="var(--home-bg)" stroke="var(--home-orbit-stroke)" strokeWidth="1" />
        <text x="454" y="174" fill="var(--home-text-dim)" fontSize="11" fontFamily="Inter" fontWeight="500">Pipeline Value</text>
        <text x="454" y="206" fill="var(--home-text)" fontSize="28" fontFamily="Outfit" fontWeight="900" letterSpacing="-1">$2.4M</text>
        <circle cx="454" cy="232" r="4" fill="var(--home-accent-teal)" />
        <text x="464" y="236" fill="var(--home-accent-teal)" fontSize="11" fontFamily="Inter" fontWeight="500">+32% this month</text>
      </g>
      <g>
        <rect x="28" y="348" width="160" height="88" rx="12" fill="var(--home-accent)" />
        <text x="42" y="374" fill="var(--home-accent-sub)" fontSize="11" fontFamily="Inter" fontWeight="500">Meetings Booked</text>
        <text x="42" y="410" fill="var(--home-bg)" fontSize="32" fontFamily="Outfit" fontWeight="900" letterSpacing="-1">147</text>
      </g>
      <g>
        <rect x="348" y="428" width="200" height="36" rx="18" fill="var(--home-bg)" stroke="var(--home-orbit-stroke)" strokeWidth="1" />
        <circle cx="366" cy="446" r="4" fill="var(--home-accent-teal)" />
        <text x="378" y="450" fill="var(--home-text-muted)" fontSize="12" fontFamily="Inter" fontWeight="500">Syncing 12 data sources</text>
      </g>
    </svg>
  );
}
