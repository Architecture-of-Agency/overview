import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Leol Lab | Web3 Inclusive Governance Research</title>
        <meta name="description" content="Research lab investigating Web3-enabled inclusive governance systems for sovereign neighbourhood data" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes randomGlitch {
          0%, 95%, 100% { opacity: 0.1; transform: translateX(0); }
          96% { opacity: 0.3; transform: translateX(3px); }
          97% { opacity: 0.2; transform: translateX(-2px); }
          98% { opacity: 0.1; transform: translateX(0); }
        }
        
        @keyframes cornerFlicker {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.15; }
        }
        
        @keyframes streamScroll {
          0% { transform: translateY(0); opacity: 0.15; }
          50% { opacity: 0.08; }
          100% { transform: translateY(20px); opacity: 0.15; }
        }
        
        * { 
          margin: 0; 
          padding: 0; 
          box-sizing: border-box; 
          font-family: 'Space Mono', 'Courier New', Courier, monospace;
        }
        
        body {
          background: #f5f5f5;
          color: #1a1a1a;
          line-height: 1.6;
          overflow-x: hidden;
          font-size: 16px;
        }
        
        body::before {
          content: "";
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 9999;
          opacity: 0.6;
        }
        
        .scanlines {
          position: fixed;
          top: 0; 
          left: 0; 
          right: 0; 
          bottom: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px);
          pointer-events: none;
          z-index: 1000;
        }
        
        .glitch-bar {
          position: fixed;
          height: 1px;
          background: #666;
          opacity: 0.1;
          pointer-events: none;
          z-index: 999;
        }
        
        .glitch-bar:nth-child(1) {
          top: 15%;
          left: 0;
          width: 60%;
          animation: randomGlitch 8s ease-in-out infinite;
        }
        
        .glitch-bar:nth-child(2) {
          top: 45%;
          left: 25%;
          width: 70%;
          opacity: 0.08;
          animation: randomGlitch 11s ease-in-out infinite 2s;
        }
        
        .glitch-bar:nth-child(3) {
          top: 72%;
          left: 0;
          width: 45%;
          opacity: 0.06;
          animation: randomGlitch 13s ease-in-out infinite 5s;
        }
        
        .data-stream {
          position: fixed;
          top: 20px;
          right: 60px;
          font-size: 8px;
          color: #666;
          opacity: 0.15;
          z-index: 50;
          line-height: 1.2;
          animation: streamScroll 20s linear infinite;
          pointer-events: none;
        }
        
        .corner {
          position: fixed;
          width: 20px;
          height: 20px;
          opacity: 0.3;
          z-index: 100;
        }
        
        .corner-tl { 
          top: 20px; 
          left: 20px; 
          border-left: 1px solid #666; 
          border-top: 1px solid #666;
          animation: cornerFlicker 4s ease-in-out infinite;
        }
        
        .corner-tr { 
          top: 20px; 
          right: 20px; 
          border-right: 1px solid #666; 
          border-top: 1px solid #666;
          animation: cornerFlicker 4s ease-in-out infinite 0.5s;
        }
        
        .corner-bl { 
          bottom: 20px; 
          left: 20px; 
          border-left: 1px solid #666; 
          border-bottom: 1px solid #666;
          animation: cornerFlicker 4s ease-in-out infinite 1s;
        }
        
        .corner-br { 
          bottom: 20px; 
          right: 20px; 
          border-right: 1px solid #666; 
          border-bottom: 1px solid #666;
          animation: cornerFlicker 4s ease-in-out infinite 1.5s;
        }
        
        .fade-in {
          animation: fadeIn 0.6s ease-in-out;
        }
        
        .section-label {
          font-size: 12px;
          letter-spacing: 1px;
          color: #666;
          margin-bottom: 16px;
          font-weight: 700;
        }
        
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
          .glitch-bar, .data-stream, .corner, .fade-in {
            animation: none !important;
          }
        }
      `}</style>

      <div className="scanlines" aria-hidden="true"></div>
      <div className="glitch-bar" aria-hidden="true"></div>
      <div className="glitch-bar" aria-hidden="true"></div>
      <div className="glitch-bar" aria-hidden="true"></div>
      <div className="corner corner-tl" aria-hidden="true"></div>
      <div className="corner corner-tr" aria-hidden="true"></div>
      <div className="corner corner-bl" aria-hidden="true"></div>
      <div className="corner corner-br" aria-hidden="true"></div>
      
      <div className="data-stream" aria-hidden="true">
        01001100 01100101 01101111 01101100<br/>
        01001100 01100001 01100010 00100000<br/>
        01010111 01100101 01100010 00110011<br/>
        01000111 01101111 01110110 01100101<br/>
        01110010 01101110 01100001 01101110<br/>
        01100011 01100101 00100000 01010010
      </div>

      <main style={{ minHeight: '100vh', padding: '60px 40px 40px' }}>
        {/* Hero */}
        <section className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto 80px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #666', padding: '40px' }}>
            <p className="section-label">
              Research lab
            </p>
            
            <h1 style={{ fontSize: '48px', fontWeight: 700, marginBottom: '24px', lineHeight: 1.2, color: '#1a1a1a' }}>
              Leol Lab
            </h1>
            
            <p style={{ fontSize: '18px', lineHeight: 1.7, maxWidth: '800px', marginBottom: '32px', color: '#1a1a1a' }}>
              We research Web3-enabled inclusive governance systems for sovereign 
              neighbourhood data, scaling from street to national level
            </p>
            
            <div style={{ borderTop: '1px solid #666', paddingTop: '20px', marginTop: '20px' }}>
              <p style={{ fontSize: '16px', marginBottom: '4px', color: '#1a1a1a' }}>
                <strong>Lucy Dunhill</strong>, PhD Researcher
              </p>
              <p style={{ fontSize: '15px', color: '#555' }}>
                Welsh School of Architecture, Cardiff University
              </p>
            </div>
          </div>
        </section>

        {/* Research Focus */}
        <section className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto 60px' }}>
          <h2 className="section-label">
            Research focus
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <article style={{ background: '#ffffff', border: '1px solid #666', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#1a1a1a' }}>
                Data sovereignty
              </h3>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#1a1a1a' }}>
                Whose knowledge counts? Who owns and can manipulate data and knowledge? Addressing epistemic justice in urban governance systems.
              </p>
            </article>
            
            <article style={{ background: '#ffffff', border: '1px solid #666', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#1a1a1a' }}>
                Inclusive design
              </h3>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#1a1a1a' }}>
                Design justice to not replicate existing hierarchies and barriers through creating new systems. Giving communities power, including disabled people.
              </p>
            </article>
            
            <article style={{ background: '#ffffff', border: '1px solid #666', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#1a1a1a' }}>
                Digital governance
              </h3>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#1a1a1a' }}>
                Web3 and blockchain systems for community-led planning and transparent, accountable decision-making processes.
              </p>
            </article>
          </div>
        </section>

        {/* Current Project */}
        <section className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto 60px' }}>
          <h2 className="section-label">
            Current project
          </h2>
          
          <article style={{ background: '#ffffff', border: '1px solid #666', padding: '32px' }}>
            <h3 style={{ fontSize: '22px', marginBottom: '16px', fontWeight: 700, color: '#1a1a1a' }}>
              Place-based Data Sovereignty
            </h3>
            <p style={{ fontSize: '16px', lineHeight: 1.7, marginBottom: '20px', color: '#1a1a1a' }}>
              Co-designing place-based data systems with communities in Cardiff, Wales. Testing how blockchain can support transparency, accountability and real devolved power to communities in planning. Exploring mechanisms for this data to influence the planning system.
            </p>
            
            <div style={{ borderTop: '1px solid #666', paddingTop: '16px', marginBottom: '16px' }}>
              <dl style={{ display: 'flex', gap: '32px', fontSize: '15px', flexWrap: 'wrap' }}>
                <div>
                  <dt style={{ display: 'inline', color: '#555', fontWeight: 700 }}>Status: </dt>
                  <dd style={{ display: 'inline', color: '#1a1a1a' }}>Active</dd>
                </div>
                <div>
                  <dt style={{ display: 'inline', color: '#555', fontWeight: 700 }}>Timeline: </dt>
                  <dd style={{ display: 'inline', color: '#1a1a1a' }}>2025-2028</dd>
                </div>
              </dl>
            </div>
            
            <div style={{ borderTop: '1px solid #666', paddingTop: '16px' }}>
              <p style={{ fontSize: '14px', color: '#555', marginBottom: '8px', fontWeight: 700 }}>Methods:</p>
              <p style={{ fontSize: '15px', color: '#1a1a1a' }}>
                Action Research, Cyberfeminism, Design Justice, Epistemic Justice
              </p>
            </div>
          </article>
        </section>

        {/* Related Initiatives */}
        <section className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto 60px' }}>
          <h2 className="section-label">
            Related initiatives
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
            <article style={{ background: '#ffffff', border: '1px solid #666', padding: '28px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '12px', fontWeight: 700, color: '#1a1a1a' }}>
                National Data Infrastructure
              </h3>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#1a1a1a', marginBottom: '12px' }}>
                Exploring how place-based data scales from street to neighbourhood, city, and national levels. Building frameworks for data to inform policy up the chain while maintaining community sovereignty.
              </p>
              <p style={{ fontSize: '13px', color: '#666', fontStyle: 'italic' }}>
                Ongoing research initiative
              </p>
            </article>
            
            <article style={{ background: '#ffffff', border: '1px solid #666', padding: '28px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '12px', fontWeight: 700, color: '#1a1a1a' }}>
                Place-based Digital Identity
              </h3>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#1a1a1a', marginBottom: '12px' }}>
                Investigating place and location as identity mechanisms for engaging with governance processes. Avoiding surveillance systems and traditional digital IDs while enabling meaningful participation.
              </p>
              <p style={{ fontSize: '13px', color: '#666', fontStyle: 'italic' }}>
                Ongoing research initiative
              </p>
            </article>
          </div>
        </section>

        {/* Footer */}
        <footer className="fade-in" style={{ maxWidth: '1200px', margin: '80px auto 0', paddingTop: '32px', borderTop: '1px solid #666', fontSize: '14px', color: '#555' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>© 2025 Leol Lab</div>
            <div>Web3 · Governance · Inclusion</div>
          </div>
        </footer>
      </main>
    </>
  )
}