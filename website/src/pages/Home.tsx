import { Link } from 'react-router-dom';

const CALENDLY = 'https://calendly.com/rickvandenkommer/new-meeting';

export default function Home() {
  return (
    <>
      <style>{`
        .home-body {
          font-family: 'Inter', -apple-system, sans-serif;
          background: #F9F8F6;
          color: #1a1a1a;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .home-container {
          max-width: 540px;
          text-align: center;
        }
        .home-logo {
          font-size: 0.875rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #888;
          margin-bottom: 3rem;
        }
        .home-h1 {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 600;
          line-height: 1.15;
          color: #1a1a1a;
          margin-bottom: 1.25rem;
          letter-spacing: -0.02em;
        }
        .home-p {
          font-size: 1.125rem;
          line-height: 1.6;
          color: #555;
          margin-bottom: 2.5rem;
        }
        .home-cta {
          display: inline-block;
          padding: 0.875rem 2rem;
          background: #1a1a1a;
          color: #F9F8F6;
          text-decoration: none;
          font-size: 0.9375rem;
          font-weight: 500;
          border-radius: 6px;
          transition: background 0.2s ease;
        }
        .home-cta:hover { background: #333; }
        .home-engine-link {
          font-size: 0.875rem;
          color: #888;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        .home-engine-link:hover { color: #1a1a1a; }
        .home-footer {
          position: fixed;
          bottom: 2rem;
          font-size: 0.8125rem;
          color: #aaa;
        }
        .home-footer a {
          color: #888;
          text-decoration: none;
        }
        .home-footer a:hover { color: #555; }
        .home-top-link {
          position: fixed;
          top: 1.5rem;
          right: 1.5rem;
          font-size: 0.8125rem;
          font-weight: 500;
          color: #888;
          text-decoration: none;
          padding: 0.5rem 1rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          transition: all 0.2s ease;
        }
        .home-top-link:hover {
          color: #1a1a1a;
          border-color: #999;
        }
      `}</style>
      <div className="home-body">
        <Link to="/gtm-engineers" className="home-top-link">for GTM Engineers</Link>
        <div className="home-container">
          <div className="home-logo">Kommercieel</div>
          <h1 className="home-h1">We build GTM engines.</h1>
          <p className="home-p">Outbound infrastructure, data enrichment, and pipeline automation for B2B SaaS companies that want predictable growth.</p>
          <a href={CALENDLY} className="home-cta">Book a 15-min discovery call</a>
          <div style={{ marginTop: '1.25rem' }}>
            <Link to="/engine" className="home-engine-link">See the engine &rarr;</Link>
          </div>
        </div>
        <div className="home-footer">
          <a href="mailto:rick@kommercieel.com">rick@kommercieel.com</a>
        </div>
      </div>
    </>
  );
}
