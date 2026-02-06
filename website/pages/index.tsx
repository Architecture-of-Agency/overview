import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function Home() {
  const [lang, setLang] = useState('en')
  const [theme, setTheme] = useState('light')
  const [expandedCard, setExpandedCard] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const mapSvgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
  }, [])

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return

    const mapSvg = mapSvgRef.current
    if (!mapSvg) return

    const width = 900
    const height = 600
    
    // Clear existing
    while (mapSvg.firstChild) {
      mapSvg.removeChild(mapSvg.firstChild)
    }

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', '100%')
    svg.setAttribute('height', '100%')
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    mapSvg.appendChild(svg)

    // Grid background
    const grid = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    for (let x = 0; x < width; x += 30) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.setAttribute('x1', x.toString())
      line.setAttribute('y1', '0')
      line.setAttribute('x2', x.toString())
      line.setAttribute('y2', height.toString())
      line.setAttribute('stroke', theme === 'light' ? 'rgba(102,102,102,0.05)' : 'rgba(153,153,153,0.05)')
      line.setAttribute('stroke-width', '1')
      grid.appendChild(line)
    }
    for (let y = 0; y < height; y += 30) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.setAttribute('x1', '0')
      line.setAttribute('y1', y.toString())
      line.setAttribute('x2', width.toString())
      line.setAttribute('y2', y.toString())
      line.setAttribute('stroke', theme === 'light' ? 'rgba(102,102,102,0.05)' : 'rgba(153,153,153,0.05)')
      line.setAttribute('stroke-width', '1')
      grid.appendChild(line)
    }
    svg.appendChild(grid)

    // Cardiff outline (simplified representation)
    const outline = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    outline.setAttribute('x', '50')
    outline.setAttribute('y', '50')
    outline.setAttribute('width', '800')
    outline.setAttribute('height', '500')
    outline.setAttribute('fill', 'none')
    outline.setAttribute('stroke', theme === 'light' ? '#666' : '#999')
    outline.setAttribute('stroke-width', '2')
    outline.setAttribute('stroke-dasharray', '5,5')
    svg.appendChild(outline)

    // Wards with community councils (North/Northwest - affluent)
    const withCouncils = [
      { name: 'Lisvane', x: 650, y: 120, type: 'with' },
      { name: 'Old St Mellons', x: 750, y: 200, type: 'with' },
      { name: 'Pentyrch', x: 150, y: 150, type: 'with' },
      { name: 'Radyr', x: 250, y: 180, type: 'with' },
      { name: 'St Fagans', x: 200, y: 280, type: 'with' },
      { name: 'Tongwynlais', x: 300, y: 100, type: 'with' },
    ]

    // Wards without community councils (South/Central - excluded)
    const withoutCouncils = [
      { name: 'Grangetown', x: 350, y: 450, type: 'without' },
      { name: 'Butetown', x: 450, y: 480, type: 'without' },
      { name: 'Splott', x: 550, y: 460, type: 'without' },
      { name: 'Adamsdown', x: 500, y: 400, type: 'without' },
      { name: 'Canton', x: 350, y: 380, type: 'without' },
      { name: 'Cathays', x: 450, y: 350, type: 'without' },
      { name: 'Riverside', x: 380, y: 420, type: 'without' },
      { name: 'Roath', x: 550, y: 370, type: 'without' },
      { name: 'Penylan', x: 600, y: 340, type: 'without' },
      { name: 'Plasnewydd', x: 520, y: 330, type: 'without' },
      { name: 'Gabalfa', x: 400, y: 300, type: 'without' },
      { name: 'Heath', x: 500, y: 260, type: 'without' },
      { name: 'Llanishen', x: 550, y: 220, type: 'without' },
      { name: 'Rhiwbina', x: 450, y: 200, type: 'without' },
      { name: 'Whitchurch', x: 400, y: 160, type: 'without' },
      { name: 'Cyncoed', x: 600, y: 280, type: 'without' },
    ]

    const allWards = [...withCouncils, ...withoutCouncils]

    // LA headquarters (center - where all knowledge flows)
    const laNode = { x: width/2, y: height/2 }
    const laCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    laCircle.setAttribute('cx', laNode.x.toString())
    laCircle.setAttribute('cy', laNode.y.toString())
    laCircle.setAttribute('r', '60')
    laCircle.setAttribute('fill', theme === 'light' ? '#1a1a1a' : '#0a0a0a')
    laCircle.setAttribute('stroke', theme === 'light' ? '#666' : '#999')
    laCircle.setAttribute('stroke-width', '3')
    svg.appendChild(laCircle)

    const laText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    laText.setAttribute('x', laNode.x.toString())
    laText.setAttribute('y', (laNode.y + 5).toString())
    laText.setAttribute('text-anchor', 'middle')
    laText.setAttribute('fill', theme === 'light' ? '#ffffff' : '#e0e0e0')
    laText.setAttribute('font-size', '14')
    laText.setAttribute('font-family', 'Space Mono, monospace')
    laText.setAttribute('font-weight', '700')
    laText.textContent = 'Cardiff LA'
    svg.appendChild(laText)

    // Draw wards and knowledge extraction arrows
    allWards.forEach((ward, i) => {
      const hasCouncil = ward.type === 'with'
      
      // Ward area representation
      const wardCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      wardCircle.setAttribute('cx', ward.x.toString())
      wardCircle.setAttribute('cy', ward.y.toString())
      wardCircle.setAttribute('r', '35')
      wardCircle.setAttribute('fill', 'none')
      wardCircle.setAttribute('stroke', hasCouncil ? '#00cc88' : '#ff4444')
      wardCircle.setAttribute('stroke-width', hasCouncil ? '2' : '2')
      wardCircle.setAttribute('stroke-dasharray', hasCouncil ? '0' : '5,3')
      wardCircle.setAttribute('opacity', hasCouncil ? '0.6' : '0.4')
      svg.appendChild(wardCircle)

      // Ward label
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      label.setAttribute('x', ward.x.toString())
      label.setAttribute('y', (ward.y + 4).toString())
      label.setAttribute('text-anchor', 'middle')
      label.setAttribute('fill', theme === 'light' ? '#666' : '#999')
      label.setAttribute('font-size', '9')
      label.setAttribute('font-family', 'Space Mono, monospace')
      label.textContent = ward.name
      svg.appendChild(label)

      // Knowledge extraction arrow to LA
      const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      arrow.setAttribute('x1', ward.x.toString())
      arrow.setAttribute('y1', ward.y.toString())
      arrow.setAttribute('x2', laNode.x.toString())
      arrow.setAttribute('y2', laNode.y.toString())
      arrow.setAttribute('stroke', hasCouncil ? '#00cc88' : '#ff4444')
      arrow.setAttribute('stroke-width', '1')
      arrow.setAttribute('opacity', hasCouncil ? '0.3' : '0.2')
      arrow.setAttribute('stroke-dasharray', hasCouncil ? '3,2' : '2,3')
      arrow.setAttribute('marker-end', 'url(#arrowhead-map)')
      svg.appendChild(arrow)

      // Animated knowledge particles
      if (i % 3 === 0) {
        const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        particle.setAttribute('r', '2')
        particle.setAttribute('fill', hasCouncil ? '#00cc88' : '#ff4444')
        particle.setAttribute('opacity', '0.6')
        
        const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion')
        animate.setAttribute('dur', '4s')
        animate.setAttribute('repeatCount', 'indefinite')
        animate.setAttribute('begin', `${i * 0.3}s`)
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'mpath')
        const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        pathEl.setAttribute('d', `M ${ward.x},${ward.y} L ${laNode.x},${laNode.y}`)
        pathEl.setAttribute('id', `extraction-ward-${i}`)
        svg.appendChild(pathEl)
        path.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#extraction-ward-${i}`)
        
        animate.appendChild(path)
        particle.appendChild(animate)
        svg.appendChild(particle)
      }
    })

    // Arrow marker
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker')
    marker.setAttribute('id', 'arrowhead-map')
    marker.setAttribute('markerWidth', '8')
    marker.setAttribute('markerHeight', '8')
    marker.setAttribute('refX', '4')
    marker.setAttribute('refY', '2.5')
    marker.setAttribute('orient', 'auto')
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
    polygon.setAttribute('points', '0 0, 8 2.5, 0 5')
    polygon.setAttribute('fill', theme === 'light' ? '#666' : '#999')
    polygon.setAttribute('opacity', '0.5')
    marker.appendChild(polygon)
    defs.appendChild(marker)
    svg.insertBefore(defs, svg.firstChild)

    // Legend
    const legendY = 70
    
    // With council legend
    const withLegendCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    withLegendCircle.setAttribute('cx', '700')
    withLegendCircle.setAttribute('cy', legendY.toString())
    withLegendCircle.setAttribute('r', '12')
    withLegendCircle.setAttribute('fill', 'none')
    withLegendCircle.setAttribute('stroke', '#00cc88')
    withLegendCircle.setAttribute('stroke-width', '2')
    svg.appendChild(withLegendCircle)

    const withLegendText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    withLegendText.setAttribute('x', '720')
    withLegendText.setAttribute('y', (legendY + 4).toString())
    withLegendText.setAttribute('fill', theme === 'light' ? '#666' : '#999')
    withLegendText.setAttribute('font-size', '10')
    withLegendText.setAttribute('font-family', 'Space Mono, monospace')
    withLegendText.textContent = 'Community council (formal, tokenistic)'
    svg.appendChild(withLegendText)

    // Without council legend
    const withoutLegendCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    withoutLegendCircle.setAttribute('cx', '700')
    withoutLegendCircle.setAttribute('cy', (legendY + 30).toString())
    withoutLegendCircle.setAttribute('r', '12')
    withoutLegendCircle.setAttribute('fill', 'none')
    withoutLegendCircle.setAttribute('stroke', '#ff4444')
    withoutLegendCircle.setAttribute('stroke-width', '2')
    withoutLegendCircle.setAttribute('stroke-dasharray', '5,3')
    svg.appendChild(withoutLegendCircle)

    const withoutLegendText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    withoutLegendText.setAttribute('x', '720')
    withoutLegendText.setAttribute('y', (legendY + 34).toString())
    withoutLegendText.setAttribute('fill', theme === 'light' ? '#666' : '#999')
    withoutLegendText.setAttribute('font-size', '10')
    withoutLegendText.setAttribute('font-family', 'Space Mono, monospace')
    withoutLegendText.textContent = 'No formal structure (excluded)'
    svg.appendChild(withoutLegendText)

    // Title annotation
    const titleText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    titleText.setAttribute('x', '70')
    titleText.setAttribute('y', '35')
    titleText.setAttribute('fill', theme === 'light' ? '#666' : '#999')
    titleText.setAttribute('font-size', '11')
    titleText.setAttribute('font-family', 'Space Mono, monospace')
    titleText.setAttribute('font-weight', '700')
    titleText.setAttribute('letter-spacing', '1')
    titleText.textContent = 'CARDIFF: KNOWLEDGE EXTRACTION FROM ALL AREAS → DECISION POWER ONLY WITH LA'
    svg.appendChild(titleText)

  }, [mounted, theme])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }
  
  const content = {
    en: {
      mission: 'Researching Web3-enabled inclusive governance systems for sovereign neighbourhood data - shaping the built environment and place from street to national level',
      researchFocus: 'Research focus',
      currentProject: 'Current project',
      relatedInitiatives: 'Related initiatives',
      contact: 'Contact',
      contactAvailability: 'Available for meetings in Cardiff/Online',
      
      vizTitle: 'Structural exclusion in Cardiff',
      vizDesc: 'Only 6 wards (North/Northwest, affluent) have community councils. 22 wards (South/Central, poverty) have no formal structure. Both groups have zero decision power - knowledge flows to LA, no control returns.',
      vizLabels: [
        'Green = Formal channel exists (but tokenistic - can propose, cannot decide)',
        'Red = No formal channel (sporadic ad-hoc consultation only)',
        'All arrows point to LA = Knowledge extracted, zero community control',
        'Financial barrier: £50k+ to establish council = democracy paywall'
      ],
      
      card1Title: 'Data sovereignty',
      card1Short: 'Whose knowledge counts? Who owns and can manipulate data and knowledge? Addressing epistemic injustice in urban governance systems.',
      card1Full: 'Whose knowledge counts? Who owns and can manipulate data and knowledge? Our work examines epistemic justice in urban governance—challenging who gets to define what counts as legitimate knowledge in planning and design decisions. We investigate how blockchain and Web3 technologies can redistribute power over data ownership, ensuring communities maintain sovereignty over the knowledge they generate about their own places. This extends beyond technical solutions to question fundamental power structures in how urban data is collected, validated, and used to shape the built environment.',
      
      card2Title: 'Inclusive design',
      card2Short: 'Applying design justice principles to build systems that challenge rather than reproduce existing power structures. Centring disabled people and communities in creating accountable technologies.',
      card2Full: 'Applying design justice principles to build systems that challenge rather than reproduce existing power structures. We centre disabled people and marginalised communities throughout our research and design process—not as consultation afterthoughts, but as co-designers and leaders. Our approach recognises that technology often replicates existing barriers and hierarchies. By foregrounding accessibility, we create governance tools that redistribute rather than concentrate power, ensuring new digital systems enable rather than exclude participation in shaping places.',
      
      card3Title: 'Digital governance',
      card3Short: 'Web3 and blockchain systems for community-led planning and transparent, accountable decision-making processes.',
      card3Full: 'Web3 and blockchain systems for community-led planning and transparent, accountable decision-making processes. We explore how decentralised technologies can enable genuine community control over planning and design decisions—moving beyond extractive consultation toward meaningful devolved power. Our research investigates smart contracts for transparent decision-making, DAOs for community governance, and blockchain for creating auditable, community-owned records of planning processes that shape the built environment. The goal is accountability: tools that make power visible and challengeable.',
      
      clickToExpand: '[+] expand',
      clickToCollapse: '[-] collapse',
      
      projectTitle: 'Place-based Data Sovereignty',
      projectDesc: 'Co-designing place-based data systems with communities in Cardiff, Wales. Testing how blockchain can support transparency, accountability and real devolved power to communities in shaping the built environment and planning processes.',
      
      project2Title: 'National Data Infrastructure',
      project2Text: 'Exploring how place-based data scales from street to neighbourhood, city, and national levels. Building frameworks for community data to shape the built environment—from street designs to national infrastructure—while maintaining community sovereignty.',
      
      project3Title: 'Place-based Digital Identity',
      project3Text: 'Investigating place and location as identity mechanisms for engaging with governance processes. Avoiding surveillance systems and traditional digital IDs while enabling meaningful participation in shaping places.',
      
      viewProject: '[→] view project',
      ongoing: 'Ongoing',
      funding: 'Open to partnerships and funding',
      footer: 'Web3 :: Governance :: Inclusion'
    },
    cy: {
      mission: 'Ymchwilio i systemau llywodraethiant cynhwysol Web3-alluog ar gyfer data cymdogaeth sofran - llunio\'r amgylchedd adeiledig a lle o lefel stryd i lefel genedlaethol',
      researchFocus: 'Ffocws ymchwil',
      currentProject: 'Prosiect cyfredol',
      relatedInitiatives: 'Mentrau cysylltiedig',
      contact: 'Cysylltu',
      contactAvailability: 'Ar gael ar gyfer cyfarfodydd yng Nghaerdydd/Ar-lein',
      
      vizTitle: 'Gwaharddiad strwythurol yng Nghaerdydd',
      vizDesc: 'Dim ond 6 ward (Gogledd/Gogledd-orllewin, cefnog) sydd â chynghorau cymuned. Mae gan 22 ward (De/Canol, tlodi) ddim strwythur ffurfiol. Mae gan y ddau grŵp sero pŵer penderfynu - mae gwybodaeth yn llifo i\'r LA, dim rheolaeth yn dychwelyd.',
      vizLabels: [
        'Gwyrdd = Sianel ffurfiol yn bodoli (ond tocenistig - gall gynnig, ni all benderfynu)',
        'Coch = Dim sianel ffurfiol (ymgynghoriad achlysurol yn unig)',
        'Mae pob saeth yn pwyntio at LA = Gwybodaeth wedi\'i echdynnu, dim rheolaeth gymunedol',
        'Rhwystr ariannol: £50k+ i sefydlu cyngor = wal dalu democratiaeth'
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
        
        .glitch-bar {
          position: fixed;
          height: 2px;
          background: ${theme === 'light' ? '#666' : '#999'};
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
          right: 120px;
          font-size: 9px;
          color: ${theme === 'light' ? '#666' : '#999'};
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

        {/* Geographic Visualization */}
        <section className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto 80px' }}>
          <h2 className="section-label">{t.vizTitle}</h2>
          
          <div style={{ 
            background: theme === 'light' ? '#ffffff' : '#1a1a1a', 
            border: `2px solid ${theme === 'light' ? '#666' : '#999'}`,
            padding: '20px',
            transition: 'background 0.3s ease, border 0.3s ease',
            marginBottom: '20px'
          }}>
            <div ref={mapSvgRef} style={{ width: '100%', height: '600px' }} />
          </div>
          
          <div style={{ 
            background: theme === 'light' ? '#ffffff' : '#1a1a1a', 
            border: `2px solid ${theme === 'light' ? '#666' : '#999'}`,
            padding: '24px',
            transition: 'background 0.3s ease, border 0.3s ease'
          }}>
            <p style={{ fontSize: '14px', lineHeight: 1.7, marginBottom: '16px' }}>
              {t.vizDesc}
            </p>
            <ul style={{ listStyle: 'none', fontSize: '11px', lineHeight: 1.9, color: theme === 'light' ? '#666' : '#999' }}>
              {t.vizLabels.map((label: string, i: number) => (
                <li key={i}>[·] {label}</li>
              ))}
            </ul>
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
              >
                <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', letterSpacing: '0.5px' }}>
                  {t[`card${cardNum}Title`]}
                </h3>
                <p style={{ fontSize: '14px', lineHeight: 1.7 }}>
                  {expandedCard === cardNum ? t[`card${cardNum}Full`] : t[`card${cardNum}Short`]}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>© 2025 Leol Lab</div>
            <div>{t.footer}</div>
          </div>
        </footer>
      </main>
    </>
  )
}