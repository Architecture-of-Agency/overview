import Head from 'next/head'
import { useState } from 'react'
import Link from 'next/link'

export default function NationalDataInfrastructure() {
  const [lang, setLang] = useState('en')
  
  const content = {
    en: {
      backHome: '← Back to home',
      projectTitle: 'National Data Infrastructure',
      tagline: 'Scaling place-based data from street to national level',
      
      overview: 'Overview',
      overviewText: 'This research initiative explores how place-based community data can scale effectively across geographic and administrative levels—from individual streets to neighborhoods, cities, and ultimately national infrastructure. The challenge is building frameworks that allow data to inform policy "up the chain" while maintaining community sovereignty and control at every level.',
      
      problem: 'The scaling challenge',
      problemText: 'Most data systems are either hyper-local (losing broader impact) or centralized (losing community control). We need new models that allow neighborhood-level data to contribute to city and national policy without extracting that data from community ownership. How do we build infrastructure that scales power rather than concentrating it?',
      
      approach: 'Research approach',
      approach1: 'Mapping data flows from street → neighborhood → city → national levels',
      approach2: 'Designing protocols for data aggregation that preserve sovereignty',
      approach3: 'Testing blockchain mechanisms for maintaining provenance across scales',
      approach4: 'Building governance models for multi-level data stewardship',
      approach5: 'Exploring how local knowledge can inform national policy without extraction',
      
      questions: 'Key research questions',
      q1: 'How can neighborhood data inform city planning without losing community control?',
      q2: 'What governance structures enable multi-level data stewardship?',
      q3: 'Can blockchain maintain data provenance as information scales upward?',
      q4: 'How do we prevent re-centralization as local data aggregates nationally?',
      q5: 'What role can smart contracts play in enforcing sovereignty across scales?',
      
      implications: 'Policy implications',
      implicationsText: 'This work has direct implications for Welsh and UK planning policy, smart city initiatives, and national data strategies. By demonstrating how community-owned data can scale while maintaining sovereignty, we can inform new models for democratic data governance at all levels of government.',
      
      connections: 'Connections to other work',
      connectionsText: 'This initiative builds on the Place-based Data Sovereignty PhD research and connects directly to questions of place-based digital identity. Together, these projects explore whether Web3 technologies can fundamentally restructure power in urban governance.',
      
      timeline: 'Timeline',
      timelineText: 'Ongoing research initiative running parallel to PhD work (2025-2028+)',
      
      funding: 'Funding & partnerships',
      fundingText: 'This initiative is open to partnerships with local authorities, Welsh Government, national research bodies, and organizations working on democratic data governance. Funding opportunities welcome.',
      
      getInvolved: 'Get involved',
      getInvolvedText: 'If your organization is working on multi-level data governance, community data sovereignty, or related challenges, we would welcome collaboration. Contact us to discuss partnership opportunities.',
    },
    cy: {
      backHome: '← Nôl i\'r hafan',
      projectTitle: 'Seilwaith Data Cenedlaethol',
      tagline: 'Graddio data lle-seiliedig o lefel stryd i lefel genedlaethol',
      
      overview: 'Trosolwg',
      overviewText: 'Mae\'r fenter ymchwil hon yn archwilio sut gall data cymunedol lle-seiliedig raddio\'n effeithiol ar draws lefelau daearyddol a gweinyddol—o strydoedd unigol i gymdogaethau, dinasoedd, ac yn y pen draw seilwaith cenedlaethol. Yr her yw adeiladu fframweithiau sy\'n caniatáu i ddata lywio polisi "i fyny\'r gadwyn" tra\'n cynnal sofraniaeth a rheolaeth gymunedol ar bob lefel.',
      
      problem: 'Her graddio',
      problemText: 'Mae\'r rhan fwyaf o systemau data naill ai\'n hyper-leol (yn colli effaith ehangach) neu\'n ganoledig (yn colli rheolaeth gymunedol). Mae angen modelau newydd arnom sy\'n caniatáu i ddata lefel cymdogaeth gyfrannu at bolisi dinas a chenedlaethol heb echdynnu\'r data hwnnw o berchnogaeth gymunedol. Sut rydym yn adeiladu seilwaith sy\'n graddio pŵer yn hytrach na\'i grynhoi?',
      
      approach: 'Dull ymchwil',
      approach1: 'Mapio llifau data o lefelau stryd → cymdogaeth → dinas → cenedlaethol',
      approach2: 'Dylunio protocolau ar gyfer cyfannu data sy\'n cadw sofraniaeth',
      approach3: 'Profi mecanweithiau blockchain ar gyfer cynnal tarddiad ar draws graddfeydd',
      approach4: 'Adeiladu modelau llywodraethiant ar gyfer stiwardiaeth data aml-lefel',
      approach5: 'Archwilio sut gall gwybodaeth leol lywio polisi cenedlaethol heb echdynnu',
      
      questions: 'Cwestiynau ymchwil allweddol',
      q1: 'Sut gall data cymdogaeth lywio cynllunio dinas heb golli rheolaeth gymunedol?',
      q2: 'Pa strwythurau llywodraethiant sy\'n galluogi stiwardiaeth data aml-lefel?',
      q3: 'A all blockchain gynnal tarddiad data wrth i wybodaeth raddio i fyny?',
      q4: 'Sut rydym yn atal ail-ganoli wrth i ddata lleol gyfannu\'n genedlaethol?',
      q5: 'Pa rôl all contractau craff ei chwarae wrth orfodi sofraniaeth ar draws graddfeydd?',
      
      implications: 'Goblygiadau polisi',
      implicationsText: 'Mae gan y gwaith hwn oblygiadau uniongyrchol ar gyfer polisi cynllunio Cymru a\'r DU, mentrau dinasoedd craff, a strategaethau data cenedlaethol. Trwy ddangos sut gall data sy\'n eiddo i\'r gymuned raddio tra\'n cynnal sofraniaeth, gallwn lywio modelau newydd ar gyfer llywodraethiant data democrataidd ar bob lefel o lywodraeth.',
      
      connections: 'Cysylltiadau â gwaith arall',
      connectionsText: 'Mae\'r fenter hon yn adeiladu ar yr ymchwil PhD Sofraniaeth Data Lle-seiliedig ac yn cysylltu\'n uniongyrchol â chwestiynau hunaniaeth ddigidol lle-seiliedig. Gyda\'i gilydd, mae\'r prosiectau hyn yn archwilio a all technolegau Gwe3 ailstrwythuro pŵer yn sylfaenol mewn llywodraethiant trefol.',
      
      timeline: 'Amserlen',
      timelineText: 'Menter ymchwil barhaus sy\'n rhedeg ochr yn ochr â gwaith PhD (2025-2028+)',
      
      funding: 'Cyllid a phartneriaethau',
      fundingText: 'Mae\'r fenter hon yn agored i bartneriaethau gydag awdurdodau lleol, Llywodraeth Cymru, cyrff ymchwil cenedlaethol, a sefydliadau sy\'n gweithio ar lywodraethiant data democrataidd. Croeso i gyfleoedd ariannu.',
      
      getInvolved: 'Cymryd rhan',
      getInvolvedText: 'Os yw eich sefydliad yn gweithio ar lywodraethiant data aml-lefel, sofraniaeth data cymunedol, neu heriau cysylltiedig, byddem yn croesawu cydweithrediad. Cysylltwch â ni i drafod cyfleoedd partneriaeth.',
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

          {/* Problem */}
          <section className="fade-in" style={{ marginBottom: '40px' }}>
            <h2 className="section-label">{t.problem}</h2>
            <div style={{ background: '#ffffff', border: '1px solid #666', padding: '28px' }}>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#1a1a1a' }}>
                {t.problemText}
              </p>
            </div>
          </section>

          {/* Research Approach */}
          <section className="fade-in" style={{ marginBottom: '40px' }}>
            <h2 className="section-label">{t.approach}</h2>
            <div style={{ background: '#ffffff', border: '1px solid #666', padding: '28px' }}>
              <ul style={{ listStyle: 'none', fontSize: '15px', lineHeight: 2 }}>
                <li>→ {t.approach1}</li>
                <li>→ {t.approach2}</li>
                <li>→ {t.approach3}</li>
                <li>→ {t.approach4}</li>
                <li>→ {t.approach5}</li>
              </ul>
            </div>
          </section>

          {/* Key Questions */}
          <section className="fade-in" style={{ marginBottom: '40px' }}>
            <h2 className="section-label">{t.questions}</h2>
            <div style={{ background: '#ffffff', border: '1px solid #666', padding: '28px' }}>
              <ul style={{ listStyle: 'none', fontSize: '15px', lineHeight: 2 }}>
                <li>→ {t.q1}</li>
                <li>→ {t.q2}</li>
                <li>→ {t.q3}</li>
                <li>→ {t.q4}</li>
                <li>→ {t.q5}</li>
              </ul>
            </div>
          </section>

          {/* Policy Implications */}
          <section className="fade-in" style={{ marginBottom: '40px' }}>
            <h2 className="section-label">{t.implications}</h2>
            <div style={{ background: '#ffffff', border: '1px solid #666', padding: '28px' }}>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#1a1a1a' }}>
                {t.implicationsText}
              </p>
            </div>
          </section>

          {/* Connections */}
          <section className="fade-in" style={{ marginBottom: '40px' }}>
            <h2 className="section-label">{t.connections}</h2>
            <div style={{ background: '#ffffff', border: '1px solid #666', padding: '28px' }}>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#1a1a1a' }}>
                {t.connectionsText}
              </p>
            </div>
          </section>

          {/* Timeline & Funding */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '40px' }}>
            <section className="fade-in">
              <h2 className="section-label">{t.timeline}</h2>
              <div style={{ background: '#ffffff', border: '1px solid #666', padding: '24px' }}>
                <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#1a1a1a' }}>
                  {t.timelineText}
                </p>
              </div>
            </section>

            <section className="fade-in">
              <h2 className="section-label">{t.funding}</h2>
              <div style={{ background: '#ffffff', border: '1px solid #666', padding: '24px' }}>
                <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#1a1a1a' }}>
                  {t.fundingText}
                </p>
              </div>
            </section>
          </div>

          {/* Get Involved */}
          <section className="fade-in" style={{ marginBottom: '40px' }}>
            <h2 className="section-label">{t.getInvolved}</h2>
            <div style={{ background: '#ffffff', border: '1px solid #666', padding: '28px' }}>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#1a1a1a' }}>
                {t.getInvolvedText}
              </p>
            </div>
          </section>

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