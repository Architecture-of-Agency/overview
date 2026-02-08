import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'

type WindowContent = 'about' | 'why-web3' | 'governance' | 'privacy' | 'contact' | null

export default function Home() {
  const [hasEntered, setHasEntered] = useState(false)
  const [lang, setLang] = useState('en')
  const [theme, setTheme] = useState('light')
  const [openWindow, setOpenWindow] = useState<WindowContent>(null)
  const [mounted, setMounted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') || 'light'
    const entered = localStorage.getItem('has_entered')
    setTheme(savedTheme)
    if (entered === 'true') {
      setHasEntered(true)
    }
  }, [])

  const handleConsent = (accepted: boolean) => {
    localStorage.setItem('analytics_consent', accepted ? 'accepted' : 'declined')
    localStorage.setItem('has_entered', 'true')
    
    // Play Mac startup sound
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e))
    }
    
    // Short delay for sound, then show desktop
    setTimeout(() => {
      setHasEntered(true)
    }, 500)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const content = {
    en: {
      // Landing page
      landingTitle: 'Leol Lab',
      landingSubtitle: 'Web3 Governance Research',
      landingText1: 'This site collects anonymised usage data for research purposes:',
      landingBullets: [
        'Which pages you visit',
        'How you navigate the site',
        'Device type and region (country only)',
      ],
      landingText2: 'This helps us understand how communities engage with data sovereignty research.',
      landingText3: 'No personal information is collected.',
      acceptButton: 'Accept and enter',
      declineButton: 'Decline and enter',
      privacyLink: 'Read full privacy policy',
      
      // Desktop
      desktopAbout: 'About',
      desktopWhyWeb3: 'Why Web3',
      desktopGovernance: 'Data Governance',
      desktopPrivacy: 'Privacy',
      desktopContact: 'Contact',
      desktopLang: 'Cymraeg',
      desktopTheme: theme === 'light' ? 'Dark mode' : 'Light mode',
      
      // About window
      aboutTitle: 'About Leol Lab',
      aboutText1: 'Researching Web3-enabled governance systems that centre marginalised voices in shaping the built environment.',
      aboutProblem: 'The problem',
      aboutProblemText: 'Multiple types of power exclude communities from decisions about place:',
      aboutPowerTypes: [
        'Property power: Landowners can override everyone through legal rights',
        'Economic power: Developers can override through capital',
        'Institutional power: Local Authority overrides through statutory powers',
        'Epistemic power: Professionals gatekeep through technical expertise',
      ],
      aboutMargin: 'Within already-excluded communities, majoritarian dynamics further silence disabled people, renters, and minorities.',
      aboutCardiff: 'Cardiff context',
      aboutCardiffText: '28 wards: 6 with community councils (tokenistic consultation only), 22 with no formal structure. All have zero decision-making power.',
      
      aboutMethod: 'Design Justice methodology',
      aboutMethodText: 'This research uses Design Justice (Costanza-Chock, 2020) as an umbrella framework, synthesising power analysis, epistemic justice, feminist technology critique, and Indigenous Data Sovereignty principles. Design Justice centres those most affected by design decisions in the design process itself—not as consultants, but as leaders.',
      
      aboutQuestions: 'Research questions',
      aboutQuestionsList: [
        'How can governance systems engage all stakeholders whilst centring communities?',
        'What mechanisms prevent both institutional capture and majoritarian tyranny?',
        'How does Web3 technology enable anti-majoritarian governance at scale?',
        'What does Design Justice look like in blockchain-based urban planning systems?',
        'How do we redistribute epistemic authority alongside decision-making power?',
      ],
      
      aboutStatus: 'PhD Year 1, Welsh School of Architecture, Cardiff University',
      
      // Why Web3 window
      whyTitle: 'Why Web3?',
      whyIntro: 'Multi-stakeholder governance for the built environment requires technical infrastructure that can encode anti-majoritarian principles, make power visible and contestable, and redistribute authority without creating new centralisation points.',
      whyWeb2Problem: 'The problem with traditional systems',
      whyWeb2Text: 'Traditional database systems require someone to own and control the infrastructure. This creates inevitable power concentration: centralised control, opaque decision-making, trust requirements, single points of failure, and capture risk. For urban governance, this means replacing Local Authority control with another centralised controller. The power structure doesn\'t change—it just moves.',
      whyWeb3Enables: 'What Web3 enables',
      whyWeb3Points: [
        'Distributed authority: No single owner or controller',
        'Transparent, auditable records: All decisions on public ledger',
        'Programmable governance rules: Anti-majoritarian protections encoded in smart contracts',
        'Trustless coordination: Stakeholders coordinate without central arbiter',
        'Community data sovereignty: Place-based data owned collectively at local scale',
      ],
      whyMechanisms: 'Anti-majoritarian mechanisms',
      whyMechanismsList: [
        'Quadratic voting: Non-linear voting power prevents majority domination',
        'Conviction voting: Time-weighted preferences allow passionate minorities to win',
        'Identity-based weighting: Those most affected have higher voting power',
        'Veto rights: Protected groups can block decisions that harm them',
        'Mandatory inclusion thresholds: Minimum participation from marginalised groups required',
      ],
      whyLimitations: 'Limitations and critiques',
      whyLimitationsText: 'Web3 is not a technological solution to social and political problems. The research acknowledges: technology doesn\'t fix power structures, accessibility barriers exist, some blockchain systems have environmental costs, regulatory frameworks are underdeveloped, and digital divides exclude people. These limitations are part of what the research investigates.',
      
      // Governance window
      govTitle: 'Data Governance',
      govIntro: 'This research investigates what governance should look like for place-based data. We don\'t have the answers yet—that\'s what the PhD will discover.',
      govWebsiteData: 'Website visitor data',
      govWebsiteText: 'Anonymised usage data from people visiting this site (which pages, navigation patterns, device type, country). Used to understand how communities engage with data sovereignty research. Cardiff University temporarily holds this data as custodian during PhD research (2025-2028). This is stewardship, not ownership. Upon research completion, governance will transition to community-determined structures.',
      govResearchData: 'Research/stakeholder data',
      govResearchText: 'Data from interviews with communities, planners, developers, architects, housing associations, and other stakeholders. Multi-party co-created research data with complex governance considerations. Different stakeholders have legitimate but sometimes competing interests.',
      govQuestions: 'What this research investigates',
      govQuestionsList: [
        'How should multi-party research data be governed?',
        'What rights do different stakeholders have?',
        'How do you balance transparency with privacy?',
        'What does community data sovereignty mean when "community" isn\'t monolithic?',
        'How do you prevent both institutional capture and majoritarian tyranny in data governance?',
      ],
      govCommitments: 'Current commitments',
      govCommitmentsList: [
        'Minimal collection (only what\'s necessary)',
        'Full transparency about what\'s collected and why',
        'Cardiff University research ethics approval for all data collection',
        'Commitment to transition governance to communities post-PhD',
        'Privacy protection for sensitive information',
      ],
      
      // Privacy window
      privacyTitle: 'Privacy Policy',
      privacyUpdated: 'Last updated: February 2025',
      privacyCollect: 'What this site collects',
      privacyCollectText: 'This research website uses Vercel Analytics to collect minimal anonymised usage data: which pages you visit, how you navigate the site, device type (mobile/desktop), geographic region (country only). No personal information is collected. No tracking cookies, no cross-site tracking, no identifiable data.',
      privacyWhy: 'Why we collect this',
      privacyWhyText: 'To understand how communities engage with data sovereignty research. The data helps us understand whether content is clear and accessible, and what improvements would serve users better.',
      privacyStorage: 'Where it\'s stored',
      privacyStorageText: 'Data is processed by Vercel Inc. under their privacy policy. Vercel Analytics is designed to be privacy-friendly and GDPR compliant.',
      privacyFuture: 'Future governance',
      privacyFutureText: 'This data is temporarily stewarded by Cardiff University during PhD research but belongs to visitors and communities. Upon research completion (expected 2028), governance will transition to community-determined structures.',
      privacyRights: 'Your rights',
      privacyRightsList: [
        'Understand what data is collected (documented here)',
        'Opt-out (decline on entry screen or clear browser data)',
        'Use privacy-focused browsers that block analytics',
        'Contact us with questions or concerns',
      ],
      privacyContact: 'Contact: Lucy Dunhill, dunhilll@cardiff.ac.uk',
      
      // Contact window
      contactTitle: 'Contact',
      contactName: 'Lucy Dunhill',
      contactRole: 'PhD Researcher',
      contactInst: 'Welsh School of Architecture, Cardiff University',
      contactEmail: 'dunhilll@cardiff.ac.uk',
      contactAvail: 'Available for meetings in Cardiff and online',
      
      closeButton: 'Close',
    },
    cy: {
      // Landing page
      landingTitle: 'Leol Lab',
      landingSubtitle: 'Ymchwil Llywodraethiant Gwe3',
      landingText1: 'Mae\'r wefan hon yn casglu data defnydd dienw at ddibenion ymchwil:',
      landingBullets: [
        'Pa dudalennau rydych chi\'n ymweld â nhw',
        'Sut rydych chi\'n llywio\'r wefan',
        'Math o ddyfais a rhanbarth (gwlad yn unig)',
      ],
      landingText2: 'Mae hyn yn ein helpu i ddeall sut mae cymunedau yn ymgysylltu ag ymchwil sofraniaeth data.',
      landingText3: 'Nid oes gwybodaeth bersonol yn cael ei chasglu.',
      acceptButton: 'Derbyn a mynd i mewn',
      declineButton: 'Gwrthod a mynd i mewn',
      privacyLink: 'Darllen polisi preifatrwydd llawn',
      
      // Desktop
      desktopAbout: 'Ynghylch',
      desktopWhyWeb3: 'Pam Gwe3',
      desktopGovernance: 'Llywodraethu Data',
      desktopPrivacy: 'Preifatrwydd',
      desktopContact: 'Cysylltu',
      desktopLang: 'English',
      desktopTheme: theme === 'light' ? 'Modd tywyll' : 'Modd golau',
      
      // About window
      aboutTitle: 'Ynghylch Leol Lab',
      aboutText1: 'Ymchwilio i systemau llywodraethiant Gwe3-alluog sy\'n canoli lleisiau ymylol wrth lunio\'r amgylchedd adeiledig.',
      aboutProblem: 'Y broblem',
      aboutProblemText: 'Mae mathau lluosog o bŵer yn eithrio cymunedau o benderfyniadau am le:',
      aboutPowerTypes: [
        'Pŵer eiddo: Gall perchnogion tir wrthod pawb trwy hawliau cyfreithiol',
        'Pŵer economaidd: Gall datblygwyr wrthod trwy gyfalaf',
        'Pŵer sefydliadol: Mae Awdurdod Lleol yn gwrthod trwy bwerau statudol',
        'Pŵer epistemolegol: Mae gweithwyr proffesiynol yn gatekeeper trwy arbenigedd technegol',
      ],
      aboutMargin: 'O fewn cymunedau sydd eisoes wedi\'u heithrio, mae deinameg fwyafrifol yn tawelu pobl anabl, rhentwyr, a lleiafrifoedd ymhellach.',
      aboutCardiff: 'Cyd-destun Caerdydd',
      aboutCardiffText: '28 ward: 6 gyda chynghorau cymuned (ymgynghori tocenistig yn unig), 22 heb strwythur ffurfiol. Mae gan bawb sero pŵer gwneud penderfyniadau.',
      
      aboutMethod: 'Methodoleg Cyfiawnder Dylunio',
      aboutMethodText: 'Mae\'r ymchwil hwn yn defnyddio Cyfiawnder Dylunio (Costanza-Chock, 2020) fel fframwaith ymbarél, gan syntheseiddio dadansoddiad pŵer, cyfiawnder epistemolegol, beirniadaeth technoleg ffeministaidd, ac egwyddorion Sofraniaeth Data Brodorol. Mae Cyfiawnder Dylunio yn canoli\'r rhai sy\'n cael eu heffeithio fwyaf gan benderfyniadau dylunio yn y broses dylunio ei hun—nid fel ymgynghorwyr, ond fel arweinwyr.',
      
      aboutQuestions: 'Cwestiynau ymchwil',
      aboutQuestionsList: [
        'Sut gall systemau llywodraethiant ymgysylltu â phob rhanddeiliad tra\'n canoli cymunedau?',
        'Pa fecanweithiau sy\'n atal cipio sefydliadol a gormes mwyafrifol?',
        'Sut mae technoleg Gwe3 yn galluogi llywodraethiant gwrth-fwyafrifol ar raddfa?',
        'Beth mae Cyfiawnder Dylunio yn ei olygu mewn systemau cynllunio trefol blockchain?',
        'Sut rydym yn ailddosbarthu awdurdod epistemolegol ochr yn ochr â phŵer gwneud penderfyniadau?',
      ],
      
      aboutStatus: 'PhD Blwyddyn 1, Ysgol Bensaernïaeth Cymru, Prifysgol Caerdydd',
      
      // Why Web3 window
      whyTitle: 'Pam Gwe3?',
      whyIntro: 'Mae llywodraethiant aml-randdeiliaid ar gyfer yr amgylchedd adeiledig yn gofyn am seilwaith technegol a all amgodio egwyddorion gwrth-fwyafrifol, gwneud pŵer yn weladwy ac yn herio, ac ailddosbarthu awdurdod heb greu pwyntiau canoli newydd.',
      whyWeb2Problem: 'Y broblem gyda systemau traddodiadol',
      whyWeb2Text: 'Mae systemau cronfa ddata traddodiadol yn gofyn i rywun berchnogi a rheoli\'r seilwaith. Mae hyn yn creu crynodiad pŵer anochel: rheolaeth ganolog, gwneud penderfyniadau anhryloyw, gofynion ymddiriedaeth, pwyntiau methiant sengl, a risg cipio. Ar gyfer llywodraethiant trefol, mae hyn yn golygu disodli rheolaeth Awdurdod Lleol â rheolydd canolog arall. Nid yw\'r strwythur pŵer yn newid—mae\'n symud yn unig.',
      whyWeb3Enables: 'Beth mae Gwe3 yn ei alluogi',
      whyWeb3Points: [
        'Awdurdod dosbarthedig: Dim perchennog na rheolydd sengl',
        'Cofnodion tryloyw, archwiliadwy: Pob penderfyniad ar ledger cyhoeddus',
        'Rheolau llywodraethiant rhaglenadwy: Amddiffyniadau gwrth-fwyafrifol wedi\'u hamgodio mewn contractau craff',
        'Cydlynu heb ymddiriedaeth: Rhanddeiliaid yn cydlynu heb ganolwr',
        'Sofraniaeth data cymunedol: Data lle-seiliedig yn eiddo ar y cyd ar raddfa leol',
      ],
      whyMechanisms: 'Mecanweithiau gwrth-fwyafrifol',
      whyMechanismsList: [
        'Pleidleisio cwadratig: Mae pŵer pleidleisio anlinol yn atal dominyddiaeth mwyafrif',
        'Pleidleisio argyhoeddiad: Mae dewisiadau pwysoli amser yn caniatáu i leiafrifoedd angerddol ennill',
        'Pwysoli seiliedig ar hunaniaeth: Mae\'r rhai sy\'n cael eu heffeithio fwyaf â phŵer pleidleisio uwch',
        'Hawliau feto: Gall grwpiau gwarchodedig rwystro penderfyniadau sy\'n eu niweidio',
        'Trothwyon cynhwysiant gorfodol: Mae angen cyfranogiad lleiaf gan grwpiau ymylol',
      ],
      whyLimitations: 'Cyfyngiadau a beirniadaethau',
      whyLimitationsText: 'Nid yw Gwe3 yn ateb technolegol i broblemau cymdeithasol a gwleidyddol. Mae\'r ymchwil yn cydnabod: nid yw technoleg yn trwsio strwythurau pŵer, mae rhwystrau hygyrchedd yn bodoli, mae gan rai systemau blockchain gostau amgylcheddol, mae fframweithiau rheoleiddiol yn ddatblygedig, ac mae rhaniadau digidol yn eithrio pobl. Mae\'r cyfyngiadau hyn yn rhan o\'r hyn mae\'r ymchwil yn ei ymchwilio.',
      
      // Governance window
      govTitle: 'Llywodraethu Data',
      govIntro: 'Mae\'r ymchwil hwn yn ymchwilio i sut olwg ddylai llywodraethiant ar ddata lle-seiliedig. Nid oes gennym yr atebion eto—dyna beth fydd y PhD yn ei ddarganfod.',
      govWebsiteData: 'Data ymwelwyr y wefan',
      govWebsiteText: 'Data defnydd dienw gan bobl sy\'n ymweld â\'r wefan hon (pa dudalennau, patrymau llywio, math o ddyfais, gwlad). Yn cael ei ddefnyddio i ddeall sut mae cymunedau yn ymgysylltu ag ymchwil sofraniaeth data. Mae Prifysgol Caerdydd yn dal y data hwn dros dro fel stiward yn ystod ymchwil PhD (2025-2028). Stiwardiaeth yw hyn, nid perchnogaeth. Ar ôl cwblhau\'r ymchwil, bydd llywodraethiant yn trosglwyddo i strwythurau a bennir gan y gymuned.',
      govResearchData: 'Data ymchwil/rhanddeiliaid',
      govResearchText: 'Data o gyfweliadau â chymunedau, cynllunwyr, datblygwyr, penseiri, cymdeithasau tai, a rhanddeiliaid eraill. Data ymchwil aml-blaid wedi\'i gyd-greu gyda ystyriaethau llywodraethiant cymhleth. Mae gan wahanol randdeiliaid fuddiannau dilys ond weithiau\'n cystadlu.',
      govQuestions: 'Beth mae\'r ymchwil hwn yn ei ymchwilio',
      govQuestionsList: [
        'Sut ddylai data ymchwil aml-blaid gael ei lywodraethu?',
        'Pa hawliau sydd gan wahanol randdeiliaid?',
        'Sut rydych chi\'n cydbwyso tryloywder â phreifatrwydd?',
        'Beth mae sofraniaeth data cymunedol yn ei olygu pan nad yw "cymuned" yn unffurf?',
        'Sut rydych chi\'n atal cipio sefydliadol a gormes mwyafrifol mewn llywodraethiant data?',
      ],
      govCommitments: 'Ymrwymiadau cyfredol',
      govCommitmentsList: [
        'Casgliad lleiaf (dim ond yr hyn sy\'n angenrheidiol)',
        'Tryloywder llawn am yr hyn sy\'n cael ei gasglu a pham',
        'Cymeradwyaeth moeseg ymchwil Prifysgol Caerdydd ar gyfer pob casgliad data',
        'Ymrwymiad i drosglwyddo llywodraethiant i gymunedau ar ôl PhD',
        'Amddiffyniad preifatrwydd ar gyfer gwybodaeth sensitif',
      ],
      
      // Privacy window
      privacyTitle: 'Polisi Preifatrwydd',
      privacyUpdated: 'Diweddariad diwethaf: Chwefror 2025',
      privacyCollect: 'Beth mae\'r wefan hon yn ei gasglu',
      privacyCollectText: 'Mae\'r wefan ymchwil hon yn defnyddio Vercel Analytics i gasglu data defnydd dienw lleiaf: pa dudalennau rydych chi\'n ymweld â nhw, sut rydych chi\'n llywio\'r wefan, math o ddyfais (symudol/bwrdd gwaith), rhanbarth daearyddol (gwlad yn unig). Nid oes gwybodaeth bersonol yn cael ei chasglu. Dim cwcis tracio, dim tracio traws-wefan, dim data adnabyddadwy.',
      privacyWhy: 'Pam rydym yn casglu hyn',
      privacyWhyText: 'I ddeall sut mae cymunedau yn ymgysylltu ag ymchwil sofraniaeth data. Mae\'r data yn ein helpu i ddeall a yw cynnwys yn glir ac yn hygyrch, a pha welliannau fyddai\'n gwasanaethu defnyddwyr yn well.',
      privacyStorage: 'Ble mae\'n cael ei storio',
      privacyStorageText: 'Mae data yn cael ei brosesu gan Vercel Inc. o dan eu polisi preifatrwydd. Mae Vercel Analytics wedi\'i gynllunio i fod yn gyfeillgar i breifatrwydd ac yn gydymffurfio â GDPR.',
      privacyFuture: 'Llywodraethiant y dyfodol',
      privacyFutureText: 'Mae\'r data hwn yn cael ei stiwardio dros dro gan Brifysgol Caerdydd yn ystod ymchwil PhD ond yn perthyn i ymwelwyr a chymunedau. Ar ôl cwblhau\'r ymchwil (disgwylir 2028), bydd llywodraethiant yn trosglwyddo i strwythurau a bennir gan y gymuned.',
      privacyRights: 'Eich hawliau',
      privacyRightsList: [
        'Deall pa ddata sy\'n cael ei gasglu (wedi\'i ddogfennu yma)',
        'Optio allan (gwrthod ar y sgrin mynediad neu glirio data porwr)',
        'Defnyddio porwyr sy\'n canolbwyntio ar breifatrwydd sy\'n rhwystro dadansoddeg',
        'Cysylltu â ni gyda chwestiynau neu bryderon',
      ],
      privacyContact: 'Cysylltu: Lucy Dunhill, dunhilll@cardiff.ac.uk',
      
      // Contact window
      contactTitle: 'Cysylltu',
      contactName: 'Lucy Dunhill',
      contactRole: 'Ymchwilydd PhD',
      contactInst: 'Ysgol Bensaernïaeth Cymru, Prifysgol Caerdydd',
      contactEmail: 'dunhilll@cardiff.ac.uk',
      contactAvail: 'Ar gael ar gyfer cyfarfodydd yng Nghaerdydd ac ar-lein',
      
      closeButton: 'Cau',
    }
  }

  const t = content[lang]

  if (!mounted) return null

  // Landing / Consent Page
  if (!hasEntered) {
    return (
      <>
        <Head>
          <title>Leol Lab | Web3 Governance Research</title>
          <meta name="description" content="Research investigating Web3-enabled governance systems that centre marginalised voices" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
        </Head>

        <style jsx global>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Space Mono', 'Courier New', monospace;
            background: ${theme === 'light' ? '#e6e6e6' : '#1a1a1a'};
            color: ${theme === 'light' ? '#000000' : '#e0e0e0'};
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            line-height: 1.6;
          }
        `}</style>

        <audio ref={audioRef} preload="auto">
          <source src="/audio/startup.mp3" type="audio/mpeg" />
          <source src="/audio/startup.ogg" type="audio/ogg" />
        </audio>

        <main style={{
          maxWidth: '600px',
          padding: '40px',
          background: theme === 'light' ? '#ffffff' : '#2a2a2a',
          border: `2px solid ${theme === 'light' ? '#000000' : '#666666'}`,
          boxShadow: '4px 4px 0 rgba(0, 0, 0, 0.3)',
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 700,
            marginBottom: '8px',
            textAlign: 'center',
          }}>
            {t.landingTitle}
          </h1>

          <p style={{
            fontSize: '14px',
            textAlign: 'center',
            marginBottom: '32px',
            color: theme === 'light' ? '#666666' : '#999999',
          }}>
            {t.landingSubtitle}
          </p>

          <p style={{ fontSize: '14px', marginBottom: '16px' }}>
            {t.landingText1}
          </p>

          <ul style={{ 
            marginLeft: '24px', 
            marginBottom: '16px',
            fontSize: '14px',
            listStyle: 'disc',
          }}>
            {t.landingBullets.map((bullet, i) => (
              <li key={i} style={{ marginBottom: '8px' }}>{bullet}</li>
            ))}
          </ul>

          <p style={{ fontSize: '14px', marginBottom: '16px' }}>
            {t.landingText2}
          </p>

          <p style={{ fontSize: '14px', marginBottom: '32px', fontWeight: 700 }}>
            {t.landingText3}
          </p>

          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px',
            flexWrap: 'wrap',
          }}>
            <button
              onClick={() => handleConsent(true)}
              style={{
                flex: 1,
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: 700,
                fontFamily: 'Space Mono, monospace',
                background: theme === 'light' ? '#000000' : '#ffffff',
                color: theme === 'light' ? '#ffffff' : '#000000',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '2px 2px 0 rgba(0, 0, 0, 0.3)',
              }}
            >
              {t.acceptButton}
            </button>

            <button
              onClick={() => handleConsent(false)}
              style={{
                flex: 1,
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: 700,
                fontFamily: 'Space Mono, monospace',
                background: theme === 'light' ? '#ffffff' : '#2a2a2a',
                color: theme === 'light' ? '#000000' : '#e0e0e0',
                border: `2px solid ${theme === 'light' ? '#000000' : '#666666'}`,
                cursor: 'pointer',
                boxShadow: '2px 2px 0 rgba(0, 0, 0, 0.3)',
              }}
            >
              {t.declineButton}
            </button>
          </div>

          <p style={{
            fontSize: '12px',
            textAlign: 'center',
            color: theme === 'light' ? '#666666' : '#999999',
          }}>
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault()
                handleConsent(false)
                setTimeout(() => setOpenWindow('privacy'), 600)
              }}
              style={{
                color: 'inherit',
                textDecoration: 'underline',
              }}
            >
              {t.privacyLink}
            </a>
          </p>

          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            display: 'flex',
            gap: '8px',
          }}>
            <button
              onClick={toggleTheme}
              style={{
                padding: '8px 12px',
                fontSize: '11px',
                fontFamily: 'Space Mono, monospace',
                background: theme === 'light' ? '#ffffff' : '#2a2a2a',
                color: theme === 'light' ? '#000000' : '#e0e0e0',
                border: `1px solid ${theme === 'light' ? '#000000' : '#666666'}`,
                cursor: 'pointer',
              }}
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? '☾' : '☀'}
            </button>

            <button
              onClick={() => setLang(lang === 'en' ? 'cy' : 'en')}
              style={{
                padding: '8px 12px',
                fontSize: '11px',
                fontFamily: 'Space Mono, monospace',
                background: theme === 'light' ? '#ffffff' : '#2a2a2a',
                color: theme === 'light' ? '#000000' : '#e0e0e0',
                border: `1px solid ${theme === 'light' ? '#000000' : '#666666'}`,
                cursor: 'pointer',
              }}
              aria-label={lang === 'en' ? 'Newid i Gymraeg' : 'Switch to English'}
            >
              {lang === 'en' ? 'CY' : 'EN'}
            </button>
          </div>
        </main>
      </>
    )
  }

  // Desktop Interface
  return (
    <>
      <Head>
        <title>Leol Lab | Web3 Governance Research</title>
        <meta name="description" content="Research investigating Web3-enabled governance systems that centre marginalised voices" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Space Mono', 'Courier New', monospace;
          background: ${theme === 'light' ? '#c0c0c0' : '#2a2a2a'};
          color: ${theme === 'light' ? '#000000' : '#e0e0e0'};
          overflow: hidden;
          height: 100vh;
        }
        
        .desktop {
          height: 100vh;
          padding: 20px;
          display: grid;
          grid-template-columns: repeat(auto-fill, 100px);
          grid-auto-rows: 100px;
          gap: 20px;
          align-content: start;
        }
        
        .desktop-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          padding: 8px;
          border-radius: 4px;
          transition: background 0.2s;
        }
        
        .desktop-icon:hover {
          background: ${theme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'};
        }
        
        .desktop-icon:focus {
          outline: 2px solid ${theme === 'light' ? '#000000' : '#ffffff'};
          outline-offset: 2px;
        }
        
        .icon-image {
          width: 48px;
          height: 48px;
          background: ${theme === 'light' ? '#ffffff' : '#3a3a3a'};
          border: 2px solid ${theme === 'light' ? '#000000' : '#666666'};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.3);
        }
        
        .icon-label {
          font-size: 11px;
          text-align: center;
          word-break: break-word;
          max-width: 80px;
        }
        
        .window {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          max-width: 700px;
          max-height: 80vh;
          background: ${theme === 'light' ? '#ffffff' : '#2a2a2a'};
          border: 2px solid ${theme === 'light' ? '#000000' : '#666666'};
          box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          z-index: 1000;
        }
        
        .window-titlebar {
          background: ${theme === 'light' ? '#000000' : '#1a1a1a'};
          color: ${theme === 'light' ? '#ffffff' : '#e0e0e0'};
          padding: 8px 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid ${theme === 'light' ? '#000000' : '#666666'};
        }
        
        .window-title {
          font-size: 14px;
          font-weight: 700;
        }
        
        .window-close {
          background: #ff4444;
          border: 1px solid #000000;
          width: 16px;
          height: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: #000000;
        }
        
        .window-content {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
        }
        
        .window-content h2 {
          font-size: 18px;
          margin: 24px 0 12px 0;
          font-weight: 700;
        }
        
        .window-content h3 {
          font-size: 14px;
          margin: 16px 0 8px 0;
          font-weight: 700;
        }
        
        .window-content p {
          font-size: 13px;
          line-height: 1.7;
          margin-bottom: 16px;
        }
        
        .window-content ul {
          margin: 16px 0 16px 24px;
          font-size: 13px;
          line-height: 1.7;
        }
        
        .window-content li {
          margin-bottom: 8px;
        }
        
        .menubar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 32px;
          background: ${theme === 'light' ? '#e6e6e6' : '#1a1a1a'};
          border-top: 2px solid ${theme === 'light' ? '#000000' : '#666666'};
          display: flex;
          align-items: center;
          padding: 0 12px;
          gap: 12px;
          font-size: 11px;
          z-index: 999;
        }
        
        .menubar-button {
          padding: 4px 8px;
          background: ${theme === 'light' ? '#ffffff' : '#2a2a2a'};
          border: 1px solid ${theme === 'light' ? '#000000' : '#666666'};
          cursor: pointer;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
        }
        
        @media (max-width: 768px) {
          .desktop {
            grid-template-columns: repeat(auto-fill, 80px);
            grid-auto-rows: 80px;
            gap: 12px;
          }
          .icon-image {
            width: 40px;
            height: 40px;
            font-size: 20px;
          }
        }
      `}</style>

      <div className="desktop">
        {/* About Icon */}
        <div
          className="desktop-icon"
          onClick={() => setOpenWindow('about')}
          onKeyPress={(e) => e.key === 'Enter' && setOpenWindow('about')}
          tabIndex={0}
          role="button"
          aria-label={t.desktopAbout}
        >
          <div className="icon-image">📄</div>
          <div className="icon-label">{t.desktopAbout}</div>
        </div>

        {/* Why Web3 Icon */}
        <div
          className="desktop-icon"
          onClick={() => setOpenWindow('why-web3')}
          onKeyPress={(e) => e.key === 'Enter' && setOpenWindow('why-web3')}
          tabIndex={0}
          role="button"
          aria-label={t.desktopWhyWeb3}
        >
          <div className="icon-image">📁</div>
          <div className="icon-label">{t.desktopWhyWeb3}</div>
        </div>

        {/* Data Governance Icon */}
        <div
          className="desktop-icon"
          onClick={() => setOpenWindow('governance')}
          onKeyPress={(e) => e.key === 'Enter' && setOpenWindow('governance')}
          tabIndex={0}
          role="button"
          aria-label={t.desktopGovernance}
        >
          <div className="icon-image">📋</div>
          <div className="icon-label">{t.desktopGovernance}</div>
        </div>

        {/* Privacy Icon */}
        <div
          className="desktop-icon"
          onClick={() => setOpenWindow('privacy')}
          onKeyPress={(e) => e.key === 'Enter' && setOpenWindow('privacy')}
          tabIndex={0}
          role="button"
          aria-label={t.desktopPrivacy}
        >
          <div className="icon-image">🔒</div>
          <div className="icon-label">{t.desktopPrivacy}</div>
        </div>

        {/* Contact Icon */}
        <div
          className="desktop-icon"
          onClick={() => setOpenWindow('contact')}
          onKeyPress={(e) => e.key === 'Enter' && setOpenWindow('contact')}
          tabIndex={0}
          role="button"
          aria-label={t.desktopContact}
        >
          <div className="icon-image">✉️</div>
          <div className="icon-label">{t.desktopContact}</div>
        </div>
      </div>

      {/* Menubar */}
      <div className="menubar">
        <button
          className="menubar-button"
          onClick={toggleTheme}
          aria-label={t.desktopTheme}
        >
          {t.desktopTheme}
        </button>
        <button
          className="menubar-button"
          onClick={() => setLang(lang === 'en' ? 'cy' : 'en')}
          aria-label={t.desktopLang}
        >
          {t.desktopLang}
        </button>
      </div>

      {/* Windows */}
      {openWindow === 'about' && (
        <div className="window" role="dialog" aria-labelledby="about-title">
          <div className="window-titlebar">
            <div className="window-title" id="about-title">{t.aboutTitle}</div>
            <button 
              className="window-close"
              onClick={() => setOpenWindow(null)}
              aria-label={t.closeButton}
            >
              ×
            </button>
          </div>
          <div className="window-content">
            <p>{t.aboutText1}</p>

            <h2>{t.aboutProblem}</h2>
            <p>{t.aboutProblemText}</p>
            <ul>
              {t.aboutPowerTypes.map((type, i) => (
                <li key={i}><strong>{type.split(':')[0]}:</strong> {type.split(':')[1]}</li>
              ))}
            </ul>
            <p>{t.aboutMargin}</p>

            <h3>{t.aboutCardiff}</h3>
            <p>{t.aboutCardiffText}</p>

            <h2>{t.aboutMethod}</h2>
            <p>{t.aboutMethodText}</p>

            <h2>{t.aboutQuestions}</h2>
            <ul>
              {t.aboutQuestionsList.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>

            <p style={{ marginTop: '24px', fontSize: '12px', color: theme === 'light' ? '#666666' : '#999999' }}>
              {t.aboutStatus}
            </p>
          </div>
        </div>
      )}

      {openWindow === 'contact' && (
        <div className="window" role="dialog" aria-labelledby="contact-title">
          <div className="window-titlebar">
            <div className="window-title" id="contact-title">{t.contactTitle}</div>
            <button 
              className="window-close"
              onClick={() => setOpenWindow(null)}
              aria-label={t.closeButton}
            >
              ×
            </button>
          </div>
          <div className="window-content">
            <p><strong>{t.contactName}</strong></p>
            <p>{t.contactRole}</p>
            <p>{t.contactInst}</p>
            <p><a href={`mailto:${t.contactEmail}`} style={{ textDecoration: 'underline', color: 'inherit' }}>{t.contactEmail}</a></p>
            <p style={{ marginTop: '16px' }}>{t.contactAvail}</p>
          </div>
        </div>
      )}

      {openWindow === 'why-web3' && (
        <div className="window" role="dialog" aria-labelledby="why-title">
          <div className="window-titlebar">
            <div className="window-title" id="why-title">{t.whyTitle}</div>
            <button 
              className="window-close"
              onClick={() => setOpenWindow(null)}
              aria-label={t.closeButton}
            >
              ×
            </button>
          </div>
          <div className="window-content">
            <p>{t.whyIntro}</p>

            <h2>{t.whyWeb2Problem}</h2>
            <p>{t.whyWeb2Text}</p>

            <h2>{t.whyWeb3Enables}</h2>
            <ul>
              {t.whyWeb3Points.map((point, i) => (
                <li key={i}><strong>{point.split(':')[0]}:</strong> {point.split(':')[1]}</li>
              ))}
            </ul>

            <h2>{t.whyMechanisms}</h2>
            <ul>
              {t.whyMechanismsList.map((mech, i) => (
                <li key={i}><strong>{mech.split(':')[0]}:</strong> {mech.split(':')[1]}</li>
              ))}
            </ul>

            <h2>{t.whyLimitations}</h2>
            <p>{t.whyLimitationsText}</p>
          </div>
        </div>
      )}

      {openWindow === 'governance' && (
        <div className="window" role="dialog" aria-labelledby="gov-title">
          <div className="window-titlebar">
            <div className="window-title" id="gov-title">{t.govTitle}</div>
            <button 
              className="window-close"
              onClick={() => setOpenWindow(null)}
              aria-label={t.closeButton}
            >
              ×
            </button>
          </div>
          <div className="window-content">
            <p>{t.govIntro}</p>

            <h2>{t.govWebsiteData}</h2>
            <p>{t.govWebsiteText}</p>

            <h2>{t.govResearchData}</h2>
            <p>{t.govResearchText}</p>

            <h2>{t.govQuestions}</h2>
            <ul>
              {t.govQuestionsList.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>

            <h2>{t.govCommitments}</h2>
            <ul>
              {t.govCommitmentsList.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {openWindow === 'privacy' && (
        <div className="window" role="dialog" aria-labelledby="privacy-title">
          <div className="window-titlebar">
            <div className="window-title" id="privacy-title">{t.privacyTitle}</div>
            <button 
              className="window-close"
              onClick={() => setOpenWindow(null)}
              aria-label={t.closeButton}
            >
              ×
            </button>
          </div>
          <div className="window-content">
            <p style={{ fontSize: '11px', color: theme === 'light' ? '#666666' : '#999999', marginBottom: '16px' }}>{t.privacyUpdated}</p>

            <h2>{t.privacyCollect}</h2>
            <p>{t.privacyCollectText}</p>

            <h2>{t.privacyWhy}</h2>
            <p>{t.privacyWhyText}</p>

            <h2>{t.privacyStorage}</h2>
            <p>{t.privacyStorageText}</p>

            <h2>{t.privacyFuture}</h2>
            <p>{t.privacyFutureText}</p>

            <h2>{t.privacyRights}</h2>
            <ul>
              {t.privacyRightsList.map((right, i) => (
                <li key={i}>{right}</li>
              ))}
            </ul>

            <p style={{ marginTop: '24px', fontSize: '12px' }}>{t.privacyContact}</p>
          </div>
        </div>
      )}
    </>
  )
}
