import Head from 'next/head'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function NationalDataInfrastructure() {
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
      projectTitle: 'National Data Infrastructure',
      tagline: 'Scaling place-based data from street to national level',
      
      overview: 'Overview',
      overviewText: 'This research initiative explores how place-based community data can scale effectively across geographic and administrative levels—from individual streets to neighbourhoods, cities, and ultimately national infrastructure. The challenge is building frameworks that allow data to inform decisions about the built environment "up the chain" while maintaining community sovereignty and control at every level.',
      
      problem: 'The scaling challenge',
      problemText: 'Most data systems are either hyper-local (losing broader impact on shaping places) or centralised (losing community control). We need new models that allow neighbourhood-level data to contribute to city and national decisions about the built environment without extracting that data from community ownership. How do we build infrastructure that scales power rather than concentrating it?',
      
      approach: 'Research approach',
      approach1: 'Mapping data flows from street → neighbourhood → city → national levels',
      approach2: 'Designing protocols for data aggregation that preserve sovereignty',
      approach3: 'Testing blockchain mechanisms for maintaining provenance across scales',
      approach4: 'Building governance models for multi-level data stewardship',
      approach5: 'Exploring how local knowledge can inform national decisions about infrastructure without extraction',
      
      questions: 'Key research questions',
      q1: 'How can neighbourhood data inform city planning and design without losing community control?',
      q2: 'What governance structures enable multi-level data stewardship?',
      q3: 'Can blockchain maintain data provenance as information scales upward?',
      q4: 'How do we prevent re-centralisation as local data aggregates nationally?',
      q5: 'What role can smart contracts play in enforcing sovereignty across scales?',
      
      implications: 'Policy implications',
      implicationsText: 'This work has direct implications for Welsh and UK planning policy, smart city initiatives, and national data strategies. By demonstrating how community-owned data can scale while maintaining sovereignty, we can inform new models for democratic data governance at all levels of government—from street design to national infrastructure planning.',
      
      connections: 'Connections to other work',
      connectionsText: 'This initiative builds on the Place-based Data Sovereignty PhD research and connects directly to questions of place-based digital identity. Together, these projects explore whether Web3 technologies can fundamentally restructure power in how we plan and shape the built environment.',
      
      timeline: 'Timeline',
      timelineText: 'Ongoing research initiative running parallel to PhD work (2025-2028+)',
      
      funding: 'Funding and partnerships',
      fundingText: 'This initiative is open to partnerships with local authorities, Welsh Government, national research bodies, and organisations working on democratic data governance. Funding opportunities welcome.',
      
      getInvolved: 'Get involved',
      getInvolvedText: 'If your organisation is working on multi-level data governance, community data sovereignty, or related challenges in shaping places, we would welcome collaboration. Contact us to discuss partnership opportunities.',
    },
    cy: {
      backHome: '[←] nôl i\'r hafan',
      projectTitle: 'Seilwaith Data Cenedlaethol',
      tagline: 'Graddio data lle-seiliedig o lefel stryd i lefel genedlaethol',
      
      overview: 'Trosolwg',
      overviewText: 'Mae\'r fenter ymchwil hon yn archwilio sut gall data cymunedol lle-seiliedig raddio\'n effeithiol ar draws lefelau daearyddol a gweinyddol—o strydoedd unigol i gymdogaethau, dinasoedd, ac yn y pen draw seilwaith cenedlaethol. Yr her yw adeiladu fframweithiau sy\'n caniatáu i ddata lywio penderfyniadau am yr amgylchedd adeiledig "i fyny\'r gadwyn" tra\'n cynnal sofraniaeth a rheolaeth gymunedol ar bob lefel.',
      
      problem: 'Her graddio',
      problemText: 'Mae\'r rhan fwyaf o systemau data naill ai\'n hyper-leol (yn colli effaith ehangach ar lunio lleoedd) neu\'n ganoledig (yn colli rheolaeth gymunedol). Mae angen modelau newydd arnom sy\'n caniatáu i ddata lefel cymdogaeth gyfrannu at benderfyniadau dinas a chenedlaethol am yr amgylchedd adeiledig heb echdynnu\'r data hwnnw o berchnogaeth gymunedol. Sut rydym yn adeiladu seilwaith sy\'n graddio pŵer yn hytrach na\'i grynhoi?',
      
      approach: 'Dull ymchwil',
      approach1: 'Mapio llifau data o lefelau stryd → cymdogaeth → dinas → cenedlaethol',
      approach2: 'Dylunio protocolau ar gyfer cyfannu data sy\'n cadw sofraniaeth',
      approach3: 'Profi mecanweithiau blockchain ar gyfer cynnal tarddiad ar draws graddfeydd',
      approach4: 'Adeiladu modelau llywodraethiant ar gyfer stiwardiaeth data aml-lefel',
      approach5: 'Archwilio sut gall gwybodaeth leol lywio penderfyniadau cenedlaethol am seilwaith heb echdynnu',
      
      questions: 'Cwestiynau ymchwil allweddol',
      q1: 'Sut gall data cymdogaeth lywio cynllunio a dylunio dinas heb golli rheolaeth gymunedol?',
      q2: 'Pa strwythurau llywodraethiant sy\'n galluogi stiwardiaeth data aml-lefel?',
      q3: 'A all blockchain gynnal tarddiad data wrth i wybodaeth raddio i fyny?',
      q4: 'Sut rydym yn atal ail-ganoli wrth i ddata lleol gyfannu\'n genedlaethol?',
      q5: 'Pa rôl all contractau craff ei chwarae wrth orfodi sofraniaeth ar draws graddfeydd?',
      
      implications: 'Goblygiadau polisi',
      implicationsText: 'Mae gan y gwaith hwn oblygiadau uniongyrchol ar gyfer polisi cynllunio Cymru a\'r DU, mentrau dinasoedd craff, a strategaethau data cenedlaethol. Trwy ddangos sut gall data sy\'n eiddo i\'r gymuned raddio tra\'n cynnal sofraniaeth, gallwn lywio modelau newydd ar gyfer llywodraethiant data democrataidd ar bob lefel o lywodraeth—o ddylunio strydoedd i gynllunio seilwaith cenedlaethol.',
      
      connections: 'Cysylltiadau â gwaith arall',
      connectionsText: 'Mae\'r fenter hon yn adeiladu ar yr ymchwil PhD Sofraniaeth Data Lle-seiliedig ac yn cysylltu\'n uniongyrchol â chwestiynau hunaniaeth ddigidol lle-seiliedig. Gyda\'i gilydd, mae\'r prosiectau hyn yn archwilio a all technolegau Gwe3 ailstrwythuro pŵer yn sylfaenol yn sut rydym yn cynllunio ac yn llunio\'r amgylchedd adeiledig.',
      
      timeline: 'Amserlen',
      timelineText: 'Menter ymchwil barhaus sy\'n rhedeg ochr yn ochr â gwaith PhD (2025-2028+)',
      
      funding: 'Cyllid a phartneriaethau',
      fundingText: 'Mae\'r fenter hon yn agored i bartneriaethau gydag awdurdodau lleol, Llywodraeth Cymru, cyrff ymchwil cenedlaethol, a sefydliadau sy\'n gweithio ar lywodraethiant data democrataidd. Croeso i gyfleoedd ariannu.',
      
      getInvolved: 'Cymryd rhan',
      getInvolvedText: 'Os yw eich sefydliad yn gweithio ar lywodraethiant data aml-lefel, sofraniaeth data cymunedol, neu heriau cysylltiedig mewn llunio lleoedd, byddem yn croesawu cydweithrediad. Cysylltwch â ni i drafod cyfleoedd partneriaeth.',
    }
  }
  
  const t = content[lang]

  return (
    <>
      <Head>
        <title>{t.projectTitle} | Leol Lab</title>
        <meta name="description" content="Exploring how place-based data scales from street to national level while maintaining community sovereignty" />
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

          {/* Key Questions */}
          <section className="fade-in" style={{ marginBottom: '40px' }}>
            <h2 className="section-label">{t.questions}</h2>
            <div style={{ 
              background: theme === 'light' ? '#ffffff' : '#1a1a1a', 
              border: `2px solid ${theme === 'light' ? '#666' : '#999'}`, 
              padding: '28px',
              transition: 'background 0.3s ease, border 0.3s ease'
            }}>
              <ul style={{ listStyle: 'none', fontSize: '14px', lineHeight: 2 }}>
                <li>[→] {t.q1}</li>
                <li>[→] {t.q2}</li>
                <li>[→] {t.q3}</li>
                <li>[→] {t.q4}</li>
                <li>[→] {t.q5}</li>
              </ul>
            </div>
          </section>

          {/* Policy Implications */}
          <section className="fade-in" style={{ marginBottom: '40px' }}>
            <h2 className="section-label">{t.implications}</h2>
            <div style={{ 
              background: theme === 'light' ? '#ffffff' : '#1a1a1a', 
              border: `2px solid ${theme === 'light' ? '#666' : '#999'}`, 
              padding: '28px',
              transition: 'background 0.3s ease, border 0.3s ease'
            }}>
              <p style={{ fontSize: '14px', lineHeight: 1.7 }}>
                {t.implicationsText}
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