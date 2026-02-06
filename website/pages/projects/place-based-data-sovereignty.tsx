import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function PlaceBasedDataSovereignty() {
  const [lang, setLang] = useState('en')
  const [theme, setTheme] = useState('light')
  const [activeLayer, setActiveLayer] = useState('ownership')
  const [mounted, setMounted] = useState(false)
  const vizSvgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
  }, [])

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return

    const vizSvg = vizSvgRef.current
    if (!vizSvg) return

    const width = 1000
    const height = 600
    const centerX = width / 2
    const centerY = height / 2
    const radius = 220
    
    // Clear existing
    while (vizSvg.firstChild) {
      vizSvg.removeChild(vizSvg.firstChild)
    }

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', '100%')
    svg.setAttribute('height', '100%')
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    vizSvg.appendChild(svg)

    // Grid background
    const grid = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    grid.setAttribute('opacity', '0.3')
    for (let x = 0; x < width; x += 40) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.setAttribute('x1', x.toString())
      line.setAttribute('y1', '0')
      line.setAttribute('x2', x.toString())
      line.setAttribute('y2', height.toString())
      line.setAttribute('stroke', theme === 'light' ? 'rgba(102,102,102,0.1)' : 'rgba(153,153,153,0.1)')
      line.setAttribute('stroke-width', '1')
      grid.appendChild(line)
    }
    for (let y = 0; y < height; y += 40) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.setAttribute('x1', '0')
      line.setAttribute('y1', y.toString())
      line.setAttribute('x2', width.toString())
      line.setAttribute('y2', y.toString())
      line.setAttribute('stroke', theme === 'light' ? 'rgba(102,102,102,0.1)' : 'rgba(153,153,153,0.1)')
      line.setAttribute('stroke-width', '1')
      grid.appendChild(line)
    }
    svg.appendChild(grid)

    // Define segments for current vs proposed
    interface Segment {
      label: string
      startAngle: number
      endAngle: number
      color: string
      power: number
    }

    const currentSegments: Segment[] = [
      { label: 'LA', startAngle: -45, endAngle: 135, color: '#ff4444', power: 10 },
      { label: 'Landowners', startAngle: 135, endAngle: 225, color: '#ff6666', power: 8 },
      { label: 'Comm 1', startAngle: 225, endAngle: 255, color: '#666', power: 1 },
      { label: 'Comm 2', startAngle: 255, endAngle: 285, color: '#666', power: 1 },
      { label: 'Comm 3', startAngle: 285, endAngle: 315, color: '#666', power: 1 },
      { label: 'Consult', startAngle: 315, endAngle: 345, color: '#999', power: 2 },
    ]

    const proposedSegments: Segment[] = [
      { label: 'Community', startAngle: -30, endAngle: 90, color: '#00cc88', power: 10 },
      { label: 'Architects', startAngle: 90, endAngle: 150, color: '#00aa77', power: 5 },
      { label: 'Developers', startAngle: 150, endAngle: 210, color: '#00aa77', power: 5 },
      { label: 'Local Auth', startAngle: 210, endAngle: 270, color: '#00aa77', power: 5 },
      { label: 'Government', startAngle: 270, endAngle: 330, color: '#00aa77', power: 5 },
    ]

    const segments = currentSegments
    const isCurrent = true

    // Draw circular segments
    segments.forEach(segment => {
      const startRad = (segment.startAngle * Math.PI) / 180
      const endRad = (segment.endAngle * Math.PI) / 180
      const innerRadius = radius - (segment.power * 8)
      
      // Create arc path
      const x1 = centerX + radius * Math.cos(startRad)
      const y1 = centerY + radius * Math.sin(startRad)
      const x2 = centerX + radius * Math.cos(endRad)
      const y2 = centerY + radius * Math.sin(endRad)
      const x3 = centerX + innerRadius * Math.cos(endRad)
      const y3 = centerY + innerRadius * Math.sin(endRad)
      const x4 = centerX + innerRadius * Math.cos(startRad)
      const y4 = centerY + innerRadius * Math.sin(startRad)

      const largeArc = endRad - startRad > Math.PI ? 1 : 0

      const pathData = `
        M ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
        L ${x3} ${y3}
        A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}
        Z
      `

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('d', pathData)
      path.setAttribute('fill', segment.color)
      path.setAttribute('stroke', theme === 'light' ? '#666' : '#999')
      path.setAttribute('stroke-width', '2')
      path.setAttribute('opacity', '0.7')
      svg.appendChild(path)

      // Label
      const midAngle = (startRad + endRad) / 2
      const labelRadius = radius + 30
      const labelX = centerX + labelRadius * Math.cos(midAngle)
      const labelY = centerY + labelRadius * Math.sin(midAngle)

      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      label.setAttribute('x', labelX.toString())
      label.setAttribute('y', labelY.toString())
      label.setAttribute('text-anchor', 'middle')
      label.setAttribute('fill', theme === 'light' ? '#666' : '#999')
      label.setAttribute('font-size', '11')
      label.setAttribute('font-family', 'Space Mono, monospace')
      label.setAttribute('font-weight', '700')
      label.textContent = segment.label
      svg.appendChild(label)
    })

    // Draw ribbons based on active layer
    const drawRibbon = (from: number, to: number, color: string, opacity: number, bidirectional: boolean = false) => {
      const fromAngle = ((currentSegments[from].startAngle + currentSegments[from].endAngle) / 2 * Math.PI) / 180
      const toAngle = ((currentSegments[to].startAngle + currentSegments[to].endAngle) / 2 * Math.PI) / 180
      
      const fromX = centerX + (radius - 60) * Math.cos(fromAngle)
      const fromY = centerY + (radius - 60) * Math.sin(fromAngle)
      const toX = centerX + (radius - 60) * Math.cos(toAngle)
      const toY = centerY + (radius - 60) * Math.sin(toAngle)

      // Control points for curved ribbon
      const ctrlX1 = centerX + 80 * Math.cos(fromAngle)
      const ctrlY1 = centerY + 80 * Math.sin(fromAngle)
      const ctrlX2 = centerX + 80 * Math.cos(toAngle)
      const ctrlY2 = centerY + 80 * Math.sin(toAngle)

      const ribbonPath = `M ${fromX} ${fromY} Q ${ctrlX1} ${ctrlY1}, ${centerX} ${centerY} Q ${ctrlX2} ${ctrlY2}, ${toX} ${toY}`

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('d', ribbonPath)
      path.setAttribute('fill', 'none')
      path.setAttribute('stroke', color)
      path.setAttribute('stroke-width', '3')
      path.setAttribute('opacity', opacity.toString())
      svg.appendChild(path)

      // Arrow marker
      if (!bidirectional) {
        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        marker.setAttribute('cx', toX.toString())
        marker.setAttribute('cy', toY.toString())
        marker.setAttribute('r', '4')
        marker.setAttribute('fill', color)
        marker.setAttribute('opacity', opacity.toString())
        svg.appendChild(marker)
      }
    }

    // Layer-specific ribbons
    if (activeLayer === 'ownership') {
      // Communities -> LA (extraction)
      drawRibbon(2, 0, '#ff4444', 0.6, false)
      drawRibbon(3, 0, '#ff4444', 0.6, false)
      drawRibbon(4, 0, '#ff4444', 0.6, false)
    } else if (activeLayer === 'knowledge') {
      // Communities -> Consultation -> LA (filtered)
      drawRibbon(2, 5, '#ff6666', 0.5, false)
      drawRibbon(3, 5, '#ff6666', 0.5, false)
      drawRibbon(4, 5, '#ff6666', 0.5, false)
      drawRibbon(5, 0, '#ff4444', 0.7, false)
    } else if (activeLayer === 'contracts') {
      // LA -> Landowners (opaque deals)
      drawRibbon(0, 1, '#ff4444', 0.6, false)
    } else if (activeLayer === 'risk') {
      // Multiple manipulation vectors
      drawRibbon(0, 1, '#ff4444', 0.4, false)
      drawRibbon(0, 5, '#ff4444', 0.4, false)
      drawRibbon(1, 0, '#ff6666', 0.3, false)
    }

    // Center annotation
    const centerText = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    centerText.setAttribute('x', centerX.toString())
    centerText.setAttribute('y', (centerY - 20).toString())
    centerText.setAttribute('text-anchor', 'middle')
    centerText.setAttribute('fill', theme === 'light' ? '#666' : '#999')
    centerText.setAttribute('font-size', '10')
    centerText.setAttribute('font-family', 'Space Mono, monospace')
    centerText.textContent = 'Current System'
    svg.appendChild(centerText)

    const centerDesc = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    centerDesc.setAttribute('x', centerX.toString())
    centerDesc.setAttribute('y', centerY.toString())
    centerDesc.setAttribute('text-anchor', 'middle')
    centerDesc.setAttribute('fill', theme === 'light' ? '#999' : '#666')
    centerDesc.setAttribute('font-size', '9')
    centerDesc.setAttribute('font-family', 'Space Mono, monospace')
    centerDesc.textContent = 'Extraction / Concentration'
    svg.appendChild(centerDesc)

  }, [mounted, theme, activeLayer])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }
  
  const content = {
    en: {
      backHome: '[←] back to home',
      projectTitle: 'Place-based Data Sovereignty',
      tagline: 'Co-designing community-owned data systems in Cardiff',
      
      vizTitle: 'Relational power analysis',
      vizDesc: 'Circular network showing power distribution and knowledge flows. Toggle layers to see different dimensions of control.',
      vizLayers: 'Analysis layers',
      layerOwnership: 'Ownership',
      layerRecording: 'Recording',
      layerContracts: 'Contracts',
      layerLedger: 'Ledger',
      layerKnowledge: 'Knowledge flow',
      layerRisk: 'Manipulation risk',
      
      overview: 'Overview',
      overviewText: 'This PhD research project explores how blockchain and Web3 technologies can enable genuine data sovereignty for communities in urban planning. Working with communities in Cardiff, Wales, we are co-designing place-based data systems that give residents real control over information about their neighbourhoods—challenging who gets to define, own, and use urban data to shape the built environment.',
      
      context: 'Research context',
      contextText: 'Current planning systems extract data from communities without returning power or control. Residents provide knowledge about their places, but have little say in how that information is used, interpreted, or acted upon to shape the built environment. Even formal community councils are tokenistic—they can propose but cannot decide. This project investigates whether decentralised technologies can shift these power dynamics, enabling transparency, accountability, and genuine devolved power.',
      
      problem: 'The extraction problem',
      problemText: 'Communities generate knowledge about place—how spaces are used, what matters culturally, what needs exist. This knowledge flows to local authorities and landowners who use it to shape the built environment. But communities retain no ownership, no control over validation, and no power over decisions. The system is extractive: knowledge flows out, decisions flow back, community sovereignty is zero.',
      
      objectives: 'Key objectives',
      obj1: 'Co-design blockchain-based data systems with Cardiff communities',
      obj2: 'Test how decentralised technologies support transparent decision-making',
      obj3: 'Investigate mechanisms for community data to influence planning and design of the built environment',
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
      method3: 'Design Justice – Centring marginalised voices in system development',
      method4: 'Epistemic Justice – Questioning whose knowledge counts in planning',
      
      partners: 'Community partners',
      partnersText: 'We are building relationships with community groups, disabled people\'s organisations, and residents in Cardiff. If you are interested in participating or partnering with this research, please get in touch.',
      
      outputs: 'Expected outputs',
      output1: 'Working blockchain prototype for community data governance',
      output2: 'Policy recommendations for Welsh planning authorities',
      output3: 'Academic publications on data sovereignty and urban planning',
      output4: 'Community-owned frameworks for scaling local data systems',
      
      funding: 'Funding and partnerships',
      fundingText: 'This project is open to partnerships and funding opportunities. We welcome collaboration with community organisations, local authorities, funding bodies, and research institutions.',
      
      status: 'Status',
      statusText: 'Active (2025-2028)',
    },
    cy: {
      backHome: '[←] nôl i\'r hafan',
      projectTitle: 'Sofraniaeth Data Lle-seiliedig',
      tagline: 'Cyd-gynllunio systemau data sy\'n eiddo i\'r gymuned yng Nghaerdydd',
      
      vizTitle: 'Dadansoddiad pŵer perthynol',
      vizDesc: 'Rhwydwaith crwn yn dangos dosbarthiad pŵer a llifau gwybodaeth. Toglo haenau i weld dimensiynau gwahanol o reolaeth.',
      vizLayers: 'Haenau dadansoddi',
      layerOwnership: 'Perchnogaeth',
      layerRecording: 'Cofnodi',
      layerContracts: 'Contractau',
      layerLedger: 'Cyfriflyfr',
      layerKnowledge: 'Llif gwybodaeth',
      layerRisk: 'Risg trin data',
      
      overview: 'Trosolwg',
      overviewText: 'Mae\'r prosiect ymchwil PhD hwn yn archwilio sut gall technolegau blockchain a Gwe3 alluogi sofraniaeth data wirioneddol ar gyfer cymunedau mewn cynllunio trefol. Gan weithio gyda chymunedau yng Nghaerdydd, Cymru, rydym yn cyd-gynllunio systemau data lle-seiliedig sy\'n rhoi rheolaeth real i drigolion dros wybodaeth am eu cymdogaethau—herio pwy sy\'n cael diffinio, perchnogi a defnyddio data trefol i lunio\'r amgylchedd adeiledig.',
      
      context: 'Cyd-destun ymchwil',
      contextText: 'Mae systemau cynllunio cyfredol yn echdynnu data o gymunedau heb ddychwelyd pŵer na rheolaeth. Mae trigolion yn darparu gwybodaeth am eu lleoedd, ond mae ganddynt ychydig o lais yn sut mae\'r wybodaeth honno\'n cael ei defnyddio, ei dehongli, neu ei gweithredu arni i lunio\'r amgylchedd adeiledig. Mae hyd yn oed cynghorau cymuned ffurfiol yn docenistig—gallant gynnig ond ni allant benderfynu. Mae\'r prosiect hwn yn ymchwilio a all technolegau datganoledig newid y dynameg pŵer hyn, gan alluogi tryloywder, atebolrwydd, a gwir bŵer datganoledig.',
      
      problem: 'Problem echdynnu',
      problemText: 'Mae cymunedau yn cynhyrchu gwybodaeth am le—sut mae gofodau\'n cael eu defnyddio, beth sy\'n bwysig yn ddiwylliannol, pa anghenion sy\'n bodoli. Mae\'r wybodaeth hon yn llifo i awdurdodau lleol a pherchnogion tir sy\'n ei defnyddio i lunio\'r amgylchedd adeiledig. Ond nid yw cymunedau\'n cadw unrhyw berchnogaeth, dim rheolaeth dros ddilysu, a dim pŵer dros benderfyniadau. Mae\'r system yn echdynnol: mae gwybodaeth yn llifo allan, mae penderfyniadau\'n llifo\'n ôl, sofraniaeth gymunedol yw sero.',
      
      objectives: 'Amcanion allweddol',
      obj1: 'Cyd-gynllunio systemau data seiliedig ar blockchain gyda chymunedau Caerdydd',
      obj2: 'Profi sut mae technolegau datganoledig yn cefnogi gwneud penderfyniadau tryloyw',
      obj3: 'Ymchwilio i fecanweithiau ar gyfer data cymunedol i ddylanwadu ar gynllunio a dylunio\'r amgylchedd adeiledig',
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

        .layer-btn {
          background: ${theme === 'light' ? '#ffffff' : '#1a1a1a'};
          border: 1px solid ${theme === 'light' ? '#666' : '#999'};
          color: ${theme === 'light' ? '#666' : '#999'};
          padding: 8px 12px;
          font-size: 10px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Space Mono', monospace;
          font-weight: 700;
          letter-spacing: 1px;
          margin-right: 8px;
          margin-bottom: 8px;
        }

        .layer-btn:hover {
          border-color: ${theme === 'light' ? '#444' : '#bbb'};
        }

        .layer-btn.active {
          background: ${theme === 'light' ? '#1a1a1a' : '#e0e0e0'};
          color: ${theme === 'light' ? '#ffffff' : '#0a0a0a'};
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
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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

          {/* Interactive Circos Visualization */}
          <section className="fade-in" style={{ marginBottom: '60px' }}>
            <h2 className="section-label">{t.vizTitle}</h2>
            
            <div style={{ 
              background: theme === 'light' ? '#ffffff' : '#1a1a1a', 
              border: `2px solid ${theme === 'light' ? '#666' : '#999'}`, 
              padding: '24px',
              transition: 'background 0.3s ease, border 0.3s ease',
              marginBottom: '20px'
            }}>
              <div style={{ marginBottom: '20px' }}>
                <div className="section-label" style={{ fontSize: '10px', marginBottom: '12px' }}>{t.vizLayers}</div>
                <div>
                  {['ownership', 'knowledge', 'contracts', 'recording', 'ledger', 'risk'].map(layer => (
                    <button
                      key={layer}
                      className={`layer-btn ${activeLayer === layer ? 'active' : ''}`}
                      onClick={() => setActiveLayer(layer)}
                    >
                      {t[`layer${layer.charAt(0).toUpperCase() + layer.slice(1)}`]}
                    </button>
                  ))}
                </div>
              </div>

              <div ref={vizSvgRef} style={{ width: '100%', height: '600px' }} />
              
              <p style={{ fontSize: '12px', color: theme === 'light' ? '#666' : '#999', marginTop: '20px', lineHeight: 1.7 }}>
                {t.vizDesc}
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

          {/* Context & Problem */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
            <section className="fade-in">
              <h2 className="section-label">{t.context}</h2>
              <div style={{ 
                background: theme === 'light' ? '#ffffff' : '#1a1a1a', 
                border: `2px solid ${theme === 'light' ? '#666' : '#999'}`, 
                padding: '28px',
                transition: 'background 0.3s ease, border 0.3s ease'
              }}>
                <p style={{ fontSize: '14px', lineHeight: 1.7 }}>
                  {t.contextText}
                </p>
              </div>
            </section>

            <section className="fade-in">
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
          </div>

          {/* Objectives */}
          <section className="fade-in" style={{ marginBottom: '40px' }}>
            <h2 className="section-label">{t.objectives}</h2>
            <div style={{ 
              background: theme === 'light' ? '#ffffff' : '#1a1a1a', 
              border: `2px solid ${theme === 'light' ? '#666' : '#999'}`, 
              padding: '28px',
              transition: 'background 0.3s ease, border 0.3s ease'
            }}>
              <ul style={{ listStyle: 'none', fontSize: '14px', lineHeight: 2 }}>
                <li>[→] {t.obj1}</li>
                <li>[→] {t.obj2}</li>
                <li>[→] {t.obj3}</li>
                <li>[→] {t.obj4}</li>
                <li>[→] {t.obj5}</li>
              </ul>
            </div>
          </section>

          {/* Timeline & Methods */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
            <section className="fade-in">
              <h2 className="section-label">{t.timeline}</h2>
              <div style={{ 
                background: theme === 'light' ? '#ffffff' : '#1a1a1a', 
                border: `2px solid ${theme === 'light' ? '#666' : '#999'}`, 
                padding: '24px',
                transition: 'background 0.3s ease, border 0.3s ease'
              }}>
                <ul style={{ listStyle: 'none', fontSize: '13px', lineHeight: 1.9 }}>
                  <li style={{ marginBottom: '8px' }}>[→] {t.timeline1}</li>
                  <li style={{ marginBottom: '8px' }}>[→] {t.timeline2}</li>
                  <li style={{ marginBottom: '8px' }}>[→] {t.timeline3}</li>
                  <li>[→] {t.timeline4}</li>
                </ul>
              </div>
            </section>

            <section className="fade-in">
              <h2 className="section-label">{t.methods}</h2>
              <div style={{ 
                background: theme === 'light' ? '#ffffff' : '#1a1a1a', 
                border: `2px solid ${theme === 'light' ? '#666' : '#999'}`, 
                padding: '24px',
                transition: 'background 0.3s ease, border 0.3s ease'
              }}>
                <ul style={{ listStyle: 'none', fontSize: '13px', lineHeight: 1.9 }}>
                  <li style={{ marginBottom: '8px' }}>[→] {t.method1}</li>
                  <li style={{ marginBottom: '8px' }}>[→] {t.method2}</li>
                  <li style={{ marginBottom: '8px' }}>[→] {t.method3}</li>
                  <li>[→] {t.method4}</li>
                </ul>
              </div>
            </section>
          </div>

          {/* Partners */}
          <section className="fade-in" style={{ marginBottom: '40px' }}>
            <h2 className="section-label">{t.partners}</h2>
            <div style={{ 
              background: theme === 'light' ? '#ffffff' : '#1a1a1a', 
              border: `2px solid ${theme === 'light' ? '#666' : '#999'}`, 
              padding: '28px',
              transition: 'background 0.3s ease, border 0.3s ease'
            }}>
              <p style={{ fontSize: '14px', lineHeight: 1.7 }}>
                {t.partnersText}
              </p>
            </div>
          </section>

          {/* Expected Outputs */}
          <section className="fade-in" style={{ marginBottom: '40px' }}>
            <h2 className="section-label">{t.outputs}</h2>
            <div style={{ 
              background: theme === 'light' ? '#ffffff' : '#1a1a1a', 
              border: `2px solid ${theme === 'light' ? '#666' : '#999'}`, 
              padding: '28px',
              transition: 'background 0.3s ease, border 0.3s ease'
            }}>
              <ul style={{ listStyle: 'none', fontSize: '14px', lineHeight: 2 }}>
                <li>[→] {t.output1}</li>
                <li>[→] {t.output2}</li>
                <li>[→] {t.output3}</li>
                <li>[→] {t.output4}</li>
              </ul>
            </div>
          </section>

          {/* Funding & Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '40px' }}>
            <section className="fade-in">
              <h2 className="section-label">{t.funding}</h2>
              <div style={{ 
                background: theme === 'light' ? '#ffffff' : '#1a1a1a', 
                border: `2px solid ${theme === 'light' ? '#666' : '#999'}`, 
                padding: '24px',
                transition: 'background 0.3s ease, border 0.3s ease'
              }}>
                <p style={{ fontSize: '14px', lineHeight: 1.7 }}>
                  {t.fundingText}
                </p>
              </div>
            </section>

            <section className="fade-in">
              <h2 className="section-label">{t.status}</h2>
              <div style={{ 
                background: theme === 'light' ? '#ffffff' : '#1a1a1a', 
                border: `2px solid ${theme === 'light' ? '#666' : '#999'}`, 
                padding: '24px',
                transition: 'background 0.3s ease, border 0.3s ease'
              }}>
                <p style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.5px' }}>
                  {t.statusText}
                </p>
              </div>
            </section>
          </div>

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