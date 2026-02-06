import Head from 'next/head'
import { useState } from 'react'
import Link from 'next/link'

export default function PlaceBasedDataSovereignty() {
  const [lang, setLang] = useState('en')
  
  const content = {
    en: {
      backHome: '← Back to home',
      projectTitle: 'Place-based Data Sovereignty',
      tagline: 'Co-designing community-owned data systems in Cardiff',
      
      overview: 'Overview',
      overviewText: 'This PhD research project explores how blockchain and Web3 technologies can enable genuine data sovereignty for communities in urban planning. Working with communities in Cardiff, Wales, we are co-designing place-based data systems that give residents real control over information about their neighborhoods—challenging who gets to define, own, and use urban data.',
      
      context: 'Research context',
      contextText: 'Current planning systems extract data from communities without returning power or control. Residents provide knowledge about their places, but have little say in how that information is used, interpreted, or acted upon. This project investigates whether decentralized technologies can shift these power dynamics—enabling transparency, accountability, and genuine devolved power to communities in planning processes.',
      
      objectives: 'Key objectives',
      obj1: 'Co-design blockchain-based data systems with Cardiff communities',
      obj2: 'Test how decentralized technologies support transparent decision-making',
      obj3: 'Investigate mechanisms for community data to influence planning policy',
      obj4: 'Challenge epistemic injustice in who defines "legitimate" urban knowledge',
      obj5: 'Build frameworks for scaling place-based data from street to national level',
      
      timeline: 'Timeline',
      timeline1: '2025: Community engagement and co-design workshops',
      timeline2: '2026: Prototype development and testing',
      timeline3: '2027: Evaluation and policy recommendations',
      timeline4: '2028: Thesis completion and dissemination',
      
      methods: 'Research methods',
      method1: 'Action Research – Working directly with communities to create change',
      method2: 'Cyberfeminism – Challenging power structures in technology design',
      method3: 'Design Justice – Centering marginalized voices in system development',
      method4: 'Epistemic Justice – Questioning whose knowledge counts in planning',
      
      partners: 'Community partners',
      partnersText: 'We are building relationships with community groups, disabled people\'s organizations, and residents in Cardiff. If you are interested in participating or partnering with this research, please get in touch.',
      
      outputs: 'Expected outputs',
      output1: 'Working blockchain prototype for community data governance',
      output2: 'Policy recommendations for Welsh planning authorities',
      output3: 'Academic publications on data sovereignty and urban planning',
      output4: 'Community-owned frameworks for scaling local data systems',
      
      funding: 'Funding & partnerships',
      fundingText: 'This project is open to partnerships and funding opportunities. We welcome collaboration with community organizations, local authorities, funding bodies, and research institutions.',
      
      status: 'Status',
      statusText: 'Active (2025-2028)',
    },
    cy: {
      backHome: '← Nôl i\'r hafan',
      projectTitle: 'Sofraniaeth Data Lle-seiliedig',
      tagline: 'Cyd-gynllunio systemau data sy\'n eiddo i\'r gymuned yng Nghaerdydd',
      
      overview: 'Trosolwg',
      overviewText: 'Mae\'r prosiect ymchwil PhD hwn yn archwilio sut gall technolegau blockchain a Gwe3 alluogi sofraniaeth data wirioneddol ar gyfer cymunedau mewn cynllunio trefol. Gan weithio gyda chymunedau yng Nghaerdydd, Cymru, rydym yn cyd-gynllunio systemau data lle-seiliedig sy\'n rhoi rheolaeth real i drigolion dros wybodaeth am eu cymdogaethau—herio pwy sy\'n cael diffinio, perchnogi a defnyddio data trefol.',
      
      context: 'Cyd-destun ymchwil',
      contextText: 'Mae systemau cynllunio cyfredol yn echdynnu data o gymunedau heb ddychwelyd pŵer na rheolaeth. Mae trigolion yn darparu gwybodaeth am eu lleoedd, ond mae ganddynt ychydig o lais yn sut mae\'r wybodaeth honno\'n cael ei defnyddio, ei dehongli, neu ei gweithredu arni. Mae\'r prosiect hwn yn ymchwilio a all technolegau datganoledig newid y dynameg pŵer hyn—galluogi tryloywder, atebolrwydd, a gwir bŵer datganoledig i gymunedau mewn prosesau cynllunio.',
      
      objectives: 'Amcanion allweddol',
      obj1: 'Cyd-gynllunio systemau data seiliedig ar blockchain gyda chymunedau Caerdydd',
      obj2: 'Profi sut mae technolegau datganoledig yn cefnogi gwneud penderfyniadau tryloyw',
      obj3: 'Ymchwilio i fecanweithiau ar gyfer data cymunedol i ddylanwadu ar bolisi cynllunio',
      obj4: 'Herio anghyfiawnder epistemolegol yn pwy sy\'n diffinio gwybodaeth drefol "ddilys"',
      obj5: 'Adeiladu fframweithiau ar gyfer graddio data lle-seiliedig o lefel stryd i lefel genedlaethol',
      
      timeline: 'Amserlen',
      timeline1: '2025: Ymgysylltu cymunedol a gweithdai cyd-gynllunio',
      timeline2: '2026: Datblygu a phrofi prototeip',
      timeline3: '2027: Gwerthuso ac argymhellion polisi',
      timeline4: '2028: Cwblhau traethawd a lledaenu',
      
      methods: 'Dulliau ymchwil',
      method1: 'Ymchwil Weithredu – Gweithio\'n uniongyrchol gyda chymunedau i greu newid',
      method2: 'Seiberfeminyddiaeth – Herio strwythurau pŵer mewn dylunio technoleg',
      method3: 'Cyfiawnder Dylunio – Canoli lleisiau ymylol mewn datblygu systemau',
      method4: 'Cyfiawnder Epistemolegol – Cwestiynu pa wybodaeth sy\'n cyfrif mewn cynllunio',
      
      partners: 'Partneriaid cymunedol',
      partnersText: 'Rydym yn adeiladu perthnasoedd gyda grwpiau cymunedol, mudiadau pobl anabl, a thrigolion yng Nghaerdydd. Os oes gennych ddiddordeb mewn cymryd rhan neu bartneru gyda\'r ymchwil hon, cysylltwch â ni.',
      
      outputs: 'Allbynnau disgwyliedig',
      output1: 'Prototeip blockchain gweithredol ar gyfer llywodraethiant data cymunedol',
      output2: 'Argymhellion polisi ar gyfer awdurdodau cynllunio Cymru',
      output3: 'Cyhoeddiadau academaidd ar sofraniaeth data a chynllunio trefol',
      output4: 'Fframweithiau sy\'n eiddo i\'r gymuned ar gyfer graddio systemau data lleol',
      
      funding: 'Cyllid a phartneriaethau',
      fundingText: 'Mae\'r prosiect hwn yn agored i bartneriaethau a chyfleoedd ariannu. Rydym yn croesawu cydweithrediad gyda sefydliadau cymunedol, awdurdodau lleol, cyrff ariannu, a sefydliadau ymchwil.',
      
      status: 'Statws',
      statusText: 'Gweithredol (2025-2028)',
    }
  }
  
  const t = content[lang]

  return (
    <>
      <Head>
        <title>{t.projectTitle} | Leol Lab</title>
        <meta name="description" content="Co-designing blockchain-enabled place-based data systems with communities in Cardiff" />
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
          font-size: 16px;
        }
        
        .fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        
        .section-label {
          font-size: 12px;
          letter-spacing: 1px;
          color: #666;
          margin-bottom: 12px;
          font-weight: 700;
          text-transform: uppercase;
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
        
        .back-link {
          display: inline-block;
          margin-bottom: 32px;
          color: #666;
          font-size: 14px;
          transition: color 0.2s;
        }
        
        .back-link:hover {
          color: #1a1a1a;
        }
      `}</style>

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
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Link href="/" className="back-link">
            {t.backHome}
          </Link>

          {/* Header */}
          <section className="fade-in" style={{ marginBottom: '60px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #666', padding: '40px' }}>
              <h1 style={{ fontSize: '40px', fontWeight: 700, marginBottom: '16px', lineHeight: 1.2, color: '#1a1a1a' }}>
                {t.projectTitle}
              </h1>
              <p style={{ fontSize: '18px', color: '#666', fontStyle: 'italic' }}>
                {t.tagline}
              </p>
            </div>
          </section>

          {/* Overview */}
          <section className="fade-in" style={{ marginBottom: '40px' }}>
            <h2 className="section-label">{t.overview}</h2>
            <div style={{ background: '#ffffff', border: '1px solid #666', padding: '28px' }}>
              <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#1a1a1a' }}>
                {t.overviewText}
              </p>
            </div>
          </section>

          {/* Context */}
          <section className="fade-in" style={{ marginBottom: '40px' }}>
            <h2 className="section-label">{t.context}</h2>
            <div style={{ background: '#ffffff', border: '1px solid #666', padding: '28px' }}>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#1a1a1a' }}>
                {t.contextText}
              </p>
            </div>
          </section>

          {/* Objectives */}
          <section className="fade-in" style={{ marginBottom: '40px' }}>
            <h2 className="section-label">{t.objectives}</h2>
            <div style={{ background: '#ffffff', border: '1px solid #666', padding: '28px' }}>
              <ul style={{ listStyle: 'none', fontSize: '15px', lineHeight: 2 }}>
                <li>→ {t.obj1}</li>
                <li>→ {t.obj2}</li>
                <li>→ {t.obj3}</li>
                <li>→ {t.obj4}</li>
                <li>→ {t.obj5}</li>
              </ul>
            </div>
          </section>

          {/* Timeline & Methods */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
            <section className="fade-in">
              <h2 className="section-label">{t.timeline}</h2>
              <div style={{ background: '#ffffff', border: '1px solid #666', padding: '24px' }}>
                <ul style={{ listStyle: 'none', fontSize: '14px', lineHeight: 1.9 }}>
                  <li style={{ marginBottom: '8px' }}>→ {t.timeline1}</li>
                  <li style={{ marginBottom: '8px' }}>→ {t.timeline2}</li>
                  <li style={{ marginBottom: '8px' }}>→ {t.timeline3}</li>
                  <li>→ {t.timeline4}</li>
                </ul>
              </div>
            </section>

            <section className="fade-in">
              <h2 className="section-label">{t.methods}</h2>
              <div style={{ background: '#ffffff', border: '1px solid #666', padding: '24px' }}>
                <ul style={{ listStyle: 'none', fontSize: '14px', lineHeight: 1.9 }}>
                  <li style={{ marginBottom: '8px' }}>→ {t.method1}</li>
                  <li style={{ marginBottom: '8px' }}>→ {t.method2}</li>
                  <li style={{ marginBottom: '8px' }}>→ {t.method3}</li>
                  <li>→ {t.method4}</li>
                </ul>
              </div>
            </section>
          </div>

          {/* Partners */}
          <section className="fade-in" style={{ marginBottom: '40px' }}>
            <h2 className="section-label">{t.partners}</h2>
            <div style={{ background: '#ffffff', border: '1px solid #666', padding: '28px' }}>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#1a1a1a' }}>
                {t.partnersText}
              </p>
            </div>
          </section>

          {/* Expected Outputs */}
          <section className="fade-in" style={{ marginBottom: '40px' }}>
            <h2 className="section-label">{t.outputs}</h2>
            <div style={{ background: '#ffffff', border: '1px solid #666', padding: '28px' }}>
              <ul style={{ listStyle: 'none', fontSize: '15px', lineHeight: 2 }}>
                <li>→ {t.output1}</li>
                <li>→ {t.output2}</li>
                <li>→ {t.output3}</li>
                <li>→ {t.output4}</li>
              </ul>
            </div>
          </section>

          {/* Funding & Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '40px' }}>
            <section className="fade-in">
              <h2 className="section-label">{t.funding}</h2>
              <div style={{ background: '#ffffff', border: '1px solid #666', padding: '24px' }}>
                <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#1a1a1a' }}>
                  {t.fundingText}
                </p>
              </div>
            </section>

            <section className="fade-in">
              <h2 className="section-label">{t.status}</h2>
              <div style={{ background: '#ffffff', border: '1px solid #666', padding: '24px' }}>
                <p style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a' }}>
                  {t.statusText}
                </p>
              </div>
            </section>
          </div>

          {/* Back Link */}
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <Link href="/" className="back-link" style={{ fontSize: '16px' }}>
              {t.backHome}
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}