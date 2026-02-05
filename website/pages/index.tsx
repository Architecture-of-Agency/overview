import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Leol Lab | Web3 Inclusive Governance Research</title>
        <meta name="description" content="Research lab investigating Web3-enabled inclusive governance systems for sovereign neighborhood data" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
          
          * { margin: 0; padding: 0; box-sizing: border-box; }
          
          body {
            background: #f5f5f5;
            color: #333333;
            font-family: 'Space Mono', 'Courier New', 'Courier', monospace !important;
            line-height: 1.6;
          }
          
          * {
            font-family: 'Space Mono', 'Courier New', 'Courier', monospace !important;
          }
          
          .scanlines {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px);
            pointer-events: none;
            z-index: 1000;
          }
          
          .corner {
            position: fixed;
            width: 20px;
            height: 20px;
            opacity: 0.3;
            z-index: 100;
          }
          .corner-tl { top: 20px; left: 20px; border-left: 1px solid #666; border-top: 1px solid #666; }
          .corner-tr { top: 20px; right: 20px; border-right: 1px solid #666; border-top: 1px solid #666; }
          .corner-bl { bottom: 20px; left: 20px; border-left: 1px solid #666; border-bottom: 1px solid #666; }
          .corner-br { bottom: 20px; right: 20px; border-right: 1px solid #666; border-bottom: 1px solid #666; }
        `}} />
      </Head>
            z-index: 1000;
          }
          
          .corner {
            position: fixed;
            width: 20px;
            height: 20px;
            opacity: 0.3;
            z-index: 100;
          }
          .corner-tl { top: 20px; left: 20px; border-left: 1px solid #666; border-top: 1px solid #666; }
          .corner-tr { top: 20px; right: 20px; border-right: 1px solid #666; border-top: 1px solid #666; }
          .corner-bl { bottom: 20px; left: 20px; border-left: 1px solid #666; border-bottom: 1px solid #666; }
          .corner-br { bottom: 20px; right: 20px; border-right: 1px solid #666; border-bottom: 1px solid #666; }
        `}</style>
      </Head>

      <div className="scanlines"></div>
      <div className="corner corner-tl"></div>
      <div className="corner corner-tr"></div>
      <div className="corner corner-bl"></div>
      <div className="corner corner-br"></div>

      <main style={{ minHeight: '100vh', padding: '60px 40px 40px' }}>
        <section style={{ maxWidth: '1200px', margin: '0 auto 80px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #666', padding: '40px' }}>
            <p style={{ fontSize: '11px', letterSpacing: '2px', color: '#888', marginBottom: '20px', textTransform: 'uppercase' }}>
              RESEARCH LAB
            </p>
            
            <h1 style={{ fontSize: '48px', fontWeight: 700, marginBottom: '24px', lineHeight: 1.2 }}>
              Leol Lab
            </h1>
            
            <p style={{ fontSize: '18px', lineHeight: 1.7, maxWidth: '800px', marginBottom: '32px' }}>
              We research Web3-enabled inclusive governance systems for sovereign 
              neighborhood data, scaling from community to national level
            </p>
            
            <div style={{ borderTop: '1px solid #666', paddingTop: '20px', marginTop: '20px' }}>
              <p style={{ fontSize: '14px', marginBottom: '4px' }}>
                <strong>Lucy Dunhill</strong>, PhD Researcher
              </p>
              <p style={{ fontSize: '13px', color: '#888' }}>
                Welsh School of Architecture, Cardiff University
              </p>
            </div>
          </div>
        </section>

        <section style={{ maxWidth: '1200px', margin: '0 auto 60px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '2px', color: '#888', marginBottom: '16px', textTransform: 'uppercase' }}>
            RESEARCH FOCUS
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #666', padding: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', letterSpacing: '1px' }}>
                BLOCKCHAIN GOVERNANCE
              </h3>
              <p style={{ fontSize: '13px', lineHeight: 1.7 }}>
                Exploring DAO structures and smart contracts for community-led urban planning
              </p>
            </div>
            
            <div style={{ background: '#ffffff', border: '1px solid #666', padding: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', letterSpacing: '1px' }}>
                DATA SOVEREIGNTY
              </h3>
              <p style={{ fontSize: '13px', lineHeight: 1.7 }}>
                Building frameworks for neighborhood-owned data systems that scale nationally
              </p>
            </div>
            
            <div style={{ background: '#ffffff', border: '1px solid #666', padding: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', letterSpacing: '1px' }}>
                INCLUSIVE DESIGN
              </h3>
              <p style={{ fontSize: '13px', lineHeight: 1.7 }}>
                Ensuring Web3 tools are accessible and center marginalized voices in planning
              </p>
            </div>
          </div>
        </section>

        <section style={{ maxWidth: '1200px', margin: '0 auto 60px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '2px', color: '#888', marginBottom: '16px', textTransform: 'uppercase' }}>
            CURRENT PROJECTS
          </p>
          
          <div style={{ background: '#ffffff', border: '1px solid #666', padding: '32px' }}>
            <h3 style={{ fontSize: '20px', marginBottom: '16px', fontWeight: 700 }}>
              Blockchain-Enabled Place Plans
            </h3>
            <p style={{ fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>
              Co-designing Web3 governance tools with disabled communities in Wales to 
              enable genuine participation in local planning processes. Testing how 
              blockchain can support the Well-being of Future Generations Act goals.
            </p>
            
            <div style={{ borderTop: '1px solid #666', paddingTop: '16px' }}>
              <div style={{ display: 'flex', gap: '32px', fontSize: '13px', flexWrap: 'wrap' }}>
                <div><span style={{ color: '#888' }}>STATUS:</span> Active</div>
                <div><span style={{ color: '#888' }}>TIMELINE:</span> 2024-2027</div>
                <div><span style={{ color: '#888' }}>METHODS:</span> Institutional ethnography, co-production workshops</div>
              </div>
            </div>
          </div>
        </section>

        <footer style={{ maxWidth: '1200px', margin: '80px auto 0', paddingTop: '32px', borderTop: '1px solid #666', fontSize: '12px', color: '#888' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>© 2025 Leol Lab · Cardiff University</div>
            <div>Web3 · Governance · Inclusion</div>
          </div>
        </footer>
      </main>
    </>
  )
}