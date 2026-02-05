import Head from 'next/head'
import { useState } from 'react'

export default function Home() {
  const [lang, setLang] = useState('en')
  
  const content = {
    en: {
      lab: 'Research lab',
      mission: 'We research Web3-enabled inclusive governance systems for sovereign neighbourhood data, scaling from street to national level',
      researchFocus: 'Research focus',
      currentProject: 'Current project',
      relatedInitiatives: 'Related initiatives',
      
      card1Title: 'Data sovereignty',
      card1Text: 'Whose knowledge counts? Who owns and can manipulate data and knowledge? Addressing epistemic justice in urban governance systems.',
      
      card2Title: 'Inclusive design',
      card2Text: 'Applying design justice principles to build systems that challenge rather than reproduce existing power structures. Centering disabled people and communities in creating accountable technologies.',
      
      card3Title: 'Digital governance',
      card3Text: 'Web3 and blockchain systems for community-led planning and transparent, accountable decision-making processes.',
      
      projectTitle: 'Place-based Data Sovereignty',
      projectDesc: 'Co-designing place-based data systems with communities in Cardiff, Wales. Testing how blockchain can support transparency, accountability and real devolved power to communities in planning. Testing pathways for community data to directly shape planning policy and practice.',
      
      status: 'Status:',
      statusActive: 'Active',
      timeline: 'Timeline:',
      methods: 'Methods:',
      methodsList: 'Action Research, Cyberfeminism, Design Justice, Epistemic Justice',
      funding: 'Open to partnerships and funding',
      
      project2Title: 'National Data Infrastructure',
      project2Text: 'Exploring how place-based data scales from street to neighbourhood, city, and national levels. Building frameworks for data to inform policy up the chain while maintaining community sovereignty.',
      
      project3Title: 'Place-based Digital Identity',
      project3Text: 'Investigating place and location as identity mechanisms for engaging with governance processes. Avoiding surveillance systems and traditional digital IDs while enabling meaningful participation.',
      
      ongoing: 'Ongoing',
      footer: 'Web3 · Governance · Inclusion'
    },
    cy: {
      lab: 'Labordy ymchwil',
      mission: 'Rydym yn ymchwilio i systemau llywodraethiant cynhwysol Web3-alluog ar gyfer data cymdogaeth sofran, gan raddio o lefel stryd i lefel genedlaethol',
      researchFocus: 'Ffocws ymchwil',
      currentProject: 'Prosiect cyfredol',
      relatedInitiatives: 'Mentrau cysylltiedig',
      
      card1Title: 'Sofraniaeth data',
      card1Text: 'Pa wybodaeth sy\'n cyfrif? Pwy sy\'n berchen ar ddata a gwybodaeth ac yn gallu eu trin? Mynd i\'r afael â chyfiawnder epistemolegol mewn systemau llywodraethiant trefol.',
      
      card2Title: 'Dylunio cynhwysol',
      card2Text: 'Cymhwyso egwyddorion cyfiawnder dylunio i adeiladu systemau sy\'n herio yn hytrach nag atgynhyrchu strwythurau pŵer presennol. Canoli pobl anabl a chymunedau wrth greu technolegau atebol.',
      
      card3Title: 'Llywodraethiant digidol',
      card3Text: 'Systemau Gwe3 a blockchain ar gyfer cynllunio dan arweiniad cymunedol a phrosesau gwneud penderfyniadau tryloyw ac atebol.',
      
      projectTitle: 'Sofraniaeth Data Lle-seiliedig',
      projectDesc: 'Cyd-gynllunio systemau data lle-seiliedig gyda chymunedau yng Nghaerdydd, Cymru. Profi sut gall blockchain gefnogi tryloywder, atebolrwydd a gwir bŵer datganoledig i gymunedau mewn cynllunio. Profi llwybrau i ddata cymunedol lunio polisi ac arfer cynllunio yn uniongyrchol.',
      
      status: 'Statws:',
      statusActive: 'Gweithredol',
      timeline: 'Amserlen:',
      methods: 'Dulliau:',
      methodsList: 'Ymchwil Weithredu, Seiberfeminyddiaeth, Cyfiawnder Dylunio, Cyfiawnder Epistemolegol',
      funding: 'Agored i bartneriaethau a chyllid',
      
      project2Title: 'Seilwaith Data Cenedlaethol',
      project2Text: 'Archwilio sut mae data lle-seiliedig yn graddio o lefel stryd i gymdogaeth, dinas a lefelau cenedlaethol. Adeiladu fframweithiau i ddata lywio polisi i fyny\'r gadwyn tra\'n cynnal sofraniaeth gymunedol.',
      
      project3Title: 'Hunaniaeth Ddigidol Lle-seiliedig',
      project3Text: 'Ymchwilio i le a lleoliad fel mecanweithiau hunaniaeth ar gyfer ymgysylltu â phrosesau llywodraethiant. Osgoi systemau gwyliadwriaeth a hunoliaethau digidol traddodiadol tra\'n galluogi cyfranogiad ystyrlon.',
      
      ongoing: 'Ar y gweill',
      footer: 'Gwe3 · Llywodraethiant · Cynhwysiant'
    }
  }
  
  const t = content[lang]

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
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes randomGlitch {
          0%, 90%, 100% { opacity: 0.15; transform: translateX(0) scaleX(1); }
          91% { opacity: 0.4; transform: translateX(5px) scaleX(1.1); }
          93% { opacity: 0.3; transform: translateX(-4px) scaleX(0.9); }
          95% { opacity: 0.35; transform: translateX(3px) scaleX(1.05); }
          97% { opacity: 0.2; transform: translateX(-2px) scaleX(0.95); }
        }
        
        @keyframes cornerFlicker {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.15; }
          75% { opacity: 0.3; }
        }
        
        @keyframes streamScroll {
          0% { transform: translateY(0); opacity: 0.2; }
          50% { opacity: 0.1; }
          100% { transform: translateY(30px); opacity: 0.2; }
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
          opacity: 0.7;
        }
        
        .scanlines {
          position: fixed;
          top: 0; 
          left: 0; 
          right: 0; 
          bottom: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px);
          pointer-events: none;
          z-index: 1000;
        }
        
        .glitch-bar {
          position: fixed;
          height: 2px;
          background: #666;
          opacity: 0.15;
          pointer-events: none;
          z-index: 999;
        }
        
        .glitch-bar:nth-child(1) {
          top: 15%;
          left: 0;
          width: 60%;
          animation: randomGlitch 6s ease-in-out infinite;
        }
        
        .glitch-bar:nth-child(2) {
          top: 45%;
          left: 25%;
          width: 70%;
          opacity: 0.12;
          animation: randomGlitch 9s ease-in-out infinite 2s;
        }
        
        .glitch-bar:nth-child(3) {
          top: 72%;
          left: 0;
          width: 45%;
          opacity: 0.1;
          animation: randomGlitch 11s ease-in-out infinite 4s;
        }
        
        .data-stream {
          position: fixed;
          top: 20px;
          right: 60px;
          font-size: 9px;
          color: #666;
          opacity: 0.2;
          z-index: 50;
          line-height: 1.3;
          animation: streamScroll 25s linear infinite;
          pointer-events: none;
        }
        
        .corner {
          position: fixed;
          width: 22px;
          height: 22px;
          opacity: 0.4;
          z-index: 100;
        }
        
        .corner-tl { 
          top: 20px; 
          left: 20px; 
          border-left: 2px solid #666; 
          border-top: 2px solid #666;
          animation: cornerFlicker 5s ease-in-out infinite;
        }
        
        .corner-tr { 
          top: 20px; 
          right: 20px; 
          border-right: 2px solid #666; 
          border-top: 2px solid #666;
          animation: cornerFlicker 5s ease-in-out infinite 0.7s;
        }
        
        .corner-bl { 
          bottom: 20px; 
          left: 20px; 
          border-left: 2px solid #666; 
          border-bottom: 2px solid #666;
          animation: cornerFlicker 5s ease-in-out infinite 1.4s;
        }
        
        .corner-br { 
          bottom: 20px; 
          right: 20px; 
          border-right: 2px solid #666; 
          border-bottom: 2px solid #666;
          animation: cornerFlicker 5s ease-in-out infinite 2.1s;
        }
        
        .fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        
        .section-label {
          font-size: 12px;
          letter-spacing: 1px;
          color: #666;
          margin-bottom: 16px;
          font-weight: 700;
        }
        
        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          border-color: #444;
        }
        
        .lang-btn {
          background: #ffffff;
          border: 1px solid #666;
          padding: 8px 16px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Space Mono', monospace;
          font-weight: 700;
        }
        
        .lang-btn:hover {
          background: #f0f0f0;
          border-color: #444;
        }
        
        .lang-btn.active {
          background: #1a1a1a;
          color: #ffffff;
        }
        
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
          .glitch-bar, .data-stream, .corner, .fade-in, .card-hover {
            animation: none !important;
          }
          .card-hover:hover {
            transform: none;
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

      {/* Language Toggle */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 2000, display: 'flex', gap: '8px' }}>
        <button 
          className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
          onClick={() => setLang('en')}
          aria-label="Switch to English"
        >
          EN
        </button>
        <button 
          className={`lang-btn ${lang === 'cy' ? 'active' : ''}`}
          onClick={() => setLang('cy')}
          aria-label="Newid i Gymraeg"
        >
          CY
        </button>
      </div>

      <main style={{ minHeight: '100vh', padding: '60px 40px 40px' }}>
        {/* Hero */}
        <section className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto 80px' }}>
          <div className="card-hover" style={{ background: '#ffffff', border: '1px solid #666', padding: '40px' }}>
            <p className="section-label">
              {t.lab}
            </p>
            
            <h1 style={{ fontSize: '48px', fontWeight: 700, marginBottom: '24px', lineHeight: 1.2, color: '#1a1a1a' }}>
              Leol Lab
            </h1>
            
            <p style={{ fontSize: '18px', lineHeight: 1.7, maxWidth: '800px', marginBottom: '32px', color: '#1a1a1a' }}>
              {t.mission}
            </p>
            
            <div style={{ borderTop: '1px solid #666', paddingTop: '20px', marginTop: '20px' }}>
              <p style={{ fontSize: '16px', marginBottom: '4px', color: '#1a1a1a' }}>
                <strong>Lucy Dunhill</strong>, PhD Researcher
              </p>
              <p style={{ fontSize: '15px', color: '#555', marginBottom: '8px' }}>
                Welsh School of Architecture, Cardiff University
              </p>
              <p style={{ fontSize: '15px', color: '#555' }}>
                <a href="mailto:dunhilll@cardiff.ac.uk" style={{ color: '#1a1a1a', textDecoration: 'underline' }}>
                  dunhilll@cardiff.ac.uk
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Research Focus */}
        <section className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto 60px' }}>
          <h2 className="section-label">
            {t.researchFocus}
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <article className="card-hover" style={{ background: '#ffffff', border: '1px solid #666', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#1a1a1a' }}>
                {t.card1Title}
              </h3>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#1a1a1a' }}>
                {t.card1Text}
              </p>
            </article>
            
            <article className="card-hover" style={{ background: '#ffffff', border: '1px solid #666', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#1a1a1a' }}>
                {t.card2Title}
              </h3>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#1a1a1a' }}>
                {t.card2Text}
              </p>
            </article>
            
            <article className="card-hover" style={{ background: '#ffffff', border: '1px solid #666', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#1a1a1a' }}>
                {t.card3Title}
              </h3>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#1a1a1a' }}>
                {t.card3Text}
              </p>
            </article>
          </div>
        </section>

        {/* Current Project */}
        <section className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto 60px' }}>
          <h2 className="section-label">
            {t.currentProject}
          </h2>
          
          <article className="card-hover" style={{ background: '#ffffff', border: '1px solid #666', padding: '32px' }}>
            <h3 style={{ fontSize: '22px', marginBottom: '16px', fontWeight: 700, color: '#1a1a1a' }}>
              {t.projectTitle}
            </h3>
            <p style={{ fontSize: '16px', lineHeight: 1.7, marginBottom: '20px', color: '#1a1a1a' }}>
              {t.projectDesc}
            </p>
            
            <div style={{ borderTop: '1px solid #666', paddingTop: '16px', marginBottom: '16px' }}>
              <dl style={{ display: 'flex', gap: '32px', fontSize: '15px', flexWrap: 'wrap' }}>
                <div>
                  <dt style={{ display: 'inline', color: '#555', fontWeight: 700 }}>{t.status} </dt>
                  <dd style={{ display: 'inline', color: '#1a1a1a' }}>{t.statusActive}</dd>
                </div>
                <div>
                  <dt style={{ display: 'inline', color: '#555', fontWeight: 700 }}>{t.timeline} </dt>
                  <dd style={{ display: 'inline', color: '#1a1a1a' }}>2025-2028</dd>
                </div>
              </dl>
            </div>
            
            <div style={{ borderTop: '1px solid #666', paddingTop: '16px', marginBottom: '16px' }}>
              <p style={{ fontSize: '14px', color: '#555', marginBottom: '8px', fontWeight: 700 }}>{t.methods}</p>
              <p style={{ fontSize: '15px', color: '#1a1a1a' }}>
                {t.methodsList}
              </p>
            </div>
            
            <div style={{ borderTop: '1px solid #666', paddingTop: '16px' }}>
              <p style={{ fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
                {t.funding}
              </p>
            </div>
          </article>
        </section>

        {/* Related Initiatives */}
        <section className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto 60px' }}>
          <h2 className="section-label">
            {t.relatedInitiatives}
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
            <article className="card-hover" style={{ background: '#ffffff', border: '1px solid #666', padding: '28px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '12px', fontWeight: 700, color: '#1a1a1a' }}>
                {t.project2Title}
              </h3>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#1a1a1a', marginBottom: '16px' }}>
                {t.project2Text}
              </p>
              <div style={{ borderTop: '1px solid #666', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <p style={{ fontSize: '13px', color: '#666' }}>
                  {t.ongoing}
                </p>
                <p style={{ fontSize: '13px', color: '#666', fontStyle: 'italic' }}>
                  {t.funding}
                </p>
              </div>
            </article>
            
            <article className="card-hover" style={{ background: '#ffffff', border: '1px solid #666', padding: '28px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '12px', fontWeight: 700, color: '#1a1a1a' }}>
                {t.project3Title}
              </h3>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#1a1a1a', marginBottom: '16px' }}>
                {t.project3Text}
              </p>
              <div style={{ borderTop: '1px solid #666', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <p style={{ fontSize: '13px', color: '#666' }}>
                  {t.ongoing}
                </p>
                <p style={{ fontSize: '13px', color: '#666', fontStyle: 'italic' }}>
                  {t.funding}
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* Footer */}
        <footer className="fade-in" style={{ maxWidth: '1200px', margin: '80px auto 0', paddingTop: '32px', borderTop: '1px solid #666', fontSize: '14px', color: '#555' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>© 2025 Leol Lab</div>
            <div>{t.footer}</div>
          </div>
        </footer>
      </main>
    </>
  )
}