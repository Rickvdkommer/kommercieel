import { useEffect, useRef, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import engineStyles from './Engine.css?inline';

const CALENDLY = 'https://calendly.com/rickvandenkommer/new-meeting';

const SECTIONS = [
  { name: 'Asset Engine', type: 'engine' },
  { name: 'Data Layer', type: 'layer' },
  { name: 'Signal Engine', type: 'engine' },
  { name: 'Enrichment Layer', type: 'layer' },
  { name: 'Outbound Engine', type: 'engine' },
  { name: 'Feedback Layer', type: 'layer' },
] as const;

const STEP = 60;
const SCROLL_THRESHOLD = 220;
const LIVE_SENSITIVITY = 0.055;

export default function Engine() {
  const [sectionIndex, setSectionIndex] = useState(0);
  const totalStepsRef = useRef(0);
  const displayRotationRef = useRef(0);
  const liveOffsetRef = useRef(0);
  const scrollAccumRef = useRef(0);
  const snapTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const hasScrolledRef = useRef(false);
  const sectionIndexRef = useRef(0);

  const engineRef = useRef<SVGSVGElement>(null);
  const curRef = useRef<HTMLDivElement>(null);
  const curRingRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);

  const mxRef = useRef(0);
  const myRef = useRef(0);
  const rxRef = useRef(0);
  const ryRef = useRef(0);

  const sec = SECTIONS[sectionIndex];
  const isLayer = sec.type === 'layer';

  // Cursor animation
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mxRef.current = e.clientX;
      myRef.current = e.clientY;
    };
    document.addEventListener('mousemove', handleMove);

    let raf: number;
    const animCur = () => {
      rxRef.current += (mxRef.current - rxRef.current) * 0.13;
      ryRef.current += (myRef.current - ryRef.current) * 0.13;
      if (curRef.current) {
        curRef.current.style.left = mxRef.current + 'px';
        curRef.current.style.top = myRef.current + 'px';
      }
      if (curRingRef.current) {
        curRingRef.current.style.left = rxRef.current + 'px';
        curRingRef.current.style.top = ryRef.current + 'px';
      }
      raf = requestAnimationFrame(animCur);
    };
    raf = requestAnimationFrame(animCur);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Rotation render loop
  useEffect(() => {
    let raf: number;
    const renderLoop = () => {
      const snapBase = -(totalStepsRef.current * STEP);
      const fullTarget = snapBase + liveOffsetRef.current;
      const diff = fullTarget - displayRotationRef.current;
      displayRotationRef.current += diff * 0.1;

      if (engineRef.current) {
        engineRef.current.style.transform = `rotate(${displayRotationRef.current}deg)`;
      }
      const sat1 = document.getElementById('sat-gear-1');
      const sat2 = document.getElementById('sat-gear-2');
      if (sat1) sat1.style.transform = `rotate(${-displayRotationRef.current * 1.6}deg)`;
      if (sat2) sat2.style.transform = `rotate(${-displayRotationRef.current * 2.1}deg)`;

      raf = requestAnimationFrame(renderLoop);
    };
    raf = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const updateSection = useCallback((newIndex: number, direction: number) => {
    const prevPanel = panelsRef.current[sectionIndexRef.current];
    const nextPanel = panelsRef.current[newIndex];

    if (prevPanel && prevPanel !== nextPanel) {
      prevPanel.classList.remove('active');
      prevPanel.classList.add(direction >= 0 ? 'exit-up' : 'exit-down');
      setTimeout(() => prevPanel.classList.remove('exit-up', 'exit-down'), 500);
    }
    if (nextPanel) {
      nextPanel.style.transform = direction >= 0 ? 'translateY(20px)' : 'translateY(-20px)';
      nextPanel.style.opacity = '0';
      nextPanel.style.visibility = 'visible';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        nextPanel.style.transform = '';
        nextPanel.style.opacity = '';
        nextPanel.classList.add('active');
      }));
    }

    sectionIndexRef.current = newIndex;
    setSectionIndex(newIndex);

    if (progressBarRef.current) {
      progressBarRef.current.style.width = ((newIndex / (SECTIONS.length - 1)) * 100) + '%';
    }
  }, []);

  const scheduleSnapBack = useCallback(() => {
    if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
    snapTimerRef.current = setTimeout(() => {
      const decay = () => {
        if (Math.abs(liveOffsetRef.current) < 0.3) { liveOffsetRef.current = 0; return; }
        liveOffsetRef.current *= 0.82;
        requestAnimationFrame(decay);
      };
      decay();
      scrollAccumRef.current = 0;
    }, 120);
  }, []);

  // Scroll/touch/keyboard
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const dy = e.deltaY;
      scrollAccumRef.current += dy;
      liveOffsetRef.current -= dy * LIVE_SENSITIVITY;
      liveOffsetRef.current = Math.max(-STEP * 0.6, Math.min(STEP * 0.6, liveOffsetRef.current));
      scheduleSnapBack();

      if (scrollAccumRef.current >= SCROLL_THRESHOLD) {
        scrollAccumRef.current -= SCROLL_THRESHOLD;
        liveOffsetRef.current = 0;
        totalStepsRef.current++;
        updateSection(((totalStepsRef.current % SECTIONS.length) + SECTIONS.length) % SECTIONS.length, 1);
        if (!hasScrolledRef.current) {
          hasScrolledRef.current = true;
          scrollHintRef.current?.classList.add('hidden');
        }
      } else if (scrollAccumRef.current <= -SCROLL_THRESHOLD) {
        scrollAccumRef.current += SCROLL_THRESHOLD;
        liveOffsetRef.current = 0;
        totalStepsRef.current--;
        updateSection(((totalStepsRef.current % SECTIONS.length) + SECTIONS.length) % SECTIONS.length, -1);
        if (!hasScrolledRef.current) {
          hasScrolledRef.current = true;
          scrollHintRef.current?.classList.add('hidden');
        }
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const handleTouchEnd = (e: TouchEvent) => {
      const delta = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(delta) > 50) {
        const dir = delta > 0 ? 1 : -1;
        liveOffsetRef.current = 0;
        totalStepsRef.current += dir;
        updateSection(((totalStepsRef.current % SECTIONS.length) + SECTIONS.length) % SECTIONS.length, dir);
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        liveOffsetRef.current = 0;
        totalStepsRef.current++;
        updateSection(((totalStepsRef.current % SECTIONS.length) + SECTIONS.length) % SECTIONS.length, 1);
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        liveOffsetRef.current = 0;
        totalStepsRef.current--;
        updateSection(((totalStepsRef.current % SECTIONS.length) + SECTIONS.length) % SECTIONS.length, -1);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKey);
    };
  }, [updateSection, scheduleSnapBack]);

  // Tooth highlighting
  useEffect(() => {
    for (let i = 0; i < 6; i++) {
      const t = document.getElementById('tooth-' + i);
      if (!t) continue;
      const isActive = i === sectionIndex;
      const isTooth = SECTIONS[i].type === 'engine';

      if (isTooth) {
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
  }, [sectionIndex]);

  // Cursor hover on links
  useEffect(() => {
    const links = document.querySelectorAll('a');
    const enter = () => {
      if (curRef.current) curRef.current.style.transform = 'translate(-50%,-50%) scale(2.5)';
      if (curRingRef.current) curRingRef.current.style.transform = 'translate(-50%,-50%) scale(1.5)';
    };
    const leave = () => {
      if (curRef.current) curRef.current.style.transform = 'translate(-50%,-50%) scale(1)';
      if (curRingRef.current) curRingRef.current.style.transform = 'translate(-50%,-50%) scale(1)';
    };
    links.forEach(l => { l.addEventListener('mouseenter', enter); l.addEventListener('mouseleave', leave); });
    return () => { links.forEach(l => { l.removeEventListener('mouseenter', enter); l.removeEventListener('mouseleave', leave); }); };
  });

  const panelCtaStyle = isLayer
    ? { borderColor: 'rgba(122,184,164,0.2)', color: 'rgba(122,184,164,0.7)' }
    : undefined;

  return (
    <>
      <style>{engineStyles}</style>
      <div className="grain" />
      <div
        id="cur"
        ref={curRef}
        style={{ background: isLayer ? 'var(--teal)' : 'var(--gold)' }}
      />
      <div
        id="cur-ring"
        ref={curRingRef}
        style={{ borderColor: isLayer ? 'rgba(122,184,164,0.4)' : 'rgba(200,169,110,0.35)' }}
      />
      <div
        className={`scroll-progress${isLayer ? ' teal' : ''}`}
        ref={progressBarRef}
        style={{ width: '0%' }}
      />

      <nav>
        <span className="logo"><Link to="/">Kommer<span>cieel</span></Link></span>
        <a href={CALENDLY} className="nav-cta">Book a Call →</a>
      </nav>

      <div className="scene">
        {/* ENGINE SIDE */}
        <div className="engine-side">
          <div className="engine-wrap">
            <svg ref={engineRef} id="main-engine" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="eng-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(200,169,110,0.1)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
              <circle cx="400" cy="400" r="390" fill="url(#eng-glow)" />

              {/* Outer ticks */}
              <g opacity="0.1" stroke="rgba(255,255,255,0.8)" strokeWidth="1">
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
              <circle cx="400" cy="400" r="358" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
              <circle cx="400" cy="400" r="298" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3 9" />
              <circle cx="400" cy="400" r="244" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              <circle cx="400" cy="400" r="188" stroke="rgba(200,169,110,0.08)" strokeWidth="1.5" />
              <circle cx="400" cy="400" r="128" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

              {/* Gear body */}
              <circle cx="400" cy="400" r="178" fill="rgba(200,169,110,0.025)" stroke="rgba(200,169,110,0.2)" strokeWidth="1.5" />

              {/* TOOTH 0 — Asset Engine */}
              <g id="tooth-0" style={{ transformOrigin: '400px 400px' }}>
                <rect x="376" y="186" width="48" height="36" rx="5" fill="rgba(200,169,110,0.35)" stroke="rgba(200,169,110,0.8)" strokeWidth="2" />
                <rect x="384" y="198" width="32" height="4" rx="2" fill="rgba(200,169,110,0.6)" />
                <rect x="384" y="206" width="20" height="3" rx="1.5" fill="rgba(200,169,110,0.3)" />
              </g>

              {/* TOOTH 1 — Data Layer */}
              <g id="tooth-1" style={{ transformOrigin: '400px 400px' }} transform="rotate(60,400,400)">
                <polygon points="400,188 416,204 400,220 384,204" fill="rgba(122,184,164,0.15)" stroke="rgba(122,184,164,0.6)" strokeWidth="1.5" />
                <polygon points="400,196 408,204 400,212 392,204" fill="rgba(122,184,164,0.35)" />
                <circle cx="400" cy="204" r="3.5" fill="rgba(122,184,164,0.7)" />
              </g>

              {/* TOOTH 2 — Signal Engine */}
              <g id="tooth-2" style={{ transformOrigin: '400px 400px' }} transform="rotate(120,400,400)">
                <rect x="376" y="186" width="48" height="36" rx="5" fill="rgba(200,169,110,0.07)" stroke="rgba(200,169,110,0.2)" strokeWidth="1" />
                <rect x="384" y="198" width="32" height="4" rx="2" fill="rgba(200,169,110,0.2)" />
              </g>

              {/* TOOTH 3 — Enrichment Layer */}
              <g id="tooth-3" style={{ transformOrigin: '400px 400px' }} transform="rotate(180,400,400)">
                <polygon points="400,188 416,204 400,220 384,204" fill="rgba(122,184,164,0.08)" stroke="rgba(122,184,164,0.35)" strokeWidth="1.5" />
                <polygon points="400,196 408,204 400,212 392,204" fill="rgba(122,184,164,0.2)" />
                <circle cx="400" cy="204" r="3.5" fill="rgba(122,184,164,0.45)" />
              </g>

              {/* TOOTH 4 — Outbound Engine */}
              <g id="tooth-4" style={{ transformOrigin: '400px 400px' }} transform="rotate(240,400,400)">
                <rect x="376" y="186" width="48" height="36" rx="5" fill="rgba(200,169,110,0.07)" stroke="rgba(200,169,110,0.2)" strokeWidth="1" />
                <rect x="384" y="198" width="32" height="4" rx="2" fill="rgba(200,169,110,0.2)" />
              </g>

              {/* TOOTH 5 — Feedback Layer */}
              <g id="tooth-5" style={{ transformOrigin: '400px 400px' }} transform="rotate(300,400,400)">
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
              <line x1="400" y1="374" x2="400" y2="390" stroke="rgba(0,0,0,0.5)" strokeWidth="2.5" />
              <line x1="400" y1="410" x2="400" y2="426" stroke="rgba(0,0,0,0.5)" strokeWidth="2.5" />
              <line x1="374" y1="400" x2="390" y2="400" stroke="rgba(0,0,0,0.5)" strokeWidth="2.5" />
              <line x1="410" y1="400" x2="426" y2="400" stroke="rgba(0,0,0,0.5)" strokeWidth="2.5" />

              {/* Inner holes */}
              <g fill="rgba(0,0,0,0.2)" stroke="rgba(200,169,110,0.1)" strokeWidth="1">
                {[0, 60, 120, 180, 240, 300].map(angle => (
                  <g key={angle} transform={`rotate(${angle},400,400)`}>
                    <circle cx="400" cy="344" r="5" />
                  </g>
                ))}
              </g>

              {/* Satellite gear top-right */}
              <g transform="translate(575,172)" id="sat-gear-1">
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
                <line x1="0" y1="-12" x2="0" y2="12" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />
                <line x1="-12" y1="0" x2="12" y2="0" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />
              </g>

              {/* Satellite gear bottom-left */}
              <g transform="translate(198,598)" id="sat-gear-2">
                <circle cx="0" cy="0" r="34" fill="rgba(200,169,110,0.02)" stroke="rgba(200,169,110,0.1)" strokeWidth="1" />
                <circle cx="0" cy="0" r="13" fill="rgba(200,169,110,0.05)" stroke="rgba(200,169,110,0.1)" strokeWidth="1" />
                <circle cx="0" cy="0" r="4" fill="rgba(200,169,110,0.2)" />
                <rect x="-5" y="-44" width="10" height="12" rx="2" fill="rgba(200,169,110,0.12)" />
                <rect x="-5" y="32" width="10" height="12" rx="2" fill="rgba(200,169,110,0.12)" />
                <rect x="-44" y="-5" width="12" height="10" rx="2" fill="rgba(200,169,110,0.12)" />
                <rect x="32" y="-5" width="12" height="10" rx="2" fill="rgba(200,169,110,0.12)" />
              </g>

              {/* Dashed connectors */}
              <line x1="548" y1="215" x2="523" y2="225" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="3 7" />
              <line x1="228" y1="564" x2="242" y2="548" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="3 7" />
            </svg>
          </div>

          <div className={`indicator${isLayer ? ' teal' : ''}`}>
            <div className="indicator-line" />
            <div className="indicator-tip" />
            <div className="indicator-label">{sec.type}</div>
          </div>
        </div>

        {/* CONTENT SIDE */}
        <div className={`content-side${isLayer ? ' teal' : ''}`}>
          <div className="panels">
            {/* 0: Asset Engine */}
            <div className="panel active" ref={el => { panelsRef.current[0] = el; }} data-index="0" data-type="engine">
              <div className="panel-num">01</div>
              <div className="panel-tag">Engine</div>
              <h2 className="panel-title">Prospects find <em>you</em> first</h2>
              <p className="panel-desc">Content and lead magnets that pull your ICP in — before you ever send a cold email. Your best outbound starts with inbound.</p>
              <ul className="panel-items">
                <li>LinkedIn content built around real proof points</li>
                <li>Gated playbooks that attract ICP-matched founders</li>
                <li>Community as an always-on trust engine</li>
                <li>Diagnostic offer as lowest-friction entry point</li>
              </ul>
              <div className="panel-bottom">
                <div className="panel-stat">
                  <span className="panel-stat-num">34%</span>
                  <span className="panel-stat-label">Reply rate on asset-led outbound</span>
                </div>
                <a href={CALENDLY} className="panel-cta">Book a Call →</a>
              </div>
            </div>

            {/* 1: Data Layer */}
            <div className="panel is-layer" ref={el => { panelsRef.current[1] = el; }} data-index="1" data-type="layer">
              <div className="layer-type-tag">Connection Layer</div>
              <div className="layer-bridge">
                <div className="bridge-node">Asset Engine</div>
                <div className="bridge-connector" data-label="feeds into" />
                <div className="bridge-node">Signal Engine</div>
              </div>
              <h2 className="layer-title">Clean data,<br /><em>zero guesswork</em></h2>
              <p className="layer-desc">The foundation connecting what you publish to who you target. Every lead is sourced, verified, and scored before anyone touches it.</p>
              <ul className="layer-items">
                <li>LinkedIn Sales Nav for real-time prospect sourcing</li>
                <li>Waterfall enrichment across 12+ data providers</li>
                <li>Verified emails, direct dials, tech stack, funding data</li>
                <li>Refreshed weekly — no stale lists, no bounced emails</li>
              </ul>
              <div className="panel-bottom">
                <div className="layer-stat panel-stat">
                  <span className="panel-stat-num">40+</span>
                  <span className="panel-stat-label">Data points per prospect</span>
                </div>
                <a href={CALENDLY} className="panel-cta" style={panelCtaStyle}>Book a Call →</a>
              </div>
            </div>

            {/* 2: Signal Engine */}
            <div className="panel" ref={el => { panelsRef.current[2] = el; }} data-index="2" data-type="engine">
              <div className="panel-num">02</div>
              <div className="panel-tag">Engine</div>
              <h2 className="panel-title">Know who's ready <em>this week</em></h2>
              <p className="panel-desc">Intent signals that surface buyers actively researching your category — so you reach them at the right moment, not on an arbitrary cadence.</p>
              <ul className="panel-items">
                <li>Competitor content engagers (likers, commenters)</li>
                <li>Hiring signals: GTM, SDR, and sales roles</li>
                <li>Tech stack adoption signals (Clay, Instantly, Apollo)</li>
                <li>ICP filter: B2B SaaS founders, Seed to Series B</li>
              </ul>
              <div className="panel-bottom">
                <div className="panel-stat">
                  <span className="panel-stat-num">3x</span>
                  <span className="panel-stat-label">Higher conversion vs cold lists</span>
                </div>
                <a href={CALENDLY} className="panel-cta">Book a Call →</a>
              </div>
            </div>

            {/* 3: Enrichment Layer */}
            <div className="panel is-layer" ref={el => { panelsRef.current[3] = el; }} data-index="3" data-type="layer">
              <div className="layer-type-tag">Connection Layer</div>
              <div className="layer-bridge">
                <div className="bridge-node">Signal Engine</div>
                <div className="bridge-connector" data-label="enriches" />
                <div className="bridge-node">Outbound Engine</div>
              </div>
              <h2 className="layer-title">Every message<br /><em>feels personal</em></h2>
              <p className="layer-desc">Turns raw signals into personalized context. Every contact gets scored, enriched, and loaded with personalization tokens before a single sequence fires.</p>
              <ul className="layer-items">
                <li>Automated enrichment via Bitscale + Clay waterfall</li>
                <li>Role, tech stack, and growth stage per prospect</li>
                <li>ICP scoring so your SDR talks to buyers, not tourists</li>
                <li>Auto-personalization tokens for every sequence</li>
              </ul>
              <div className="panel-bottom">
                <div className="layer-stat panel-stat">
                  <span className="panel-stat-num">20h</span>
                  <span className="panel-stat-label">Saved per week on SDR research</span>
                </div>
                <a href={CALENDLY} className="panel-cta" style={panelCtaStyle}>Book a Call →</a>
              </div>
            </div>

            {/* 4: Outbound Engine */}
            <div className="panel" ref={el => { panelsRef.current[4] = el; }} data-index="4" data-type="engine">
              <div className="panel-num">03</div>
              <div className="panel-tag">Engine</div>
              <h2 className="panel-title">Meetings that <em>book themselves</em></h2>
              <p className="panel-desc">Multi-channel sequences triggered by intent, not arbitrary cadence. Email + LinkedIn working together so your calendar fills while you build product.</p>
              <ul className="panel-items">
                <li>Cold email sequences scored by live signal data</li>
                <li>LinkedIn DM flows tied to content engagement</li>
                <li>Personalized value props per ICP segment</li>
                <li>Pipeline automation: replies route straight to your CRM</li>
              </ul>
              <div className="panel-bottom">
                <div className="panel-stat">
                  <span className="panel-stat-num">460</span>
                  <span className="panel-stat-label">Replies from 2,600 leads</span>
                </div>
                <a href={CALENDLY} className="panel-cta">Book a Call →</a>
              </div>
            </div>

            {/* 5: Feedback Layer */}
            <div className="panel is-layer" ref={el => { panelsRef.current[5] = el; }} data-index="5" data-type="layer">
              <div className="layer-type-tag">Connection Layer</div>
              <div className="layer-bridge">
                <div className="bridge-node">Outbound Engine</div>
                <div className="bridge-connector" data-label="compounds into" />
                <div className="bridge-node">Asset Engine</div>
              </div>
              <h2 className="layer-title">Gets smarter<br /><em>every cycle</em></h2>
              <p className="layer-desc">The loop that closes the flywheel. Every reply, every booking, every close feeds back into targeting and content — so month 6 outperforms month 1 by default.</p>
              <ul className="layer-items">
                <li>Reply rates and meeting data tracked per sequence</li>
                <li>Winning messages recycled into new content assets</li>
                <li>ICP definition sharpened every 30 days from real data</li>
                <li>Compounding returns: same spend, better results each month</li>
              </ul>
              <div className="panel-bottom">
                <div className="layer-stat panel-stat">
                  <span className="panel-stat-num">∞</span>
                  <span className="panel-stat-label">Compounding loop</span>
                </div>
                <a href={CALENDLY} className="panel-cta" style={panelCtaStyle}>Book a Call →</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom UI */}
      <div className="section-counter">
        <div className="counter-dots">
          {SECTIONS.map((s, i) => (
            <div
              key={i}
              className={`counter-dot ${s.type === 'engine' ? 'engine-dot' : 'layer-dot'}${i === sectionIndex ? ' active' : ''}`}
            />
          ))}
        </div>
        <span className={`counter-label${isLayer ? ' teal' : ''}`}>{sec.name}</span>
      </div>

      <div className="scroll-hint" ref={scrollHintRef}>
        <div className="scroll-arrow" />
        <span>Scroll to turn</span>
      </div>
    </>
  );
}
