import Head from 'next/head'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [lang, setLang] = useState('en')
  const [theme, setTheme] = useState('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') || 'dark'
    setTheme(savedTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }
  
  const content = {
    en: {
      heroTitle: 'Who has power over place?',
      heroSubtitle: 'Leol Lab',
      heroStatement: 'Researching Web3-enabled governance systems that centre marginalised voices in shaping the built environment.',
      
      powerVizTitle: 'Distance from decision-making power',
      powerVizLabel1: 'Capital · Property · Authority',
      powerVizLabel2: 'Institutional actors',
      powerVizLabel3: 'Communities',
      powerVizLabel4: 'Marginalised voices',
      
      problemTitle: 'The problem',
      problemStatement: 'Decision-making power over Cardiff\'s built environment is held by those with capital, property rights, and institutional authority. Communities live with the consequences but are excluded from control. Within communities themselves, marginalised people—disabled people, renters, minorities—are further silenced by majoritarian dynamics.',
      
      cardiffTitle: 'Cardiff: 28 wards',
      cardiffWith: '6 with community councils (tokenistic)',
      cardiffWithout: '22 with no formal structure',
      cardiffPower: 'All → zero decision-making power',
      cardiffMargin: 'Marginalised → double exclusion',
      
      questionsTitle: 'Research questions',
      questions: [
        'How can governance systems engage all stakeholders whilst centering communities?',
        'What mechanisms prevent both institutional capture and majoritarian tyranny?',
        'How does Web3 technology enable anti-majoritarian governance at scale?',
        'What does Design Justice look like in blockchain-based urban planning systems?',
        'How do we redistribute epistemic authority alongside decision-making power?',
      ],
      
      methodTitle: 'Design Justice methodology',
      methodText: 'This research uses Design Justice (Costanza-Chock, 2020) as an umbrella framework, synthesising power analysis, epistemic justice, feminist technology critique, and Indigenous Data Sovereignty principles.',
      methodCore: 'Design Justice centres those most affected by design decisions in the design process itself—not as consultants, but as leaders.',
      
      statusTitle: 'Research status',
      statusPhD: 'PhD Year 1',
      statusInst: 'Welsh School of Architecture, Cardiff University',
      statusFunding: 'Seeking partnerships and funding',
      
      contactTitle: 'Contact',
      contactName: 'Lucy Dunhill',
      contactEmail: 'dunhilll@cardiff.ac.uk',
      contactAvail: 'Available for meetings in Cardiff and online',
      
      learnMore: 'Learn more',
      whyWeb3Link: 'Why Web3?',
      governanceLink: 'Data Governance',
      privacyLink: 'Privacy',
      
      footerTagline: 'Web3 · Design Justice · Inclusive Governance',
    },
    cy: {
      heroTitle: 'Pwy sydd â phŵer dros le?',
      heroSubtitle: 'Leol Lab',
      heroStatement: 'Ymchwilio i systemau llywodraethiant Gwe3-alluog sy\'n canoli lleisiau ymylol wrth lunio\'r amgylchedd adeiledig.',
      
      powerVizTitle: 'Pellter o bŵer gwneud penderfyniadau',
      powerVizLabel1: 'Cyfalaf · Eiddo · Awdurdod',
      powerVizLabel2: 'Actorion sefydliadol',
      powerVizLabel3: 'Cymunedau',
      powerVizLabel4: 'Lleisiau ymylol',
      
      problemTitle: 'Y broblem',
      problemStatement: 'Mae pŵer gwneud penderfyniadau dros amgylchedd adeiledig Caerdydd yn cael ei ddal gan y rheini â chyfalaf, hawliau eiddo, ac awdurdod sefydliadol. Mae cymunedau yn byw gyda\'r canlyniadau ond yn cael eu heithrio o reolaeth. O fewn cymunedau eu hunain, mae pobl ymylol—pobl anabl, rhentwyr, lleiafrifoedd—yn cael eu tawelu ymhellach gan ddeinameg fwyafrifol.',
      
      cardiffTitle: 'Caerdydd: 28 ward',
      cardiffWith: '6 gyda chynghorau cymuned (tocenistig)',
      cardiffWithout: '22 heb strwythur ffurfiol',
      cardiffPower: 'Pob un → sero pŵer gwneud penderfyniadau',
      cardiffMargin: 'Ymylol → gwaharddiad dwbl',
      
      questionsTitle: 'Cwestiynau ymchwil',
      questions: [
        'Sut gall systemau llywodraethiant ymgysylltu â phob rhanddeiliad tra\'n canoli cymunedau?',
        'Pa fecanweithiau sy\'n atal cipio sefydliadol a gormes mwyafrifol?',
        'Sut mae technoleg Gwe3 yn galluogi llywodraethiant gwrth-fwyafrifol ar raddfa?',
        'Beth mae Cyfiawnder Dylunio yn ei olygu mewn systemau cynllunio trefol blockchain?',
        'Sut rydym yn ailddosbarthu awdurdod epistemolegol ochr yn ochr â phŵer gwneud penderfyniadau?',
      ],
      
      methodTitle: 'Methodoleg Cyfiawnder Dylunio',
      methodText: 'Mae\'r ymchwil hwn yn defnyddio Cyfiawnder Dylunio (Costanza-Chock, 2020) fel fframwaith ymbarél, gan syntheseiddio dadansoddiad pŵer, cyfiawnder epistemolegol, beirniadaeth technoleg ffeministaidd, ac egwyddorion Sofraniaeth Data Brodorol.',
      methodCore: 'Mae Cyfiawnder Dylunio yn canoli\'r rhai sy\'n cael eu heffeithio fwyaf gan benderfyniadau dylunio yn y broses dylunio ei hun—nid fel ymgynghorwyr, ond fel arweinwyr.',
      
      statusTitle: 'Statws ymchwil',
      statusPhD: 'PhD Blwyddyn 1',
      statusInst: 'Ysgol Bensaernïaeth Cymru, Prifysgol Caerdydd',
      statusFunding: 'Yn chwilio am bartneriaethau a chyllid',
      
      contactTitle: 'Cysylltu',
      contactName: 'Lucy Dunhill',
      contactEmail: 'dunhilll@cardiff.ac.uk',
      contactAvail: 'Ar gael ar gyfer cyfarfodydd yng Nghaerdydd ac ar-lein',
      
      learnMore: 'Dysgu mwy',
      whyWeb3Link: 'Pam Gwe3?',
      governanceLink: 'Llywodraethu Data',
      privacyLink: 'Preifatrwydd',
      
      footerTagline: 'Gwe3 · Cyfiawnder Dylunio · Llywodraethiant Cynhwysol',
    }
  }
  
  const t = content[lang]

  return (
    <>
      <Head>
        <title>Leol Lab | Web3 Governance Research</title>
        <meta name="description" content="Research investigating Web3-enabled governance systems that centre marginalised voices in shaping the built environment" />
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
        
        @keyframes glow {
          0%, 100% { opacity: 0.6; filter: blur(1px); }
          50% { opacity: 1; filter: blur(0px); }
        }
        
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        
        * { 
          margin: 0; 
          padding: 0; 
          box-sizing: border-box; 
          font-family: 'Space Mono', 'Courier New', Courier, monospace;
        }
        
        body {
          background: ${theme === 'light' ? '#f5f5f5' : '#000000'};
          color: ${theme === 'light' ? '#1a1a1a' : '#e0e0e0'};
          line-height: 1.6;
          overflow-x: hidden;
          font-size: 16px;
          transition: background 0.3s ease, color 0.3s ease;
        }
        
        body::before {
          content: "";
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: ${theme === 'dark' ? 'repeating-linear-gradient(0deg, rgba(255, 0, 100, 0.03), rgba(255, 0, 100, 0.03) 1px, transparent 1px, transparent 2px)' : 'none'};
          pointer-events: none;
          z-index: 9999;
        }
        
        .scanline {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: ${theme === 'dark' ? 'linear-gradient(transparent, rgba(255, 0, 100, 0.5), transparent)' : 'none'};
          animation: scanline 8s linear infinite;
          pointer-events: none;
          z-index: 10000;
          opacity: 0.3;
        }
        
        .fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        
        .content-box {
          background: ${theme === 'light' ? '#ffffff' : 'rgba(10, 0, 20, 0.8)'};
          border: ${theme === 'light' ? '2px solid #666' : '1px solid rgba(255, 0, 100, 0.3)'};
          padding: 60px 40px;
          margin: 40px auto;
          max-width: 900px;
          position: relative;
        }
        
        .content-box::before {
          content: '';
          position: absolute;
          top: -1px;
          left: -1px;
          right: -1px;
          bottom: -1px;
          background: ${theme === 'dark' ? 'linear-gradient(45deg, rgba(255, 0, 100, 0.1), transparent, rgba(255, 0, 100, 0.1))' : 'none'};
          z-index: -1;
          opacity: 0.5;
        }
        
        .hero-title {
          font-size: clamp(32px, 8vw, 72px);
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 24px;
          text-align: center;
          letter-spacing: -2px;
        }
        
        .hero-subtitle {
          font-size: 14px;
          letter-spacing: 4px;
          text-align: center;
          margin-bottom: 40px;
          color: ${theme === 'light' ? '#666' : 'rgba(255, 0, 100, 0.8)'};
          text-transform: uppercase;
        }
        
        .section-title {
          font-size: 11px;
          letter-spacing: 3px;
          color: ${theme === 'light' ? '#666' : 'rgba(255, 0, 100, 0.7)'};
          margin-bottom: 24px;
          font-weight: 700;
          text-transform: uppercase;
          text-align: center;
        }
        
        .ascii-circle-container {
          width: 100%;
          max-width: 600px;
          margin: 60px auto;
          position: relative;
        }
        
        .ascii-circle {
          font-family: 'Space Mono', monospace;
          font-size: 8px;
          line-height: 1;
          white-space: pre;
          text-align: center;
          color: ${theme === 'light' ? '#666' : 'rgba(255, 0, 100, 0.6)'};
          animation: glow 3s ease-in-out infinite;
          filter: ${theme === 'dark' ? 'drop-shadow(0 0 2px rgba(255, 0, 100, 0.5))' : 'none'};
        }
        
        .power-label {
          position: absolute;
          font-size: 9px;
          color: ${theme === 'light' ? '#666' : '#e0e0e0'};
          text-align: center;
          white-space: nowrap;
        }
        
        .label-center { top: 50%; left: 50%; transform: translate(-50%, -50%); font-weight: 700; }
        .label-ring1 { top: 30%; left: 50%; transform: translateX(-50%); }
        .label-ring2 { top: 15%; left: 50%; transform: translateX(-50%); }
        .label-ring3 { top: 2%; left: 50%; transform: translateX(-50%); color: ${theme === 'dark' ? 'rgba(255, 0, 100, 0.8)' : '#666'}; }
        
        .statement {
          font-size: 16px;
          line-height: 1.8;
          margin: 24px 0;
          text-align: center;
        }
        
        .cardiff-stats {
          margin: 40px 0;
          padding: 32px;
          border: ${theme === 'light' ? '1px solid #ddd' : '1px solid rgba(255, 0, 100, 0.2)'};
          background: ${theme === 'light' ? '#fafafa' : 'rgba(0, 0, 0, 0.3)'};
        }
        
        .cardiff-stats p {
          font-size: 13px;
          line-height: 2;
          margin: 8px 0;
        }
        
        .cardiff-stats strong {
          color: ${theme === 'dark' ? 'rgba(255, 0, 100, 0.9)' : '#1a1a1a'};
        }
        
        .question-list {
          list-style: none;
          margin: 32px 0;
        }
        
        .question-list li {
          font-size: 14px;
          line-height: 1.8;
          margin: 16px 0;
          padding-left: 24px;
          position: relative;
        }
        
        .question-list li::before {
          content: '→';
          position: absolute;
          left: 0;
          color: ${theme === 'dark' ? 'rgba(255, 0, 100, 0.7)' : '#666'};
        }
        
        .method-text {
          font-size: 14px;
          line-height: 1.8;
          margin: 20px 0;
        }
        
        .method-text strong {
          color: ${theme === 'dark' ? 'rgba(255, 0, 100, 0.9)' : '#1a1a1a'};
        }
        
        .link-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin: 32px 0;
        }
        
        .link-button {
          padding: 16px;
          text-align: center;
          border: ${theme === 'light' ? '1px solid #666' : '1px solid rgba(255, 0, 100, 0.3)'};
          background: ${theme === 'light' ? '#ffffff' : 'rgba(0, 0, 0, 0.5)'};
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          transition: all 0.2s;
          cursor: pointer;
        }
        
        .link-button:hover {
          background: ${theme === 'light' ? '#f0f0f0' : 'rgba(255, 0, 100, 0.1)'};
          border-color: ${theme === 'dark' ? 'rgba(255, 0, 100, 0.6)' : '#444'};
        }
        
        .theme-btn, .lang-btn {
          background: ${theme === 'light' ? '#ffffff' : 'rgba(0, 0, 0, 0.8)'};
          border: 1px solid ${theme === 'light' ? '#666' : 'rgba(255, 0, 100, 0.4)'};
          color: ${theme === 'light' ? '#1a1a1a' : '#e0e0e0'};
          padding: 8px 16px;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Space Mono', monospace;
          font-weight: 700;
          letter-spacing: 1px;
        }
        
        .theme-btn:hover, .lang-btn:hover {
          background: ${theme === 'light' ? '#f0f0f0' : 'rgba(255, 0, 100, 0.2)'};
          border-color: ${theme === 'light' ? '#444' : 'rgba(255, 0, 100, 0.8)'};
        }
        
        .lang-btn.active {
          background: ${theme === 'light' ? '#1a1a1a' : 'rgba(255, 0, 100, 0.3)'};
          color: ${theme === 'light' ? '#ffffff' : '#ffffff'};
          border-color: ${theme === 'dark' ? 'rgba(255, 0, 100, 0.8)' : '#1a1a1a'};
        }
        
        a {
          color: inherit;
          text-decoration: none;
        }
        
        footer {
          text-align: center;
          padding: 60px 40px 40px;
          font-size: 11px;
          color: ${theme === 'light' ? '#666' : 'rgba(255, 0, 100, 0.5)'};
          letter-spacing: 2px;
        }
        
        @media (max-width: 768px) {
          .content-box {
            padding: 40px 24px;
            margin: 20px 16px;
          }
          .ascii-circle {
            font-size: 6px;
          }
          .hero-title {
            font-size: 36px;
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
          .scanline, .ascii-circle {
            animation: none !important;
          }
        }
      `}</style>

      <div className="scanline" aria-hidden="true"></div>

      {/* Theme & Language Toggle */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 2000, display: 'flex', gap: '8px' }}>
        <button 
          className="theme-btn"
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? '[DARK]' : '[LIGHT]'}
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

      <main style={{ minHeight: '100vh', padding: '80px 20px 40px' }}>
        {/* Hero */}
        <section className="fade-in content-box">
          <div className="hero-subtitle">{t.heroSubtitle}</div>
          <h1 className="hero-title">{t.heroTitle}</h1>
          <p className="statement">{t.heroStatement}</p>
        </section>

        {/* Power Visualization */}
        <section className="fade-in content-box">
          <h2 className="section-title">{t.powerVizTitle}</h2>
          
          <div className="ascii-circle-container">
            <pre className="ascii-circle" aria-label="Concentric circles showing distance from power">{`
                    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
                 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
               ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
             ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
            ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
           ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
          ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
         ░░░░░░░░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░
         ░░░░░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░
        ░░░░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░
        ░░░░▓▓▓▓▓▓▓████████████████████████████████▓▓▓▓▓▓░░░░
        ░░░▓▓▓▓▓▓████████████████████████████████████▓▓▓▓▓░░░
        ░░░▓▓▓▓▓████████████████████████████████████████▓▓▓░░░
        ░░▓▓▓▓▓████████████████████████████████████████▓▓▓▓░░
        ░░▓▓▓▓████████████████████████████████████████████▓▓░░
        ░░▓▓▓████████████████████████████████████████████▓▓▓░░
        ░▓▓▓▓████████████████████████████████████████████▓▓▓▓░
        ░▓▓▓████████████████████████████████████████████████▓░
        ░▓▓████████████████████████████████████████████████▓▓░
        ░▓▓████████████████████████████████████████████████▓▓░
        ░▓▓████████████████████████████████████████████████▓▓░
        ░▓▓▓████████████████████████████████████████████████▓░
        ░▓▓▓▓████████████████████████████████████████████▓▓▓▓░
        ░░▓▓▓████████████████████████████████████████████▓▓▓░░
        ░░▓▓▓▓████████████████████████████████████████████▓▓░░
        ░░▓▓▓▓▓████████████████████████████████████████▓▓▓▓░░
        ░░░▓▓▓▓▓████████████████████████████████████████▓▓▓░░░
        ░░░▓▓▓▓▓▓████████████████████████████████████▓▓▓▓▓░░░
        ░░░░▓▓▓▓▓▓▓████████████████████████████████▓▓▓▓▓▓░░░░
        ░░░░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░
         ░░░░░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░
         ░░░░░░░░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░
          ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
           ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
            ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
             ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
               ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
                 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
                    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
            `}</pre>
            
            <div className="power-label label-center">{t.powerVizLabel1}</div>
            <div className="power-label label-ring1">{t.powerVizLabel2}</div>
            <div className="power-label label-ring2">{t.powerVizLabel3}</div>
            <div className="power-label label-ring3">{t.powerVizLabel4}</div>
          </div>
        </section>

        {/* Problem */}
        <section className="fade-in content-box">
          <h2 className="section-title">{t.problemTitle}</h2>
          <p className="statement">{t.problemStatement}</p>
          
          <div className="cardiff-stats">
            <p><strong>{t.cardiffTitle}</strong></p>
            <p>→ {t.cardiffWith}</p>
            <p>→ {t.cardiffWithout}</p>
            <p>→ {t.cardiffPower}</p>
            <p>→ {t.cardiffMargin}</p>
          </div>
        </section>

        {/* Research Questions */}
        <section className="fade-in content-box">
          <h2 className="section-title">{t.questionsTitle}</h2>
          <ul className="question-list">
            {t.questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </section>

        {/* Methodology */}
        <section className="fade-in content-box">
          <h2 className="section-title">{t.methodTitle}</h2>
          <p className="method-text">{t.methodText}</p>
          <p className="method-text"><strong>{t.methodCore}</strong></p>
        </section>

        {/* Learn More */}
        <section className="fade-in content-box">
          <h2 className="section-title">{t.learnMore}</h2>
          <div className="link-grid">
            <Link href="/why-web3">
              <div className="link-button">{t.whyWeb3Link}</div>
            </Link>
            <Link href="/governance">
              <div className="link-button">{t.governanceLink}</div>
            </Link>
            <Link href="/privacy">
              <div className="link-button">{t.privacyLink}</div>
            </Link>
          </div>
        </section>

        {/* Contact & Status */}
        <section className="fade-in content-box">
          <h2 className="section-title">{t.contactTitle}</h2>
          <p className="method-text" style={{ textAlign: 'center' }}>
            <strong>{t.contactName}</strong><br />
            {t.statusPhD}<br />
            {t.statusInst}<br />
            <a href={`mailto:${t.contactEmail}`} style={{ textDecoration: 'underline' }}>{t.contactEmail}</a><br />
            <br />
            {t.contactAvail}<br />
            {t.statusFunding}
          </p>
        </section>
      </main>

      <footer>
        {t.footerTagline}<br />
        © 2025 Leol Lab
      </footer>
    </>
  )
}
