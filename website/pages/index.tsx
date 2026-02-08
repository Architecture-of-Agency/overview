import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function Home() {
  const [lang, setLang] = useState('en')
  const [theme, setTheme] = useState('light')
  const [expandedCard, setExpandedCard] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const vizRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
  }, [])

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return

    const container = vizRef.current
    if (!container) return

    const width = 1000
    const height = 500
    
    while (container.firstChild) {
      container.removeChild(container.firstChild)
    }

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', '100%')
    svg.setAttribute('height', '100%')
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
    svg.setAttribute('role', 'img')
    svg.setAttribute('aria-label', lang === 'en' ? 'Diagram showing extraction of knowledge from Cardiff communities to Local Authority with no control returned' : 'Diagram yn dangos echdynnu gwybodaeth o gymunedau Caerdydd i Awdurdod Lleol heb ddim rheolaeth yn dychwelyd')
    container.appendChild(svg)

    // Title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    title.setAttribute('x', '50')
    title.setAttribute('y', '40')
    title.setAttribute('fill', theme === 'light' ? '#666' : '#999')
    title.setAttribute('font-size', '14')
    title.setAttribute('font-family', 'Space Mono, monospace')
    title.setAttribute('font-weight', '700')
    title.setAttribute('letter-spacing', '1')
    title.textContent = lang === 'en' ? 'Current state: Extraction without return' : 'Cyflwr cyfredol: Echdynnu heb ddychwelyd'
    svg.appendChild(title)

    // LEFT SIDE: Community circles (6 + 22)
    const leftX = 200
    const topY = 150
    const bottomY = 350

    // 6 wards with councils (top, green)
    const withCouncil = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    withCouncil.setAttribute('cx', leftX.toString())
    withCouncil.setAttribute('cy', topY.toString())
    withCouncil.setAttribute('r', '60')
    withCouncil.setAttribute('fill', 'none')
    withCouncil.setAttribute('stroke', '#00cc88')
    withCouncil.setAttribute('stroke-width', '3')
    withCouncil.setAttribute('opacity', '0.8')
    svg.appendChild(withCouncil)

    const withLabel1 = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    withLabel1.setAttribute('x', leftX.toString())
    withLabel1.setAttribute('y', (topY - 5).toString())
    withLabel1.setAttribute('text-anchor', 'middle')
    withLabel1.setAttribute('fill', '#00cc88')
    withLabel1.setAttribute('font-size', '32')
    withLabel1.setAttribute('font-family', 'Space Mono, monospace')
    withLabel1.setAttribute('font-weight', '700')
    withLabel1.textContent = '6'
    svg.appendChild(withLabel1)

    const withLabel2 = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    withLabel2.setAttribute('x', leftX.toString())
    withLabel2.setAttribute('y', (topY + 20).toString())
    withLabel2.setAttribute('text-anchor', 'middle')
    withLabel2.setAttribute('fill', theme === 'light' ? '#666' : '#999')
    withLabel2.setAttribute('font-size', '10')
    withLabel2.setAttribute('font-family', 'Space Mono, monospace')
    withLabel2.textContent = lang === 'en' ? 'wards with' : 'wardiau gyda'
    svg.appendChild(withLabel2)

    const withLabel3 = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    withLabel3.setAttribute('x', leftX.toString())
    withLabel3.setAttribute('y', (topY + 35).toString())
    withLabel3.setAttribute('text-anchor', 'middle')
    withLabel3.setAttribute('fill', theme === 'light' ? '#666' : '#999')
    withLabel3.setAttribute('font-size', '10')
    withLabel3.setAttribute('font-family', 'Space Mono, monospace')
    withLabel3.textContent = lang === 'en' ? 'community councils' : 'cynghorau cymuned'
    svg.appendChild(withLabel3)

    // 22 wards without councils (bottom, red)
    const withoutCouncil = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    withoutCouncil.setAttribute('cx', leftX.toString())
    withoutCouncil.setAttribute('cy', bottomY.toString())
    withoutCouncil.setAttribute('r', '80')
    withoutCouncil.setAttribute('fill', 'none')
    withoutCouncil.setAttribute('stroke', '#ff4444')
    withoutCouncil.setAttribute('stroke-width', '3')
    withoutCouncil.setAttribute('stroke-dasharray', '8,4')
    withoutCouncil.setAttribute('opacity', '0.8')
    svg.appendChild(withoutCouncil)

    const withoutLabel1 = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    withoutLabel1.setAttribute('x', leftX.toString())
    withoutLabel1.setAttribute('y', (bottomY - 5).toString())
    withoutLabel1.setAttribute('text-anchor', 'middle')
    withoutLabel1.setAttribute('fill', '#ff4444')
    withoutLabel1.setAttribute('font-size', '32')
    withoutLabel1.setAttribute('font-family', 'Space Mono, monospace')
    withoutLabel1.setAttribute('font-weight', '700')
    withoutLabel1.textContent = '22'
    svg.appendChild(withoutLabel1)

    const withoutLabel2 = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    withoutLabel2.setAttribute('x', leftX.toString())
    withoutLabel2.setAttribute('y', (bottomY + 20).toString())
    withoutLabel2.setAttribute('text-anchor', 'middle')
    withoutLabel2.setAttribute('fill', theme === 'light' ? '#666' : '#999')
    withoutLabel2.setAttribute('font-size', '10')
    withoutLabel2.setAttribute('font-family', 'Space Mono, monospace')
    withoutLabel2.textContent = lang === 'en' ? 'wards with' : 'wardiau heb'
    svg.appendChild(withoutLabel2)

    const withoutLabel3 = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    withoutLabel3.setAttribute('x', leftX.toString())
    withoutLabel3.setAttribute('y', (bottomY + 35).toString())
    withoutLabel3.setAttribute('text-anchor', 'middle')
    withoutLabel3.setAttribute('fill', theme === 'light' ? '#666' : '#999')
    withoutLabel3.setAttribute('font-size', '10')
    withoutLabel3.setAttribute('font-family', 'Space Mono, monospace')
    withoutLabel3.textContent = lang === 'en' ? 'no formal structure' : 'dim strwythur ffurfiol'
    svg.appendChild(withoutLabel3)

    // RIGHT SIDE: Local Authority
    const rightX = 800
    const centerY = 250

    const laCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    laCircle.setAttribute('cx', rightX.toString())
    laCircle.setAttribute('cy', centerY.toString())
    laCircle.setAttribute('r', '90')
    laCircle.setAttribute('fill', theme === 'light' ? '#1a1a1a' : '#0a0a0a')
    laCircle.setAttribute('stroke', theme === 'light' ? '#666' : '#999')
    laCircle.setAttribute('stroke-width', '3')
    svg.appendChild(laCircle)

    const laText1 = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    laText1.setAttribute('x', rightX.toString())
    laText1.setAttribute('y', (centerY - 8).toString())
    laText1.setAttribute('text-anchor', 'middle')
    laText1.setAttribute('fill', theme === 'light' ? '#ffffff' : '#e0e0e0')
    laText1.setAttribute('font-size', '16')
    laText1.setAttribute('font-family', 'Space Mono, monospace')
    laText1.setAttribute('font-weight', '700')
    laText1.textContent = lang === 'en' ? 'Local' : 'Awdurdod'
    svg.appendChild(laText1)

    const laText2 = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    laText2.setAttribute('x', rightX.toString())
    laText2.setAttribute('y', (centerY + 12).toString())
    laText2.setAttribute('text-anchor', 'middle')
    laText2.setAttribute('fill', theme === 'light' ? '#ffffff' : '#e0e0e0')
    laText2.setAttribute('font-size', '16')
    laText2.setAttribute('font-family', 'Space Mono, monospace')
    laText2.setAttribute('font-weight', '700')
    laText2.textContent = lang === 'en' ? 'Authority' : 'Lleol'
    svg.appendChild(laText2)

    // ARROWS: Knowledge extraction (one-way)
    // Arrow definitions
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
    
    const markerGreen = document.createElementNS('http://www.w3.org/2000/svg', 'marker')
    markerGreen.setAttribute('id', 'arrowhead-green')
    markerGreen.setAttribute('markerWidth', '10')
    markerGreen.setAttribute('markerHeight', '10')
    markerGreen.setAttribute('refX', '9')
    markerGreen.setAttribute('refY', '3')
    markerGreen.setAttribute('orient', 'auto')
    const polygonGreen = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
    polygonGreen.setAttribute('points', '0 0, 10 3, 0 6')
    polygonGreen.setAttribute('fill', '#00cc88')
    polygonGreen.setAttribute('opacity', '0.6')
    markerGreen.appendChild(polygonGreen)
    defs.appendChild(markerGreen)

    const markerRed = document.createElementNS('http://www.w3.org/2000/svg', 'marker')
    markerRed.setAttribute('id', 'arrowhead-red')
    markerRed.setAttribute('markerWidth', '10')
    markerRed.setAttribute('markerHeight', '10')
    markerRed.setAttribute('refX', '9')
    markerRed.setAttribute('refY', '3')
    markerRed.setAttribute('orient', 'auto')
    const polygonRed = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
    polygonRed.setAttribute('points', '0 0, 10 3, 0 6')
    polygonRed.setAttribute('fill', '#ff4444')
    polygonRed.setAttribute('opacity', '0.6')
    markerRed.appendChild(polygonRed)
    defs.appendChild(markerRed)

    svg.insertBefore(defs, svg.firstChild)

    // From 6 wards
    const arrow1 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    arrow1.setAttribute('x1', (leftX + 60).toString())
    arrow1.setAttribute('y1', topY.toString())
    arrow1.setAttribute('x2', (rightX - 90).toString())
    arrow1.setAttribute('y2', (centerY - 40).toString())
    arrow1.setAttribute('stroke', '#00cc88')
    arrow1.setAttribute('stroke-width', '3')
    arrow1.setAttribute('opacity', '0.6')
    arrow1.setAttribute('marker-end', 'url(#arrowhead-green)')
    svg.appendChild(arrow1)

    // From 22 wards
    const arrow2 = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    arrow2.setAttribute('x1', (leftX + 80).toString())
    arrow2.setAttribute('y1', bottomY.toString())
    arrow2.setAttribute('x2', (rightX - 90).toString())
    arrow2.setAttribute('y2', (centerY + 40).toString())
    arrow2.setAttribute('stroke', '#ff4444')
    arrow2.setAttribute('stroke-width', '3')
    arrow2.setAttribute('opacity', '0.6')
    arrow2.setAttribute('marker-end', 'url(#arrowhead-red)')
    svg.appendChild(arrow2)

    // Labels for arrows
    const flowLabel1 = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    flowLabel1.setAttribute('x', '480')
    flowLabel1.setAttribute('y', '180')
    flowLabel1.setAttribute('text-anchor', 'middle')
    flowLabel1.setAttribute('fill', theme === 'light' ? '#666' : '#999')
    flowLabel1.setAttribute('font-size', '11')
    flowLabel1.setAttribute('font-family', 'Space Mono, monospace')
    flowLabel1.setAttribute('font-style', 'italic')
    flowLabel1.textContent = lang === 'en' ? 'knowledge flows →' : 'llifau gwybodaeth →'
    svg.appendChild(flowLabel1)

    const flowLabel2 = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    flowLabel2.setAttribute('x', '480')
    flowLabel2.setAttribute('y', '330')
    flowLabel2.setAttribute('text-anchor', 'middle')
    flowLabel2.setAttribute('fill', theme === 'light' ? '#666' : '#999')
    flowLabel2.setAttribute('font-size', '11')
    flowLabel2.setAttribute('font-family', 'Space Mono, monospace')
    flowLabel2.setAttribute('font-style', 'italic')
    flowLabel2.textContent = lang === 'en' ? 'knowledge flows →' : 'llifau gwybodaeth →'
    svg.appendChild(flowLabel2)

    // NO RETURN annotation
    const noReturn = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    noReturn.setAttribute('x', '500')
    noReturn.setAttribute('y', '460')
    noReturn.setAttribute('text-anchor', 'middle')
    noReturn.setAttribute('fill', '#ff4444')
    noReturn.setAttribute('font-size', '12')
    noReturn.setAttribute('font-family', 'Space Mono, monospace')
    noReturn.setAttribute('font-weight', '700')
    noReturn.textContent = lang === 'en' ? '← NO CONTROL RETURNS' : '← DIM RHEOLAETH YN DYCHWELYD'
    svg.appendChild(noReturn)

  }, [mounted, theme, lang])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }
  
  const content = {
    en: {
      mission: 'Researching Web3-enabled inclusive governance systems for sovereign neighbourhood data - shaping the built environment and place from street to national level',
      
      metaTitle: 'Practising what we research',
      metaText1: 'The visualisation below shows how Cardiff communities have no control over their data — knowledge flows to the Local Authority with nothing returned.',
      metaText2: 'This website could reproduce that same extractive pattern. To avoid this contradiction, we are modelling a transition from institutional data stewardship to community sovereignty.',
      metaText3: 'Cardiff University temporarily holds this website\'s data as custodian — not owner — with planned transfer to community-determined governance structures.',
      metaLink: 'Read our data governance model',
      
      researchFocus: 'Research focus',
      currentProject: 'Current project',
      relatedInitiatives: 'Related initiatives',
      contact: 'Contact',
      contactAvailability: 'Available for meetings in Cardiff/Online',
      
      vizTitle: 'Structural exclusion in Cardiff',
      vizDesc: 'Both groups have zero decision-making power. Knowledge is extracted upward with no control returned to communities. Even where formal channels exist (6 wards with community councils), they are tokenistic — communities can propose but cannot decide.',
      vizKey: [
        'Green = Formal channel exists (tokenistic only)',
        'Red = No formal channel',
        'Both groups → zero power, zero control',
        '£50k+ barrier to establish community council'
      ],
      
      card1Title: 'Data sovereignty',
      card1Short: 'Whose knowledge counts? Who owns and can manipulate data and knowledge? Addressing epistemic injustice in urban governance systems.',
      card1Full: 'Whose knowledge counts? Who owns and can manipulate data and knowledge? Our work examines epistemic justice in urban governance—challenging who gets to define what counts as legitimate knowledge in planning and design decisions. We investigate how blockchain and Web3 technologies can redistribute power over data ownership, ensuring communities maintain sovereignty over the knowledge they generate about their own places. This extends beyond technical solutions to question fundamental power structures in how urban data is collected, validated, and used to shape the built environment.',
      
      card2Title: 'Inclusive design',
      card2Short: 'Applying design justice principles to build systems that challenge rather than reproduce existing power structures. Centring disabled people and communities in creating accountable technologies.',
      card2Full: 'Applying design justice principles to build systems that challenge rather than reproduce existing power structures. We centre disabled people and marginalised communities throughout our research and design process—not as consultation afterthoughts, but as co-designers and leaders. Our approach recognises that technology often replicates existing barriers and hierarchies. By foregrounding accessibility, we create governance tools that redistribute rather than concentrate power, ensuring new digital systems enable rather than exclude participation in shaping places.',
      
      card3Title: 'Digital governance',
      card3Short: 'Web3 and blockchain systems for community-led planning and transparent, accountable decision-making processes.',
      card3Full: 'Web3 and blockchain systems for community-led planning and transparent, accountable decision-making processes. We explore how decentralised technologies can enable genuine community control over planning and design decisions—moving beyond extractive consultation towards meaningful devolved power. Our research investigates smart contracts for transparent decision-making, DAOs for community governance, and blockchain for creating auditable, community-owned records of planning processes that shape the built environment. The goal is accountability: tools that make power visible and challengeable.',
      
      clickToExpand: '[+] expand',
      clickToCollapse: '[-] collapse',
      
      projectTitle: 'Place-based Data Sovereignty',
      projectDesc: 'Co-designing place-based data systems with communities in Cardiff, Wales. Testing how blockchain can support transparency, accountability and real devolved power to communities in shaping the built environment and planning processes.',
      
      project2Title: 'National Data Infrastructure',
      project2Text: 'Exploring how place-based data scales from street to neighbourhood, city, and national levels. Building frameworks for community data to shape the built environment—from street designs to national infrastructure—whilst maintaining community sovereignty.',
      
      project3Title: 'Place-based Digital Identity',
      project3Text: 'Investigating place and location as identity mechanisms for engaging with governance processes. Avoiding surveillance systems and traditional digital IDs whilst enabling meaningful participation in shaping places.',
      
      viewProject: '[→] view project',
      ongoing: 'Ongoing',
      funding: 'Open to partnerships and funding',
      dataGovernance: 'Data Governance',
      privacyPolicy: 'Privacy',
      footer: 'Web3 :: Governance :: Inclusion'
    },
    cy: {
      mission: 'Ymchwilio i systemau llywodraethiant cynhwysol Web3-alluog ar gyfer data cymdogaeth sofran - llunio\'r amgylchedd adeiledig a lle o lefel stryd i lefel genedlaethol',
      
      metaTitle: 'Ymarfer yr hyn rydym yn ymchwilio',
      metaText1: 'Mae\'r delweddiad isod yn dangos sut nad oes gan gymunedau Caerdydd unrhyw reolaeth dros eu data — mae gwybodaeth yn llifo i\'r Awdurdod Lleol heb ddim yn dychwelyd.',
      metaText2: 'Gallai\'r wefan hon atgynhyrchu\'r un patrwm echdynnol. I osgoi\'r gwrthddywediad hwn, rydym yn modelu trosglwyddiad o stiwardiaeth ddata sefydliadol i sofraniaeth gymunedol.',
      metaText3: 'Mae Prifysgol Caerdydd yn dal data\'r wefan hon dros dro fel ceidwad — nid perchennog — gyda throsglwyddiad arfaethedig i strwythurau llywodraethu a bennir gan y gymuned.',
      metaLink: 'Darllenwch ein model llywodraethu data',
      
      researchFocus: 'Ffocws ymchwil',
      currentProject: 'Prosiect cyfredol',
      relatedInitiatives: 'Mentrau cysylltiedig',
      contact: 'Cysylltu',
      contactAvailability: 'Ar gael ar gyfer cyfarfodydd yng Nghaerdydd/Ar-lein',
      
      vizTitle: 'Gwaharddiad strwythurol yng Nghaerdydd',
      vizDesc: 'Mae gan y ddau grŵp sero pŵer gwneud penderfyniadau. Mae gwybodaeth yn cael ei echdynnu i fyny heb ddim rheolaeth yn dychwelyd i gymunedau. Hyd yn oed lle mae sianeli ffurfiol yn bodoli (6 ward â chynghorau cymuned), maent yn docenistig — gall cymunedau gynnig ond ni allant benderfynu.',
      vizKey: [
        'Gwyrdd = Sianel ffurfiol yn bodoli (tocenistig yn unig)',
        'Coch = Dim sianel ffurfiol',
        'Y ddau grŵp → sero pŵer, sero rheolaeth',
        'Rhwystr £50k+ i sefydlu cyngor cymuned'
      ],
      
      card1Title: 'Sofraniaeth data',
      card1Short: 'Pa wybodaeth sy\'n cyfrif? Pwy sy\'n berchen ar ddata a gwybodaeth ac yn gallu eu trin? Mynd i\'r afael â chyfiawnder epistemolegol mewn systemau llywodraethiant trefol.',
      card1Full: 'Pa wybodaeth sy\'n cyfrif? Pwy sy\'n berchen ar ddata a gwybodaeth ac yn gallu eu trin? Mae ein gwaith yn archwilio cyfiawnder epistemolegol mewn llywodraethiant trefol—herio pwy sy\'n cael diffinio beth sy\'n cyfrif fel gwybodaeth ddilys mewn penderfyniadau cynllunio a dylunio. Rydym yn ymchwilio sut gall technolegau blockchain a Gwe3 ailddosbarthu pŵer dros berchnogaeth data, gan sicrhau bod cymunedau yn cynnal sofraniaeth dros y wybodaeth maent yn ei chynhyrchu am eu lleoedd eu hunain.',
      
      card2Title: 'Dylunio cynhwysol',
      card2Short: 'Cymhwyso egwyddorion cyfiawnder dylunio i adeiladu systemau sy\'n herio yn hytrach nag atgynhyrchu strwythurau pŵer presennol. Canoli pobl anabl a chymunedau wrth greu technolegau atebol.',
      card2Full: 'Cymhwyso egwyddorion cyfiawnder dylunio i adeiladu systemau sy\'n herio yn hytrach nag atgynhyrchu strwythurau pŵer presennol. Rydym yn canoli pobl anabl a chymunedau ymylol trwy gydol ein proses ymchwil a dylunio—nid fel ymgynghoriadau ôl-feddwl, ond fel cyd-ddylunwyr ac arweinwyr. Mae ein dull yn cydnabod bod technoleg yn aml yn dyblygu rhwystrau a hierarchaethau presennol. Trwy roi hygyrchedd yn y blaen, rydym yn creu offer llywodraethiant sy\'n ailddosbarthu yn hytrach na chrynhoi pŵer.',
      
      card3Title: 'Llywodraethiant digidol',
      card3Short: 'Systemau Gwe3 a blockchain ar gyfer cynllunio dan arweiniad cymunedol a phrosesau gwneud penderfyniadau tryloyw ac atebol.',
      card3Full: 'Systemau Gwe3 a blockchain ar gyfer cynllunio dan arweiniad cymunedol a phrosesau gwneud penderfyniadau tryloyw ac atebol. Rydym yn archwilio sut gall technolegau datganoledig alluogi rheolaeth gymunedol wirioneddol dros benderfyniadau cynllunio a dylunio—symud y tu hwnt i ymgynghori echdynnol tuag at bŵer datganoledig ystyrlon. Mae ein hymchwil yn ymchwilio i gontractau craff ar gyfer gwneud penderfyniadau tryloyw, DAOs ar gyfer llywodraethiant cymunedol, a blockchain ar gyfer creu cofnodion archwiliadwy, sy\'n eiddo i\'r gymuned.',
      
      clickToExpand: '[+] ehangu',
      clickToCollapse: '[-] cau',
      
      projectTitle: 'Sofraniaeth Data Lle-seiliedig',
      projectDesc: 'Cyd-gynllunio systemau data lle-seiliedig gyda chymunedau yng Nghaerdydd, Cymru. Profi sut gall blockchain gefnogi tryloywder, atebolrwydd a gwir bŵer datganoledig i gymunedau mewn llunio\'r amgylchedd adeiledig a phrosesau cynllunio.',
      
      project2Title: 'Seilwaith Data Cenedlaethol',
      project2Text: 'Archwilio sut mae data lle-seiliedig yn graddio o lefel stryd i gymdogaeth, dinas a lefelau cenedlaethol. Adeiladu fframweithiau i ddata cymunedol lunio\'r amgylchedd adeiledig—o ddyluniadau stryd i seilwaith cenedlaethol—tra\'n cynnal sofraniaeth gymunedol.',
      
      project3Title: 'Hunaniaeth Ddigidol Lle-seiliedig',
      project3Text: 'Ymchwilio i le a lleoliad fel mecanweithiau hunaniaeth ar gyfer ymgysylltu â phrosesau llywodraethiant. Osgoi systemau gwyliadwriaeth a hunoliaethau digidol traddodiadol tra\'n galluogi cyfranogiad ystyrlon mewn llunio lleoedd.',
      
      viewProject: '[→] gweld prosiect',
      ongoing: 'Ar y gweill',
      funding: 'Agored i bartneriaethau a chyllid',
      dataGovernance: 'Llywodraethu Data',
      privacyPolicy: 'Preifatrwydd',
      footer: 'Gwe3 :: Llywodraethiant :: Cynhwysiant'
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
        
        @keyframes cornerFlicker {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.15; }
          75% { opacity: 0.3; }
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
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, ${theme === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.02)'} 2px, ${theme === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.02)'} 4px);
          pointer-events: none;
          z-index: 1000;
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
          border-left: 2px solid ${theme === 'light' ? '#666' : '#999'}; 
          border-top: 2px solid ${theme === 'light' ? '#666' : '#999'};
          animation: cornerFlicker 5s ease-in-out infinite;
        }
        
        .corner-tr { 
          top: 20px; 
          right: 20px; 
          border-right: 2px solid ${theme === 'light' ? '#666' : '#999'}; 
          border-top: 2px solid ${theme === 'light' ? '#666' : '#999'};
          animation: cornerFlicker 5s ease-in-out infinite 0.7s;
        }
        
        .corner-bl { 
          bottom: 20px; 
          left: 20px; 
          border-left: 2px solid ${theme === 'light' ? '#666' : '#999'}; 
          border-bottom: 2px solid ${theme === 'light' ? '#666' : '#999'};
          animation: cornerFlicker 5s ease-in-out infinite 1.4s;
        }
        
        .corner-br { 
          bottom: 20px; 
          right: 20px; 
          border-right: 2px solid ${theme === 'light' ? '#666' : '#999'}; 
          border-bottom: 2px solid ${theme === 'light' ? '#666' : '#999'};
          animation: cornerFlicker 5s ease-in-out infinite 2.1s;
        }
        
        .fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        
        .section-label {
          font-size: 11px;
          letter-spacing: 2px;
          color: ${theme === 'light' ? '#666' : '#999'};
          margin-bottom: 16px;
          font-weight: 700;
        }
        
        .card-clickable {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        
        .card-clickable:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px ${theme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
          border-color: ${theme === 'light' ? '#444' : '#bbb'};
        }
        
        .card-expandable {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        
        .card-expandable:hover {
          transform: translateY(-2px);
          border-color: ${theme === 'light' ? '#444' : '#bbb'};
          box-shadow: 0 4px 8px ${theme === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.04)'};
        }
        
        .expand-indicator {
          font-size: 10px;
          color: ${theme === 'light' ? '#888' : '#aaa'};
          margin-top: 12px;
          letter-spacing: 1px;
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
        
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
          .corner, .fade-in, .card-clickable, .card-expandable {
            animation: none !important;
          }
          .card-clickable:hover, .card-expandable:hover {
            transform: none;
          }
        }
      `}</style>

      <div className="scanlines" aria-hidden="true"></div>
      <div className="corner corner-tl" aria-hidden="true"></div>
      <div className="corner corner-tr" aria-hidden="true"></div>
      <div className="corner corner-bl" aria-hidden="true"></div>
      <div className="corner corner-br" aria-hidden="true"></div>

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
        {/* Hero */}
        <section className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto 80px' }}>
          <div style={{ 
            background: theme === 'light' ? '#ffffff' : '#1a1a1a', 
            border: `2px solid ${theme === 'light' ? '#666' : '#999'}`, 
            padding: '40px',
            transition: 'background 0.3s ease, border 0.3s ease'
          }}>
            <h1 style={{ fontSize: '48px', fontWeight: 700, marginBottom: '24px', lineHeight: 1.2, letterSpacing: '-1px' }}>
              Leol Lab
            </h1>
            
            <p style={{ fontSize: '16px', lineHeight: 1.7, maxWidth: '800px' }}>
              {t.mission}
            </p>
          </div>
        </section>

        {/* Meta-Research Notice */}
        <section className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto 80px' }}>
          <div style={{ 
            background: theme === 'light' ? '#ffffff' : '#1a1a1a', 
            border: `2px solid ${theme === 'light' ? '#666' : '#999'}`, 
            padding: '32px',
            transition: 'background 0.3s ease, border 0.3s ease'
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', letterSpacing: '0.5px' }}>
              {t.metaTitle}
            </h2>
            <p style={{ fontSize: '14px', lineHeight: 1.7, marginBottom: '16px' }}>
              {t.metaText1}
            </p>
            <p style={{ fontSize: '14px', lineHeight: 1.7, marginBottom: '16px' }}>
              {t.metaText2}
            </p>
            <p style={{ fontSize: '14px', lineHeight: 1.7, marginBottom: '16px' }}>
              {t.metaText3}
            </p>
            <p style={{ fontSize: '11px', color: theme === 'light' ? '#666' : '#999', letterSpacing: '1px' }}>
              <Link href="/governance" style={{ textDecoration: 'underline' }}>
                {t.metaLink} →
              </Link>
            </p>
          </div>
        </section>

        {/* Visualisation */}
        <section className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto 80px' }}>
          <h2 className="section-label">{t.vizTitle}</h2>
          
          <div style={{ 
            background: theme === 'light' ? '#ffffff' : '#1a1a1a', 
            border: `2px solid ${theme === 'light' ? '#666' : '#999'}`,
            padding: '24px',
            transition: 'background 0.3s ease, border 0.3s ease',
            marginBottom: '20px'
          }}>
            <p style={{ fontSize: '14px', lineHeight: 1.7, marginBottom: '16px' }}>
              {t.vizDesc}
            </p>
            <ul style={{ listStyle: 'none', fontSize: '11px', lineHeight: 1.9, color: theme === 'light' ? '#666' : '#999' }}>
              {t.vizKey.map((label: string, i: number) => (
                <li key={i}>[·] {label}</li>
              ))}
            </ul>
          </div>

          <div style={{ 
            background: theme === 'light' ? '#ffffff' : '#1a1a1a', 
            border: `2px solid ${theme === 'light' ? '#666' : '#999'}`,
            padding: '20px',
            transition: 'background 0.3s ease, border 0.3s ease'
          }}>
            <div ref={vizRef} style={{ width: '100%', minHeight: '500px' }} />
          </div>
        </section>

        {/* Research Focus */}
        <section className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto 60px' }}>
          <h2 className="section-label">
            {t.researchFocus}
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {[1, 2, 3].map(cardNum => (
              <article 
                key={cardNum}
                className="card-expandable" 
                style={{ 
                  background: theme === 'light' ? '#ffffff' : '#1a1a1a', 
                  border: `2px solid ${theme === 'light' ? '#666' : '#999'}`, 
                  padding: '24px',
                  transition: 'background 0.3s ease, border 0.3s ease'
                }}
                onClick={() => setExpandedCard(expandedCard === cardNum ? null : cardNum)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setExpandedCard(expandedCard === cardNum ? null : cardNum)
                  }
                }}
                aria-expanded={expandedCard === cardNum}
              >
                <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', letterSpacing: '0.5px' }}>
                  {t[`card${cardNum}Title` as keyof typeof t]}
                </h3>
                <p style={{ fontSize: '14px', lineHeight: 1.7 }}>
                  {expandedCard === cardNum ? t[`card${cardNum}Full` as keyof typeof t] : t[`card${cardNum}Short` as keyof typeof t]}
                </p>
                <p className="expand-indicator">
                  {expandedCard === cardNum ? t.clickToCollapse : t.clickToExpand}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Current Project */}
        <section className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto 60px' }}>
          <h2 className="section-label">
            {t.currentProject}
          </h2>
          
          <Link href="/projects/place-based-data-sovereignty">
            <article className="card-clickable" style={{ 
              background: theme === 'light' ? '#ffffff' : '#1a1a1a', 
              border: `2px solid ${theme === 'light' ? '#666' : '#999'}`, 
              padding: '32px',
              transition: 'background 0.3s ease, border 0.3s ease'
            }}>
              <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: 700, letterSpacing: '0.5px' }}>
                {t.projectTitle}
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.7, marginBottom: '16px' }}>
                {t.projectDesc}
              </p>
              <p style={{ fontSize: '11px', color: theme === 'light' ? '#666' : '#999', letterSpacing: '1px' }}>
                {t.viewProject}
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
              <article className="card-clickable" style={{ 
                background: theme === 'light' ? '#ffffff' : '#1a1a1a', 
                border: `2px solid ${theme === 'light' ? '#666' : '#999'}`, 
                padding: '28px',
                transition: 'background 0.3s ease, border 0.3s ease'
              }}>
                <h3 style={{ fontSize: '16px', marginBottom: '12px', fontWeight: 700, letterSpacing: '0.5px' }}>
                  {t.project2Title}
                </h3>
                <p style={{ fontSize: '14px', lineHeight: 1.7, marginBottom: '16px' }}>
                  {t.project2Text}
                </p>
                <div style={{ borderTop: `1px solid ${theme === 'light' ? '#666' : '#999'}`, paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <p style={{ fontSize: '10px', color: theme === 'light' ? '#666' : '#999', letterSpacing: '1px' }}>
                    {t.ongoing}
                  </p>
                  <p style={{ fontSize: '10px', color: theme === 'light' ? '#666' : '#999', letterSpacing: '1px' }}>
                    {t.viewProject}
                  </p>
                </div>
              </article>
            </Link>
            
            <Link href="/projects/place-based-identity">
              <article className="card-clickable" style={{ 
                background: theme === 'light' ? '#ffffff' : '#1a1a1a', 
                border: `2px solid ${theme === 'light' ? '#666' : '#999'}`, 
                padding: '28px',
                transition: 'background 0.3s ease, border 0.3s ease'
              }}>
                <h3 style={{ fontSize: '16px', marginBottom: '12px', fontWeight: 700, letterSpacing: '0.5px' }}>
                  {t.project3Title}
                </h3>
                <p style={{ fontSize: '14px', lineHeight: 1.7, marginBottom: '16px' }}>
                  {t.project3Text}
                </p>
                <div style={{ borderTop: `1px solid ${theme === 'light' ? '#666' : '#999'}`, paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <p style={{ fontSize: '10px', color: theme === 'light' ? '#666' : '#999', letterSpacing: '1px' }}>
                    {t.ongoing}
                  </p>
                  <p style={{ fontSize: '10px', color: theme === 'light' ? '#666' : '#999', letterSpacing: '1px' }}>
                    {t.viewProject}
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
          
          <div style={{ 
            background: theme === 'light' ? '#ffffff' : '#1a1a1a', 
            border: `2px solid ${theme === 'light' ? '#666' : '#999'}`, 
            padding: '32px',
            transition: 'background 0.3s ease, border 0.3s ease'
          }}>
            <p style={{ fontSize: '14px', marginBottom: '8px', letterSpacing: '0.5px' }}>
              <strong>Lucy Dunhill</strong>, PhD Researcher
            </p>
            <p style={{ fontSize: '13px', color: theme === 'light' ? '#555' : '#bbb', marginBottom: '8px' }}>
              Welsh School of Architecture, Cardiff University
            </p>
            <p style={{ fontSize: '13px', marginBottom: '16px' }}>
              <a href="mailto:dunhilll@cardiff.ac.uk" style={{ textDecoration: 'underline' }}>
                dunhilll@cardiff.ac.uk
              </a>
            </p>
            <p style={{ fontSize: '11px', color: theme === 'light' ? '#666' : '#999', borderTop: `1px solid ${theme === 'light' ? '#666' : '#999'}`, paddingTop: '16px', letterSpacing: '0.5px' }}>
              {t.contactAvailability}
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="fade-in" style={{ maxWidth: '1200px', margin: '40px auto 0', paddingTop: '32px', borderTop: `2px solid ${theme === 'light' ? '#666' : '#999'}`, fontSize: '11px', color: theme === 'light' ? '#555' : '#bbb', letterSpacing: '1px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
            <div>© 2025 Leol Lab</div>
            <div>{t.footer}</div>
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', paddingTop: '16px', borderTop: `1px solid ${theme === 'light' ? '#666' : '#999'}` }}>
            <Link href="/governance" style={{ textDecoration: 'underline' }}>
              {t.dataGovernance}
            </Link>
            <Link href="/privacy" style={{ textDecoration: 'underline' }}>
              {t.privacyPolicy}
            </Link>
          </div>
        </footer>
      </main>
    </>
  )
}