import Head from 'next/head'
import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [lang, setLang] = useState('en')
  const [expandedCard, setExpandedCard] = useState(null)
  
  const content = {
    en: {
      lab: 'Research lab',
      mission: 'Researching Web3-enabled inclusive governance systems for sovereign neighbourhood data, scaling from street to national level',
      researchFocus: 'Research focus',
      currentProject: 'Current project',
      relatedInitiatives: 'Related initiatives',
      contact: 'Contact',
      contactAvailability: 'Available for meetings in Cardiff/Online',
      
      card1Title: 'Data sovereignty',
      card1Short: 'Whose knowledge counts? Who owns and can manipulate data and knowledge? Addressing epistemic justice in urban governance systems.',
      card1Full: 'Whose knowledge counts? Who owns and can manipulate data and knowledge? Our work examines epistemic justice in urban governance—challenging who gets to define what counts as legitimate knowledge in planning decisions. We investigate how blockchain and Web3 technologies can redistribute power over data ownership, ensuring communities maintain sovereignty over the knowledge they generate about their own places. This extends beyond technical solutions to question fundamental power structures in how urban data is collected, validated, and used.',
      
      card2Title: 'Inclusive design',
      card2Short: 'Applying design justice principles to build systems that challenge rather than reproduce existing power structures. Centering disabled people and communities in creating accountable technologies.',
      card2Full: 'Applying design justice principles to build systems that challenge rather than reproduce existing power structures. We center disabled people and marginalized communities throughout our research and design process—not as consultation afterthoughts, but as co-designers and leaders. Our approach recognizes that technology often replicates existing barriers and hierarchies. By foregrounding accessibility, we create governance tools that redistribute rather than concentrate power, ensuring new digital systems enable rather than exclude.',
      
      card3Title: 'Digital governance',
      card3Short: 'Web3 and blockchain systems for community-led planning and transparent, accountable decision-making processes.',
      card3Full: 'Web3 and blockchain systems for community-led planning and transparent, accountable decision-making processes. We explore how decentralized technologies can enable genuine community control over planning decisions—moving beyond extractive consultation toward meaningful devolved power. Our research investigates smart contracts for transparent decision-making, DAOs for community governance, and blockchain for creating auditable, community-owned records of planning processes. The goal is accountability: tools that make power visible and challengeable.',
      
      clickToExpand: 'Click to read more',
      clickToCollapse: 'Click to collapse',
      
      projectTitle: 'Place-based Data Sovereignty',
      projectDesc: 'Co-designing place-based data systems with communities in Cardiff, Wales. Testing how blockchain can support transparency, accountability and real devolved power to communities in planning.',
      
      project2Title: 'National Data Infrastructure',
      project2Text: 'Exploring how place-based data scales from street to neighbourhood, city, and national levels. Building frameworks for data to inform policy up the chain while maintaining community sovereignty.',
      
      project3Title: 'Place-based Digital Identity',
      project3Text: 'Investigating place and location as identity mechanisms for engaging with governance processes. Avoiding surveillance systems and traditional digital IDs while enabling meaningful participation.',
      
      viewProject: 'View full project',
      ongoing: 'Ongoing',
      funding: 'Open to partnerships and funding',
      footer: 'Web3 · Governance · Inclusion'
    },
    cy: {
      lab: 'Labordy ymchwil',
      mission: 'Ymchwilio i systemau llywodraethiant cynhwysol Web3-alluog ar gyfer data cymdogaeth sofran, gan raddio o lefel stryd i lefel genedlaethol',
      researchFocus: 'Ffocws ymchwil',
      currentProject: 'Prosiect cyfredol',
      relatedInitiatives: 'Mentrau cysylltiedig',
      contact: 'Cysylltu',
      contactAvailability: 'Ar gael ar gyfer cyfarfodydd yng Nghaerdydd/Ar-lein',
      
      card1Title: 'Sofraniaeth data',
      card1Short: 'Pa wybodaeth sy\'n cyfrif? Pwy sy\'n berchen ar ddata a gwybodaeth ac yn gallu eu trin? Mynd i\'r afael â chyfiawnder epistemolegol mewn systemau llywodraethiant trefol.',
      card1Full: 'Pa wybodaeth sy\'n cyfrif? Pwy sy\'n berchen ar ddata a gwybodaeth ac yn gallu eu trin? Mae ein gwaith yn archwilio cyfiawnder epistemolegol mewn llywodraethiant trefol—herio pwy sy\'n cael diffinio beth sy\'n cyfrif fel gwybodaeth ddilys mewn penderfyniadau cynllunio. Rydym yn ymchwilio sut gall technolegau blockchain a Gwe3 ailddosbarthu pŵer dros berchnogaeth data, gan sicrhau bod cymunedau yn cynnal sofraniaeth dros y wybodaeth maent yn ei chynhyrchu am eu lleoedd eu hunain.',
      
      card2Title: 'Dylunio cynhwysol',
      card2Short: 'Cymhwyso egwyddorion cyfiawnder dylunio i adeiladu systemau sy\'n herio yn hytrach nag atgynhyrchu strwythurau pŵer presennol. Canoli pobl anabl a chymunedau wrth greu technolegau atebol.',
      card2Full: 'Cymhwyso egwyddorion cyfiawnder dylunio i adeiladu systemau sy\'n herio yn hytrach nag atgynhyrchu strwythurau pŵer presennol. Rydym yn canoli pobl anabl a chymunedau ymylol trwy gydol ein proses ymchwil a dylunio—nid fel ymgynghoriadau ôl-feddwl, ond fel cyd-ddylunwyr ac arweinwyr. Mae ein dull yn cydnabod bod technoleg yn aml yn dyblygu rhwystrau a hierarchaethau presennol. Trwy roi hygyrchedd yn y blaen, rydym yn creu offer llywodraethiant sy\'n ailddosbarthu yn hytrach na chrynhoi pŵer.',
      
      card3Title: 'Llywodraethiant digidol',
      card3Short: 'Systemau Gwe3 a blockchain ar gyfer cynllunio dan arweiniad cymunedol a phrosesau gwneud penderfyniadau tryloyw ac atebol.',
      card3Full: 'Systemau Gwe3 a blockchain ar gyfer cynllunio dan arweiniad cymunedol a phrosesau gwneud penderfyniadau tryloyw ac atebol. Rydym yn archwilio sut gall technolegau datganoledig alluogi rheolaeth gymunedol wirioneddol dros benderfyniadau cynllunio—symud y tu hwnt i ymgynghori echdynnol tuag at bŵer datganoledig ystyrlon. Mae ein hymchwil yn ymchwilio i gontractau craff ar gyfer gwneud penderfyniadau tryloyw, DAOs ar gyfer llywodraethiant cymunedol, a blockchain ar gyfer creu cofnodion archwiliadwy, sy\'n eiddo i\'r gymuned o brosesau cynllunio.',
      
      clickToExpand: 'Cliciwch i ddarllen mwy',
      clickToCollapse: 'Cliciwch i gau',
      
      projectTitle: 'Sofraniaeth Data Lle-seiliedig',
      projectDesc: 'Cyd-gynllunio systemau data lle-seiliedig gyda chymunedau yng Nghaerdydd, Cymru. Profi sut gall blockchain gefnogi tryloywder, atebolrwydd a gwir bŵer datganoledig i gymunedau mewn cynllunio.',
      
      project2Title: 'Seilwaith Data Cenedlaethol',
      project2Text: 'Archwilio sut mae data lle-seiliedig yn graddio o lefel stryd i gymdogaeth, dinas a lefelau cenedlaethol. Adeiladu fframweithiau i ddata lywio polisi i fyny\'r gadwyn tra\'n cynnal sofraniaeth gymunedol.',
      
      project3Title: 'Hunaniaeth Ddigidol Lle-seiliedig',
      project3Text: 'Ymchwilio i le a lleoliad fel mecanweithiau hunaniaeth ar gyfer ymgysylltu â phrosesau llywodraethiant. Osgoi systemau gwyliadwriaeth a hunoliaethau digidol traddodiadol tra\'n galluogi cyfranogiad ystyrlon.',
      
      viewProject: 'Gweld prosiect llawn',
      ongoing: 'Ar y gweill',
      funding: 'Agored i bartneriaethau a chyllid',
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
        
        .card-clickable {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        
        .card-clickable:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          border-color: #444;
        }
        
        .card-expandable {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        
        .card-expandable:hover {
          border-color: #444;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        }
        
        .expand-indicator {
          font-size: 11px;
          color: #888;
          margin-top: 12px;
          font-style: italic;
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
        
        a {
          color: inherit;
          text-decoration: none;
        }
        
        a:hover {
          text-decoration: underline;
        }
        
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
          .glitch-bar, .data-stream, .corner, .fade-in, .card-clickable, .card-expandable {
            animation: none !important;
          }
          .card-clickable:hover, .card-expandable:hover {
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
      
      {/* Binary for "Leol Lab" */}
      <div className="data-stream" aria-hidden="true">
        01001100 01100101 01101111 01101100<br/>
        00100000 01001100 01100001 01100010
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
          <div style={{ background: '#ffffff', border: '1px solid #666', padding: '40px' }}>
            <p className="section-label">
              {t.lab}
            </p>
            
            <h1 style={{ fontSize: '48px', fontWeight: 700, marginBottom: '24px', lineHeight: 1.2, color: '#1a1a1a' }}>
              Leol Lab
            </h1>
            
            <p style={{ fontSize: '18px', lineHeight: 1.7, maxWidth: '800px', color: '#1a1a1a' }}>
              {t.mission}
            </p>
          </div>
        </section>

        {/* Research Focus */}
        <section className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto 60px' }}>
          <h2 className="section-label">
            {t.researchFocus}
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* Card 1 */}
            <article 
              className="card-expandable" 
              style={{ background: '#ffffff', border: '1px solid #666', padding: '24px' }}
              onClick={() => setExpandedCard(expandedCard === 1 ? null : 1)}
            >
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#1a1a1a' }}>
                {t.card1Title}
              </h3>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#1a1a1a' }}>
                {expandedCard === 1 ? t.card1Full : t.card1Short}
              </p>
              <p className="expand-indicator">
                {expandedCard === 1 ? t.clickToCollapse : t.clickToExpand}
              </p>
            </article>
            
            {/* Card 2 */}
            <article 
              className="card-expandable" 
              style={{ background: '#ffffff', border: '1px solid #666', padding: '24px' }}
              onClick={() => setExpandedCard(expandedCard === 2 ? null : 2)}
            >
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#1a1a1a' }}>
                {t.card2Title}
              </h3>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#1a1a1a' }}>
                {expandedCard === 2 ? t.card2Full : t.card2Short}
              </p>
              <p className="expand-indicator">
                {expandedCard === 2 ? t.clickToCollapse : t.clickToExpand}
              </p>
            </article>
            
            {/* Card 3 */}
            <article 
              className="card-expandable" 
              style={{ background: '#ffffff', border: '1px solid #666', padding: '24px' }}
              onClick={() => setExpandedCard(expandedCard === 3 ? null : 3)}
            >
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#1a1a1a' }}>
                {t.card3Title}
              </h3>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#1a1a1a' }}>
                {expandedCard === 3 ? t.card3Full : t.card3Short}
              </p>
              <p className="expand-indicator">
                {expandedCard === 3 ? t.clickToCollapse : t.clickToExpand}
              </p>
            </article>
          </div>
        </section>

        {/* Current Project */}
        <section className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto 60px' }}>
          <h2 className="section-label">
            {t.currentProject}
          </h2>
          
          <Link href="/projects/place-based-data-sovereignty">
            <article className="card-clickable" style={{ background: '#ffffff', border: '1px solid #666', padding: '32px' }}>
              <h3 style={{ fontSize: '22px', marginBottom: '16px', fontWeight: 700, color: '#1a1a1a' }}>
                {t.projectTitle}
              </h3>
              <p style={{ fontSize: '16px', lineHeight: 1.7, marginBottom: '16px', color: '#1a1a1a' }}>
                {t.projectDesc}
              </p>
              <p style={{ fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
                {t.viewProject} →
              </p>
            </article>
          </Link>
        </section>

        {/* Related Initiatives */}
        <section className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto 60px' }}>
          <h2 className="section-label">
            {t.relatedInitiatives}
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
            <Link href="/projects/national-data-infrastructure">
              <article className="card-clickable" style={{ background: '#ffffff', border: '1px solid #666', padding: '28px' }}>
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
                    {t.viewProject} →
                  </p>
                </div>
              </article>
            </Link>
            
            <Link href="/projects/place-based-identity">
              <article className="card-clickable" style={{ background: '#ffffff', border: '1px solid #666', padding: '28px' }}>
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
                    {t.viewProject} →
                  </p>
                </div>
              </article>
            </Link>
          </div>
        </section>

        {/* Contact Section */}
        <section className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto 60px' }}>
          <h2 className="section-label">
            {t.contact}
          </h2>
          
          <div style={{ background: '#ffffff', border: '1px solid #666', padding: '32px' }}>
            <p style={{ fontSize: '16px', marginBottom: '8px', color: '#1a1a1a' }}>
              <strong>Lucy Dunhill</strong>, PhD Researcher
            </p>
            <p style={{ fontSize: '15px', color: '#555', marginBottom: '8px' }}>
              Welsh School of Architecture, Cardiff University
            </p>
            <p style={{ fontSize: '15px', marginBottom: '16px' }}>
              <a href="mailto:dunhilll@cardiff.ac.uk" style={{ color: '#1a1a1a', textDecoration: 'underline' }}>
                dunhilll@cardiff.ac.uk
              </a>
            </p>
            <p style={{ fontSize: '14px', color: '#666', fontStyle: 'italic', borderTop: '1px solid #666', paddingTop: '16px' }}>
              {t.contactAvailability}
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="fade-in" style={{ maxWidth: '1200px', margin: '40px auto 0', paddingTop: '32px', borderTop: '1px solid #666', fontSize: '14px', color: '#555' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>© 2025 Leol Lab</div>
            <div>{t.footer}</div>
          </div>
        </footer>
      </main>
    </>
  )
}