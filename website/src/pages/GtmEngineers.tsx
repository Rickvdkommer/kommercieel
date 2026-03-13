import { useEffect } from 'react';

export default function GtmEngineers() {
  useEffect(() => {
    // Load Tally embed script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://tally.so/widgets/embed.js';
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  return (
    <>
      <style>{`
        html, body, #root { margin: 0; height: 100%; overflow: hidden; }
        .gtm-iframe {
          position: absolute;
          top: 0; right: 0; bottom: 0; left: 0;
          border: 0;
          width: 100%;
          height: 100%;
        }
      `}</style>
      <iframe
        data-tally-src="https://tally.so/r/zxKAYZ?transparentBackground=1"
        className="gtm-iframe"
        frameBorder="0"
        marginHeight={0}
        marginWidth={0}
        title="GTM Engineers"
      />
    </>
  );
}
