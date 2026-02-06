import Head from 'next/head'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function PlaceBasedIdentity() {
  const [lang, setLang] = useState('en')
  const [theme, setTheme] = useState('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }
  
  const content = {
    en: {
      backHome: '[←] back to home',
      projectTitle: 'Place-based Digital Identity',
      tagline: 'Using place and location as identity mechanisms for governance',
      
      overview: 'Overview',
      overviewText: 'This research initiative investigates whether place and location can serve as identity mechanisms for engaging with governance processes—offering an alternative to surveillance-based digital ID systems. Instead of tracking individuals, we explore how people can participate in decision-making about shaping places through their connection to specific locations, enabling meaningful civic engagement while protecting privacy and avoiding state surveillance.',
      
      problem: 'The digital identity problem',
      problemText: 'Traditional digital identity systems create comprehensive surveillance infrastructure—tracking individuals across contexts, building profiles, enabling state and corporate monitoring. Yet meaningful participation in governance processes that shape the built environment often requires some form of verification. Can we create identity mechanisms that enable participation without surveillance? Can connection to place become a basis for civic engagement that protects rather than exposes people?',
      
      approach: 'Research approach',
      approach1: 'Exploring place-based credentials that verify location connection, not individual identity',
      approach2: 'Investigating how blockchain can enable privacy-preserving verification',
      approach3: 'Testing mechanisms for civic participation tied to place rather than person',
      approach4: 'Designing systems that resist function creep and surveillance expansion',
      approach5: 'Building on privacy-first approaches from cyberfeminist and anarchist traditions',
      
      examples: 'Possible applications',
      ex1: 'Neighbourhood planning participation without personal identification',
      ex2: 'Community resource allocation based on place-residency, not tracked individuals',
      ex3: 'Local decision-making that protects vulnerable residents from state surveillance',
      ex4: 'Temporary access to services based on physical presence, not permanent records',
      ex5: 'Democratic participation in shaping places that doesn\'t feed surveillance infrastructure',
      
      principles: 'Design principles',
      p1: 'Privacy by design – no surveillance infrastructure',
      p2: 'Minimal data collection – only what\'s necessary for participation',
      p3: 'Resist function creep – prevent expansion into tracking systems',
      p4: 'Community control – places define their own verification needs',
      p5: 'Protect vulnerable people – especially those avoiding state systems',
      
      challenges: 'Key challenges',
      challengesText: 'This work must navigate tensions between enabling participation and avoiding surveillance, between verification and privacy, between place-based belonging and exclusion. We must ensure these systems genuinely protect people—especially those most vulnerable to state monitoring—while enabling meaningful civic engagement in shaping the built environment.',
      
      connections: 'Connections to other work',
      connectionsText: 'This initiative connects directly to Place-based Data Sovereignty (how do communities verify participation in data governance?) and National Data Infrastructure (how can identity remain place-based as systems scale?). Together, these projects explore whether Web3 can support governance that empowers rather than surveils communities shaping their places.',
      
      timeline: 'Timeline',
      timelineText: 'Ongoing exploratory research (2025-2028+)',
      
      funding: 'Funding and partnerships',
      fundingText: 'This initiative welcomes partnerships with privacy advocacy organisations, community groups working with vulnerable populations, technologists building privacy-preserving systems, and researchers exploring alternatives to surveillance capitalism. Funding opportunities welcome.',
      
      getInvolved: 'Get involved',
      getInvolvedText: 'If your work intersects with digital privacy, community governance, or building alternatives to surveillance systems, we would welcome collaboration. This is early-stage exploratory work and we are actively seeking partners and critical feedback.',
    },
    cy: {
      backHome: '[←] nôl i\'r hafan',
      projectTitle: 'Hunaniaeth Ddigidol Lle-seiliedig',
      tagline: 'Defnyddio lle a lleoliad fel mecanweithiau hunaniaeth ar gyfer llywodraethiant',
      
      overview: 'Trosolwg',
      overviewText: 'Mae\'r fenter ymchwil hon yn ymchwilio a all lle a lleoliad wasanaethu fel mecanweithiau hunaniaeth ar gyfer ymgysylltu â phrosesau llywodraethiant—gan gynnig dewis arall i systemau ID digidol seiliedig ar wyliadwriaeth. Yn hytrach na olrhain unigolion, rydym yn archwilio sut gall pobl gymryd rhan mewn gwneud penderfyniadau am lunio lleoedd trwy eu cysylltiad â lleoliadau penodol, gan alluogi ymgysylltiad dinesig ystyrlon tra\'n diogelu preifatrwydd ac osgoi gwyliadwriaeth y wladwriaeth.',
      
      problem: 'Problem hunaniaeth ddigidol',
      problemText: 'Mae systemau hunaniaeth ddigidol traddodiadol yn creu seilwaith gwyliadwriaeth cynhwysfawr—olrhain unigolion ar draws cyd-destunau, adeiladu proffiliau, galluogi monitro gan y wladwriaeth a chorfforaethau. Eto mae cyfranogiad ystyrlon mewn prosesau llywodraethiant sy\'n llunio\'r amgylchedd adeiledig yn aml yn gofyn am ryw fath o ddilysu. A allwn greu mecanweithiau hunaniaeth sy\'n galluogi cyfranogiad heb wyliadwriaeth? A all cysylltiad â lle ddod yn sail ar gyfer ymgysylltiad dinesig sy\'n diogelu yn hytrach nag yn amlygu pobl?',
      
      approach: 'Dull ymchwil',
      approach1: 'Archwilio cymwysterau lle-seiliedig sy\'n dilysu cysylltiad lleoliad, nid hunaniaeth unigol',
      approach2: 'Ymchwilio sut gall blockchain alluogi dilysu sy\'n diogelu preifatrwydd',
      approach3: 'Profi mecanweithiau ar gyfer cyfranogiad dinesig sy\'n gysylltiedig â lle yn hytrach na pherson',
      approach4: 'Dylunio systemau sy\'n gwrthsefyll ymlusgo swyddogaeth ac ehangu gwyliadwriaeth',
      approach5: 'Adeiladu ar ddulliau preifatrwydd yn gyntaf o draddodiadau seiberffeministaidd ac anarchaidd',
      
      examples: 'Cymwysiadau posibl',
      ex1: 'Cyfranogiad cynllunio cymdogaeth heb adnabyddiaeth bersonol',
      ex2: 'Dyrannu adnoddau cymunedol yn seiliedig ar breswyl-le, nid unigolion sy\'n cael eu holrhain',
      ex3: 'Gwneud penderfyniadau lleol sy\'n diogelu preswylwyr bregus rhag gwyliadwriaeth y wladwriaeth',
      ex4: 'Mynediad dros dro i wasanaethau yn seiliedig ar bresenoldeb corfforol, nid cofnodion parhaol',
      ex5: 'Cyfranogiad democrataidd mewn llunio lleoedd nad yw\'n bwydo seilwaith gwyliadwriaeth',
      
      principles: 'Egwyddorion dylunio',
      p1: 'Preifatrwydd wrth ddylunio – dim seilwaith gwyliadwriaeth',
      p2: 'Casglu data lleiaf – dim ond yr hyn sy\'n angenrheidiol ar gyfer cyfranogiad',
      p3: 'Gwrthsefyll ymlusgo swyddogaeth – atal ehangu i systemau olrhain',
      p4: 'Rheolaeth gymunedol – lleoedd yn diffinio eu hanghenion dilysu eu hunain',
      p5: 'Diogelu pobl fregus – yn enwedig y rhai sy\'n osgoi systemau\'r wladwriaeth',
      
      challenges: 'Heriau allweddol',
      challengesText: 'Rhaid i\'r gwaith hwn lywio tensiynau rhwng galluogi cyfranogiad ac osgoi gwyliadwriaeth, rhwng dilysu a phreifatrwydd, rhwng perthyn lle-seiliedig ac eithrio. Rhaid i ni sicrhau bod y systemau hyn yn diogelu pobl o ddifrif—yn enwedig y rhai mwyaf bregus i fonitro gan y wladwriaeth—tra\'n galluogi ymgysylltiad dinesig ystyrlon mewn llunio\'r amgylchedd adeiledig.',
      
      connections: 'Cysylltiadau â gwaith arall',
      connectionsText: 'Mae\'r fenter hon yn cysylltu\'n uniongyrchol â Sofraniaeth Data Lle-seiliedig (sut mae cymunedau\'n dilysu cyfranogiad mewn llywodraethiant data?) a Seilwaith Data Cenedlaethol (sut gall hunaniaeth aros yn lle-seiliedig wrth i systemau raddio?). Gyda\'i gilydd, mae\'r prosiectau hyn yn archwilio a all Gwe3 gefnogi llywodraethiant sy\'n grymuso yn hytrach na gwylio cymunedau sy\'n llunio eu lleoedd.',
      
      timeline: 'Amserlen',
      timelineText: 'Ymchwil archwiliadol barhaus (2025-2028+)',
      
      funding: 'Cyllid a phartneriaethau',
      fundingText: 'Mae\'r fenter hon yn croesawu partneriaethau gyda sefydliadau eiriolaeth preifatrwydd, grwpiau cymunedol sy\'n gweithio gyda phoblogaethau bregus, technolegwyr sy\'n adeiladu systemau sy\'n diogelu preifatrwydd, ac ymchwilwyr sy\'n archwilio dewisiadau amgen i gyfalafïaeth gwyliadwriaeth. Croeso i gyfleoedd ariannu.',
      
      getInvolved: 'Cymryd rhan',
      getInvolvedText: 'Os yw eich gwaith yn croestorri â phreifatrwydd digidol, llywodraethiant cymunedol, neu adeiladu dewisiadau amgen i systemau gwyliadwriaeth, byddem yn croesawu cydweithrediad. Mae hwn yn waith archwiliadol cam cynnar ac rydym yn chwilio\'n weithredol am bartneriaid ac adborth beirniadol.',
    }
  }
  
  const t = content[lang]

  return (
    <>
      <Head>
        <title>{t.projectTitle} | Leol Lab</title>
        <meta name="description" content="Investigating place and location as identity mechanisms for governance without surveillance" />
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
          background: ${theme === 'light' ? '#f5f5f5' : '#0a0a0a'};
          color: ${theme === 'light' ? '#1a1a1a' : '#e0e0e0'};
          line-height: 1.6;
          font-size: 16px;
          transition: background 0.3s ease, color 0.3s ease;
        }
        
        .fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        
        .section-label {
          font-size: 11px;
          letter-spacing: 2px;
          color: ${theme === 'light' ? '#666' : '#999'};
          margin-bottom: 12px;
          font-weight: 700;
        }
        
        .theme-btn, .lang-btn {
          background: ${theme === 'light' ? '#ffffff' : '#1a1a1a'};
          border: 1px solid ${theme === 'light' ? '#666' : '#999'};
          color: ${theme === 'light' ? '#1a1a1a' : '#e0e0e0'};
          padding: 8px 12px;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Space Mono', monospace;
          font-weight: 700;
          letter-spacing: 1px;
        }
        
        .theme-btn:hover, .lang-btn:hover {
          background: ${theme === 'light' ? '#f0f0f0' : '#2a2a2a'};
          border-color: ${theme === 'light' ? '#444' : '#bbb'};
        }
        
        .lang-btn.active {
          background: ${theme === 'light' ? '#1a1a1a' : '#e0e0e0'};
          color: ${theme === 'light' ? '#ffffff' : '#0a0a0a'};
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
          color: ${theme === 'light' ? '#666' : '#999'};
          font-size: 11px;
          transition: color 0.2s;
          letter-spacing: 1px;
        }
        
        .back-link:hover {
          color: ${theme === 'light' ? '#1a1a1a' : '#e0e0e0'};
        }
      `}</style>

      {/* Theme & Language Toggle */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 2000, display: 'flex', gap: '8px' }}>
        <button 
          className="theme-btn"
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? '[0x00]' : '[0xFF]'}
        </button>
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
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <Link href="/" className="back-link">
            {t.backHome}
          </Link>

          {/* Header */}
          <section className="fade-in" style={{ marginBottom: '60px' }}>
            <div style={{ 
              background: theme === 'light' ? '#ffffff' : '#1a1a1a', 
              border: `2px solid ${theme === 'light' ? '#666' : '#999'}`, 
              padding: '40px',
              transition: 'background 0.3s ease, border 0.3s ease'
            }}>
              <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '16px', lineHeight: 1.2, letterSpacing: '-1px' }}>
                {t.projectTitle}
              </h1>
              <p style={{ fontSize: '14px', color: theme === 'light' ? '#666' : '#999' }}>
                {t.tagline}
              </p>
            </div>
          </section>

          {/* Overview */}
          <section className="fade-in" style={{ marginBottom: '40px' }}>
            <h2 className="section-label">{t.overview}</h2>
            <div style={{ 
              background: theme === 'light' ? '#ffffff' : '#1a1a1a', 
              border: `2px solid ${theme === 'light' ? '#666' : '#999'}`, 
              padding: '28px',
              transition: 'background 0.3s ease, border 0.3s ease'
            }}>
              <p style={{ fontSize: '14px', lineHeight: 1.7 }}>
                {t.overviewText}
              </p>
            </div>
          </section>

          {/* Problem */}
          <section className="fade-in" style={{ marginBottom: '40px' }}>
            <h2 className="section-label">{t.problem}</h2>
            <div style={{ 
              background: theme === 'light' ? '#ffffff' : '#1a1a1a', 
              border: `2px solid ${theme === 'light' ? '#666' : '#999'}`, 
              padding: '28px',
              transition: 'background 0.3s ease, border 0.3s ease'
            }}>
              <p style={{ fontSize: '14px', lineHeight: 1.7 }}>
                {t.problemText}
              </p>
            </div>
          </section>

          {/* Research Approach */}
          <section className="fade-in" style={{ marginBottom: '40px' }}>
            <h2 className="section-label">{t.approach}</h2>
            <div style={{ 
              background: theme === 'light' ? '#ffffff' : '#1a1a1a', 
              border: `2px solid ${theme === 'light' ? '#666' : '#999'}`, 
              padding: '28px',
              transition: 'background 0.3s ease, border 0.3s ease'
            }}>
              <ul style={{ listStyle: 'none', fontSize: '14px', lineHeight: 2 }}>
                <li>[→] {t.approach1}</li>
                <li>[→] {t.approach2}</li>
                <li>[→] {t.approach3}</li>
                <li>[→] {t.approach4}</li>
                <li>[→] {t.approach5}</li>
              </ul>
            </div>
          </section>

          {/* Examples & Principles */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
            <section className="fade-in">
              <h2 className="section-label">{t.examples}</h2>
              <div style={{ 
                background: theme === 'light' ? '#ffffff' : '#1a1a1a', 
                border: `2px solid ${theme === 'light' ? '#666' : '#999'}`, 
                padding: '24px',
                transition: 'background 0.3s ease, border 0.3s ease'
              }}>
                <ul style={{ listStyle: 'none', fontSize: '13px', lineHeight: 1.9 }}>
                  <li style={{ marginBottom: '8px' }}>[→] {t.ex1}</li>
                  <li style={{ marginBottom: '8px' }}>[→] {t.ex2}</li>
                  <li style={{ marginBottom: '8px' }}>[→] {t.ex3}</li>
                  <li style={{ marginBottom: '8px' }}>[→] {t.ex4}</li>
                  <li>[→] {t.ex5}</li>
                </ul>
              </div>
            </section>

            <section className="fade-in">
              <h2 className="section-label">{t.principles}</h2>
              <div style={{ 
                background: theme === 'light' ? '#ffffff' : '#1a1a1a', 
                border: `2px solid ${theme === 'light' ? '#666' : '#999'}`, 
                padding: '24px',
                transition: 'background 0.3s ease, border 0.3s ease'
              }}>
                <ul style={{ listStyle: 'none', fontSize: '13px', lineHeight: 1.9 }}>
                  <li style={{ marginBottom: '8px' }}>[→] {t.p1}</li>
                  <li style={{ marginBottom: '8px' }}>[→] {t.p2}</li>
                  <li style={{ marginBottom: '8px' }}>[→] {t.p3}</li>
                  <li style={{ marginBottom: '8px' }}>[→] {t.p4}</li>
                  <li>[→] {t.p5}</li>
                </ul>
              </div>
            </section>
          </div>

          {/* Challenges */}
          <section className="fade-in" style={{ marginBottom: '40px' }}>
            <h2 className="section-label">{t.challenges}</h2>
            <div style={{ 
              background: theme === 'light' ? '#ffffff' : '#1a1a1a', 
              border: `2px solid ${theme === 'light' ? '#666' : '#999'}`, 
              padding: '28px',
              transition: 'background 0.3s ease, border 0.3s ease'
            }}>
              <p style={{ fontSize: '14px', lineHeight: 1.7 }}>
                {t.challengesText}
              </p>
            </div>
          </section>

          {/* Connections */}
          <section className="fade-in" style={{ marginBottom: '40px' }}>
            <h2 className="section-label">{t.connections}</h2>
            <div style={{ 
              background: theme === 'light' ? '#ffffff' : '#1a1a1a', 
              border: `2px solid ${theme === 'light' ? '#666' : '#999'}`, 
              padding: '28px',
              transition: 'background 0.3s ease, border 0.3s ease'
            }}>
              <p style={{ fontSize: '14px', lineHeight: 1.7 }}>
                {t.connectionsText}
              </p>
            </div>
          </section>

          {/* Timeline & Funding */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '40px' }}>
            <section className="fade-in">
              <h2 className="section-label">{t.timeline}</h2>
              <div style={{ 
                background: theme === 'light' ? '#ffffff' : '#1a1a1a', 
                border: `2px solid ${theme === 'light' ? '#666' : '#999'}`, 
                padding: '24px',
                transition: 'background 0.3s ease, border 0.3s ease'
              }}>
                <p style={{ fontSize: '13px', lineHeight: 1.7 }}>
                  {t.timelineText}
                </p>
              </div>
            </section>

            <section className="fade-in">
              <h2 className="section-label">{t.funding}</h2>
              <div style={{ 
                background: theme === 'light' ? '#ffffff' : '#1a1a1a', 
                border: `2px solid ${theme === 'light' ? '#666' : '#999'}`, 
                padding: '24px',
                transition: 'background 0.3s ease, border 0.3s ease'
              }}>
                <p style={{ fontSize: '13px', lineHeight: 1.7 }}>
                  {t.fundingText}
                </p>
              </div>
            </section>
          </div>

          {/* Get Involved */}
          <section className="fade-in" style={{ marginBottom: '40px' }}>
            <h2 className="section-label">{t.getInvolved}</h2>
            <div style={{ 
              background: theme === 'light' ? '#ffffff' : '#1a1a1a', 
              border: `2px solid ${theme === 'light' ? '#666' : '#999'}`, 
              padding: '28px',
              transition: 'background 0.3s ease, border 0.3s ease'
            }}>
              <p style={{ fontSize: '14px', lineHeight: 1.7 }}>
                {t.getInvolvedText}
              </p>
            </div>
          </section>

          {/* Back Link */}
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <Link href="/" className="back-link">
              {t.backHome}
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}