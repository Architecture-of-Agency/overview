import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'

type WindowId = 'about' | 'why-web3' | 'governance' | 'privacy' | 'contact' | 'phd-development' | 'literature' | 'splott'

interface WindowState {
  id: WindowId
  zIndex: number
  position: { x: number; y: number }
  isOpen: boolean
}

interface IconPosition {
  x: number
  y: number
}

const GRID_SIZE = 32

function snapToGrid(value: number): number {
  return Math.round(value / GRID_SIZE) * GRID_SIZE
}

export default function Home() {
  const [hasEntered, setHasEntered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [bootMessages, setBootMessages] = useState<string[]>([])
  const [lang, setLang] = useState('en')
  const [theme, setTheme] = useState('light')
  const [mounted, setMounted] = useState(false)
  const [cursorTrailEnabled, setCursorTrailEnabled] = useState(true)
  const [trailDots, setTrailDots] = useState<Array<{ x: number; y: number; id: number }>>([])
  const [selectedIcon, setSelectedIcon] = useState<WindowId | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [iconSize, setIconSize] = useState<'small' | 'medium' | 'large'>('medium')
  const [startMenuOpen, setStartMenuOpen] = useState(false)
  const [clock, setClock] = useState('')
  const [cursorStyle, setCursorStyle] = useState<'default' | 'pointer' | 'grab' | 'grabbing'>('default')
  const [lastClickTime, setLastClickTime] = useState(0)
  const [minimisedWindows, setMinimisedWindows] = useState<WindowId[]>([])

  const [windows, setWindows] = useState<Record<WindowId, WindowState>>({
    'about':          { id: 'about',          zIndex: 10, position: { x: 80,  y: 60  }, isOpen: false },
    'why-web3':       { id: 'why-web3',       zIndex: 10, position: { x: 110, y: 80  }, isOpen: false },
    'governance':     { id: 'governance',     zIndex: 10, position: { x: 140, y: 100 }, isOpen: false },
    'privacy':        { id: 'privacy',        zIndex: 10, position: { x: 170, y: 120 }, isOpen: false },
    'contact':        { id: 'contact',        zIndex: 10, position: { x: 200, y: 140 }, isOpen: false },
    'phd-development':{ id: 'phd-development',zIndex: 10, position: { x: 120, y: 70  }, isOpen: false },
    'literature':     { id: 'literature',     zIndex: 10, position: { x: 150, y: 90  }, isOpen: false },
    'splott':         { id: 'splott',         zIndex: 10, position: { x: 180, y: 110 }, isOpen: false },
  })
  const [topZIndex, setTopZIndex] = useState(10)

  const [draggingWindow, setDraggingWindow] = useState<WindowId | null>(null)
  const [windowDragOffset, setWindowDragOffset] = useState({ x: 0, y: 0 })

  const [iconPositions, setIconPositions] = useState<Record<string, IconPosition>>({
    'about':           { x: 20,  y: 20  },
    'why-web3':        { x: 20,  y: 140 },
    'governance':      { x: 20,  y: 260 },
    'privacy':         { x: 20,  y: 380 },
    'contact':         { x: 20,  y: 500 },
    'phd-development': { x: 160, y: 20  },
    'literature':      { x: 160, y: 140 },
    'splott':          { x: 160, y: 260 },
  })
  const [draggingIcon, setDraggingIcon] = useState<WindowId | null>(null)
  const [iconDragStart, setIconDragStart] = useState({ x: 0, y: 0 })
  const [iconDragHasMoved, setIconDragHasMoved] = useState(false)
  const [iconDragShadow, setIconDragShadow] = useState<{ x: number; y: number } | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const dotIdRef = useRef(0)

  // Clock
  useEffect(() => {
    const update = () => {
      const now = new Date()
      const h = now.getHours().toString().padStart(2, '0')
      const m = now.getMinutes().toString().padStart(2, '0')
      setClock(`${h}:${m}`)
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') || 'light'
    const entered = localStorage.getItem('has_entered')
    const savedTrail = localStorage.getItem('cursor_trail')
    const savedPositions = localStorage.getItem('icon_positions')
    const savedIconSize = localStorage.getItem('icon_size') as 'small' | 'medium' | 'large' | null

    const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent)
    const isPhone = /iPhone|iPod|Android.*Mobile/i.test(navigator.userAgent)
    setIsMobile(isTablet || isPhone || window.innerWidth < 768)

    setTheme(savedTheme)
    if (entered === 'true') setHasEntered(true)
    if (savedTrail !== null) setCursorTrailEnabled(savedTrail === 'true')
    if (savedIconSize) setIconSize(savedIconSize)
    if (savedPositions) {
      try {
        setIconPositions(prev => ({ ...prev, ...JSON.parse(savedPositions) }))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (!startMenuOpen) return
    const handler = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (!t.closest('.start-menu') && !t.closest('.start-button')) setStartMenuOpen(false)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [startMenuOpen])

  // Window dragging
  useEffect(() => {
    if (!draggingWindow) return
    const onMove = (e: MouseEvent) => {
      setCursorStyle('grabbing')
      setWindows(prev => ({
        ...prev,
        [draggingWindow]: {
          ...prev[draggingWindow],
          position: {
            x: e.clientX - windowDragOffset.x,
            y: Math.max(0, e.clientY - windowDragOffset.y),
          }
        }
      }))
    }
    const onUp = () => { setDraggingWindow(null); setCursorStyle('default') }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [draggingWindow, windowDragOffset])

  // Icon dragging
  useEffect(() => {
    if (!draggingIcon) return
    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - iconDragStart.x
      const dy = e.clientY - iconDragStart.y
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) { setIconDragHasMoved(true); setCursorStyle('grabbing') }
      setIconPositions(prev => ({
        ...prev,
        [draggingIcon]: { x: prev[draggingIcon].x + dx, y: prev[draggingIcon].y + dy }
      }))
      setIconDragStart({ x: e.clientX, y: e.clientY })
      setIconDragShadow({ x: e.clientX, y: e.clientY })
    }
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      setIconPositions(prev => ({
        ...prev,
        [draggingIcon]: {
          x: prev[draggingIcon].x + (touch.clientX - iconDragStart.x),
          y: prev[draggingIcon].y + (touch.clientY - iconDragStart.y),
        }
      }))
      setIconDragStart({ x: touch.clientX, y: touch.clientY })
    }
    const onUp = () => {
      setIconPositions(prev => {
        const snapped = { ...prev, [draggingIcon]: { x: snapToGrid(prev[draggingIcon].x), y: snapToGrid(prev[draggingIcon].y) } }
        localStorage.setItem('icon_positions', JSON.stringify(snapped))
        return snapped
      })
      setDraggingIcon(null); setIconDragShadow(null); setCursorStyle('default')
      setTimeout(() => setIconDragHasMoved(false), 50)
    }
    const onTouchEnd = () => {
      setIconPositions(prev => {
        const snapped = { ...prev, [draggingIcon]: { x: snapToGrid(prev[draggingIcon].x), y: snapToGrid(prev[draggingIcon].y) } }
        localStorage.setItem('icon_positions', JSON.stringify(snapped))
        return snapped
      })
      setDraggingIcon(null); setIconDragShadow(null)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onTouchMove)
    window.addEventListener('touchend', onTouchEnd)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [draggingIcon, iconDragStart])

  const handleIconMouseDown = (e: React.MouseEvent, id: WindowId) => {
    e.preventDefault(); setSelectedIcon(id); setDraggingIcon(id)
    setIconDragStart({ x: e.clientX, y: e.clientY }); setIconDragHasMoved(false); setCursorStyle('grab')
  }
  const handleIconTouchStart = (e: React.TouchEvent, id: WindowId) => {
    const touch = e.touches[0]; setSelectedIcon(id); setDraggingIcon(id)
    setIconDragStart({ x: touch.clientX, y: touch.clientY }); setIconDragHasMoved(false)
  }
  const handleIconClick = (id: WindowId) => {
    if (iconDragHasMoved) return
    if (isMobile) { openWindow(id); return }
    const now = Date.now()
    if (now - lastClickTime < 300 && selectedIcon === id) openWindow(id)
    setLastClickTime(now); setSelectedIcon(id)
  }

  const openWindow = (id: WindowId) => {
    const newZ = topZIndex + 1; setTopZIndex(newZ)
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], isOpen: true, zIndex: newZ } }))
    setMinimisedWindows(prev => prev.filter(w => w !== id))
  }
  const closeWindow = (id: WindowId) => {
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], isOpen: false } }))
    setMinimisedWindows(prev => prev.filter(w => w !== id))
  }
  const minimiseWindow = (id: WindowId) => {
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], isOpen: false } }))
    setMinimisedWindows(prev => prev.includes(id) ? prev : [...prev, id])
  }
  const restoreWindow = (id: WindowId) => {
    const newZ = topZIndex + 1; setTopZIndex(newZ)
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], isOpen: true, zIndex: newZ } }))
    setMinimisedWindows(prev => prev.filter(w => w !== id))
  }
  const bringToFront = (id: WindowId) => {
    const newZ = topZIndex + 1; setTopZIndex(newZ)
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], zIndex: newZ } }))
  }
  const handleWindowTitlebarMouseDown = (e: React.MouseEvent, id: WindowId) => {
    e.preventDefault(); bringToFront(id); setDraggingWindow(id)
    setWindowDragOffset({ x: e.clientX - windows[id].position.x, y: e.clientY - windows[id].position.y })
    setCursorStyle('grabbing')
  }

  // Cursor trail
  useEffect(() => {
    if (!hasEntered || !cursorTrailEnabled || isMobile) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const handler = (e: MouseEvent) => {
      const dot = { x: e.clientX, y: e.clientY, id: dotIdRef.current++ }
      setTrailDots(prev => [...prev, dot])
      setTimeout(() => setTrailDots(prev => prev.filter(d => d.id !== dot.id)), 600)
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [hasEntered, cursorTrailEnabled, isMobile])

  const handleConsent = (accepted: boolean) => {
    localStorage.setItem('analytics_consent', accepted ? 'accepted' : 'declined')
    localStorage.setItem('has_entered', 'true')
    setIsLoading(true)
    setBootMessages([])
    if (audioRef.current) audioRef.current.play().catch(() => {})

    const messages = [
      'Architecture of Agency OS v1.0',
      'Checking memory... OK',
      'Loading extensions...',
      'Mounting volumes... OK',
      'Initialising community protocols...',
      'Loading ZK credential layer...',
      'Connecting to Cardiff Council... OK',
      'Loading Splott community data...',
      'Applying Design Justice framework...',
      'Welcome.',
    ]
    messages.forEach((msg, i) => {
      setTimeout(() => {
        setBootMessages(prev => [...prev, msg])
      }, i * 300)
    })

    setTimeout(() => {
      setHasEntered(true)
      setIsLoading(false)
    }, 3500)
  }
  const toggleTheme = () => {
    const n = theme === 'light' ? 'dark' : 'light'; setTheme(n); localStorage.setItem('theme', n)
  }
  const toggleCursorTrail = () => {
    const n = !cursorTrailEnabled; setCursorTrailEnabled(n); localStorage.setItem('cursor_trail', n.toString())
  }
  const changeIconSize = (s: 'small' | 'medium' | 'large') => {
    setIconSize(s); localStorage.setItem('icon_size', s)
  }

  const iconSizes = {
    small:  { icon: 48, width: 95,  font: 10 },
    medium: { icon: 64, width: 120, font: 11 },
    large:  { icon: 80, width: 140, font: 13 },
  }
  const cs = iconSizes[iconSize]

  // Labels — bilingual
  const labels = {
    en: {
      about: 'About', 'why-web3': 'Why Web3', governance: 'Governance',
      privacy: 'Privacy', contact: 'Contact', 'phd-development': 'PhD',
      literature: 'Reading', splott: 'Splott',
      menu: 'Menu', langSwitch: 'Newid i Gymraeg',
      lightMode: 'Switch to light mode', darkMode: 'Switch to dark mode',
      trailOn: 'Cursor trail: on', trailOff: 'Cursor trail: off',
      iconsLabel: 'Icons:', close: 'Close',
    },
    cy: {
      about: 'Ynghylch', 'why-web3': 'Pam Web3', governance: 'Llywodraethu',
      privacy: 'Preifatrwydd', contact: 'Cysylltu', 'phd-development': 'PhD',
      literature: 'Darllen', splott: 'Splott',
      menu: 'Dewislen', langSwitch: 'Switch to English',
      lightMode: 'Newid i fodd golau', darkMode: 'Newid i fodd tywyll',
      trailOn: 'Llwybr cyrchwr: ymlaen', trailOff: 'Llwybr cyrchwr: i ffwrdd',
      iconsLabel: 'Eiconau:', close: 'Cau',
    }
  }
  const t = labels[lang as 'en' | 'cy']

  const windowTitles: Record<string, Record<WindowId, string>> = {
    en: {
      'about': 'About', 'why-web3': 'Why Web3?', 'governance': 'Data Governance',
      'privacy': 'Privacy Policy', 'contact': 'Contact',
      'phd-development': 'PhD Development', 'literature': 'Literature', 'splott': 'Splott',
    },
    cy: {
      'about': 'Ynghylch', 'why-web3': 'Pam Web3?', 'governance': 'Llywodraethu Data',
      'privacy': 'Polisi Preifatrwydd', 'contact': 'Cysylltu',
      'phd-development': 'Datblygiad PhD', 'literature': 'Llenyddiaeth', 'splott': 'Splott',
    }
  }

  const isDark = theme === 'dark'
  const bg      = isDark ? '#1a1a1a' : '#c0c0c0'
  const surface = isDark ? '#2a2a2a' : '#ffffff'
  const border  = isDark ? '#666666' : '#000000'
  const text    = isDark ? '#e0e0e0' : '#000000'
  const subtle  = isDark ? '#999999' : '#666666'

  type IconType = 'document' | 'globe3' | 'cabinet' | 'lock' | 'envelope' | 'pencil' | 'books' | 'mappin'

  const iconDefs: Array<{ id: WindowId; type: IconType }> = [
    { id: 'about',           type: 'document' },
    { id: 'why-web3',        type: 'globe3'   },
    { id: 'governance',      type: 'cabinet'  },
    { id: 'privacy',         type: 'lock'     },
    { id: 'contact',         type: 'envelope' },
    { id: 'phd-development', type: 'pencil'   },
    { id: 'literature',      type: 'books'    },
    { id: 'splott',          type: 'mappin'   },
  ]

  // Icons on 32×32 grid, stepped shading (highlight/mid/shadow), no gradients, no curves.
  const renderIcon = (type: IconType, s: number) => {
    const K = isDark

    switch (type) {

      // ── Document ──────────────────────────────────────────────────────────────
      case 'document': {
        const PH=K?'#eeeeee':'#ffffff', PM=K?'#bbbbbb':'#dddddd', PS=K?'#888888':'#aaaaaa'
        const LN=K?'#666666':'#999999', FK=K?'#666666':'#bbbbbb', BK=K?'#cccccc':'#000000'
        return (
          <svg width={s} height={s} viewBox="0 0 32 32" shapeRendering="crispEdges">
            {/* Page body */}
            <rect x="2" y="0" width="27" height="32" fill={PM}/>
            <rect x="2" y="0" width="17" height="32" fill={PH}/>
            {/* Folded top-right corner — step shape */}
            <rect x="19" y="0" width="10" height="8" fill={FK}/>
            <rect x="19" y="0" width="1"  height="7" fill={PS}/>
            <rect x="19" y="7" width="10" height="1" fill={BK}/>
            <rect x="29" y="0" width="1"  height="32" fill={BK}/>
            {/* Outline */}
            <rect x="2"  y="0"  width="1"  height="32" fill={BK}/>
            <rect x="2"  y="0"  width="28" height="1"  fill={BK}/>
            <rect x="2"  y="31" width="28" height="1"  fill={BK}/>
            {/* Text lines */}
            {[8,12,16,20,24].map(y=><rect key={y} x="5" y={y} width="20" height="2" fill={LN}/>)}
            <rect x="5" y="28" width="12" height="2" fill={LN}/>
            {/* Shadow */}
            <rect x="3"  y="32" width="28" height="1" fill={PS}/>
            <rect x="30" y="1"  width="1"  height="31" fill={PS}/>
          </svg>
        )
      }

      // ── Globe with 3 ─────────────────────────────────────────────────────────
      case 'globe3': {
        // Proper stepped-shading globe — circle built from variable-width rows
        const O1=K?'#aabbff':'#bbccff', O2=K?'#3366dd':'#4477ee'
        const O3=K?'#1144bb':'#2255cc', O4=K?'#002288':'#0033aa'
        const G1=K?'#88cc88':'#aaddaa', G2=K?'#448844':'#559955', G3=K?'#335533':'#224422'
        const BK=K?'#cccccc':'#000000'
        // Each row: [x_start, width] approximating a circle on 32x32 grid
        const rows:[number,number][]=[
          [10,12],[7,18],[5,22],[3,26],[2,28],[1,30],[1,30],[1,30],[1,30],[1,30],
          [1,30],[1,30],[1,30],[1,30],[1,30],[1,30],[1,30],[1,30],[1,30],[1,30],
          [1,30],[1,30],[1,30],[1,30],[1,30],[2,28],[3,26],[5,22],[7,18],[10,12],
        ]
        return (
          <svg width={s} height={s} viewBox="0 0 32 32" shapeRendering="crispEdges">
            {/* Ocean fill */}
            {rows.map(([x,w],i)=><rect key={`f${i}`} x={x} y={i+1} width={w} height={1} fill={O2}/>)}
            {/* Highlight — top-left arc */}
            {rows.slice(0,10).map(([x,w],i)=><rect key={`h${i}`} x={x} y={i+1} width={Math.floor(w*0.4)} height={1} fill={O1}/>)}
            {/* Shadow — bottom-right arc */}
            {rows.slice(18).map(([x,w],i)=><rect key={`s${i}`} x={x+Math.floor(w*0.6)} y={i+19} width={Math.floor(w*0.4)} height={1} fill={O3}/>)}
            {rows.slice(24).map(([x,w],i)=><rect key={`d${i}`} x={x+Math.floor(w*0.7)} y={i+25} width={Math.floor(w*0.3)} height={1} fill={O4}/>)}
            {/* Outline */}
            {rows.map(([x,w],i)=>[
              <rect key={`ol${i}`} x={x} y={i+1} width={1} height={1} fill={BK}/>,
              <rect key={`or${i}`} x={x+w-1} y={i+1} width={1} height={1} fill={BK}/>,
            ])}
            <rect x="8"  y="1"  width="16" height="1" fill={BK}/>
            <rect x="8"  y="31" width="16" height="1" fill={BK}/>
            {/* Latitude lines */}
            <rect x="2"  y="9"  width="28" height="1" fill={O3}/>
            <rect x="1"  y="16" width="30" height="1" fill={O3}/>
            <rect x="2"  y="23" width="28" height="1" fill={O3}/>
            {/* Longitude lines */}
            <rect x="9"  y="2"  width="1" height="28" fill={O3}/>
            <rect x="22" y="2"  width="1" height="28" fill={O3}/>
            {/* Landmasses */}
            <rect x="2"  y="6"  width="4" height="6"  fill={G2}/>
            <rect x="2"  y="6"  width="2" height="2"  fill={G1}/>
            <rect x="5"  y="10" width="2" height="2"  fill={G3}/>
            <rect x="13" y="6"  width="4" height="4"  fill={G2}/>
            <rect x="13" y="6"  width="2" height="2"  fill={G1}/>
            <rect x="13" y="11" width="4" height="9"  fill={G2}/>
            <rect x="13" y="11" width="2" height="3"  fill={G1}/>
            <rect x="15" y="18" width="2" height="2"  fill={G3}/>
            <rect x="18" y="5"  width="6" height="6"  fill={G2}/>
            <rect x="18" y="5"  width="3" height="2"  fill={G1}/>
            <rect x="22" y="9"  width="2" height="3"  fill={G3}/>
            <rect x="22" y="19" width="4" height="3"  fill={G2}/>
            {/* Pixel "3" white bottom-right */}
            <rect x="18" y="19" width="8" height="2" fill="#ffffff"/>
            <rect x="24" y="21" width="2" height="2" fill="#ffffff"/>
            <rect x="20" y="23" width="6" height="2" fill="#ffffff"/>
            <rect x="24" y="25" width="2" height="2" fill="#ffffff"/>
            <rect x="18" y="27" width="8" height="2" fill="#ffffff"/>
            {/* Drop shadow */}
            <rect x="8"  y="32" width="16" height="1" fill={O4}/>
          </svg>
        )
      }

      // ── Filing cabinet ────────────────────────────────────────────────────────
      case 'cabinet': {
        const BH=K?'#bbbbbb':'#dddddd', BM=K?'#888888':'#aaaaaa', BS=K?'#555555':'#777777'
        const DH=K?'#cccccc':'#eeeeee', DM=K?'#999999':'#cccccc', DS=K?'#666666':'#999999'
        const HH=K?'#dddddd':'#ffffff', HS=K?'#444444':'#888888'
        const BK=K?'#cccccc':'#000000'
        return (
          <svg width={s} height={s} viewBox="0 0 32 32" shapeRendering="crispEdges">
            <rect x="2"  y="1"  width="28" height="30" fill={BM}/>
            <rect x="2"  y="1"  width="3"  height="30" fill={BH}/>
            <rect x="27" y="1"  width="3"  height="30" fill={BS}/>
            <rect x="2"  y="1"  width="28" height="1"  fill={BK}/>
            <rect x="2"  y="31" width="28" height="1"  fill={BK}/>
            <rect x="2"  y="1"  width="1"  height="31" fill={BK}/>
            <rect x="29" y="1"  width="1"  height="31" fill={BK}/>
            {[3,12,21].map(y=>(
              <g key={y}>
                <rect x="4"  y={y}   width="24" height="8"  fill={DM}/>
                <rect x="4"  y={y}   width="24" height="2"  fill={DH}/>
                <rect x="4"  y={y+6} width="24" height="2"  fill={DS}/>
                <rect x="4"  y={y}   width="1"  height="8"  fill={DH}/>
                <rect x="27" y={y}   width="1"  height="8"  fill={DS}/>
                <rect x="4"  y={y}   width="24" height="1"  fill={BK}/>
                <rect x="4"  y={y+8} width="24" height="1"  fill={BK}/>
                <rect x="11" y={y+3} width="10" height="3"  fill={HS}/>
                <rect x="11" y={y+3} width="10" height="1"  fill={HH}/>
                <rect x="11" y={y+3} width="1"  height="3"  fill={HH}/>
                <rect x="11" y={y+2} width="10" height="1"  fill={BK}/>
                <rect x="11" y={y+5} width="10" height="1"  fill={BK}/>
                <rect x="11" y={y+2} width="1"  height="4"  fill={BK}/>
                <rect x="20" y={y+2} width="1"  height="4"  fill={BK}/>
              </g>
            ))}
            <rect x="3"  y="32" width="28" height="1"  fill={BS}/>
            <rect x="30" y="2"  width="1"  height="30" fill={BS}/>
          </svg>
        )
      }

      // ── Lock ──────────────────────────────────────────────────────────────────
      case 'lock': {
        const GH=K?'#ffee66':'#ffff99', GM=K?'#ddaa00':'#ffcc00', GS=K?'#996600':'#cc9900'
        const SH=K?'#bbbbbb':'#dddddd', SM=K?'#888888':'#aaaaaa', SS=K?'#555555':'#777777'
        const BK=K?'#cccccc':'#000000'
        return (
          <svg width={s} height={s} viewBox="0 0 32 32" shapeRendering="crispEdges">
            {/* Left post */}
            <rect x="8"  y="3"  width="4"  height="14" fill={SM}/>
            <rect x="8"  y="3"  width="1"  height="14" fill={SH}/>
            <rect x="11" y="3"  width="1"  height="14" fill={SS}/>
            <rect x="8"  y="3"  width="1"  height="14" fill={BK}/>
            <rect x="11" y="3"  width="1"  height="14" fill={BK}/>
            {/* Right post */}
            <rect x="20" y="3"  width="4"  height="14" fill={SM}/>
            <rect x="20" y="3"  width="1"  height="14" fill={SH}/>
            <rect x="23" y="3"  width="1"  height="14" fill={SS}/>
            <rect x="20" y="3"  width="1"  height="14" fill={BK}/>
            <rect x="23" y="3"  width="1"  height="14" fill={BK}/>
            {/* Top bar */}
            <rect x="8"  y="3"  width="16" height="4"  fill={SM}/>
            <rect x="8"  y="3"  width="16" height="1"  fill={SH}/>
            <rect x="8"  y="3"  width="16" height="1"  fill={BK}/>
            {/* Body */}
            <rect x="3"  y="15" width="26" height="16" fill={GM}/>
            <rect x="3"  y="15" width="26" height="3"  fill={GH}/>
            <rect x="3"  y="27" width="26" height="4"  fill={GS}/>
            <rect x="3"  y="15" width="2"  height="16" fill={GH}/>
            <rect x="27" y="15" width="2"  height="16" fill={GS}/>
            <rect x="3"  y="15" width="26" height="1"  fill={BK}/>
            <rect x="3"  y="30" width="26" height="1"  fill={BK}/>
            <rect x="3"  y="15" width="1"  height="16" fill={BK}/>
            <rect x="28" y="15" width="1"  height="16" fill={BK}/>
            {/* Keyhole — round top + slot */}
            <rect x="14" y="19" width="4"  height="1"  fill={BK}/>
            <rect x="13" y="20" width="6"  height="4"  fill={BK}/>
            <rect x="14" y="24" width="4"  height="1"  fill={BK}/>
            <rect x="15" y="25" width="2"  height="3"  fill={BK}/>
            {/* Drop shadow */}
            <rect x="4"  y="31" width="26" height="1"  fill={GS}/>
            <rect x="29" y="16" width="1"  height="15" fill={GS}/>
          </svg>
        )
      }

      // ── Envelope ──────────────────────────────────────────────────────────────
      case 'envelope': {
        const EH=K?'#eeeeee':'#ffffff', EM=K?'#cccccc':'#eeeeee', ES=K?'#888888':'#cccccc'
        const FH=K?'#ff8888':'#ff6666', FM=K?'#cc3333':'#dd3333', FS=K?'#881111':'#aa1111'
        const BK=K?'#cccccc':'#000000'
        return (
          <svg width={s} height={s} viewBox="0 0 32 32" shapeRendering="crispEdges">
            <rect x="1"  y="8"  width="30" height="20" fill={EM}/>
            <rect x="1"  y="8"  width="2"  height="20" fill={EH}/>
            <rect x="29" y="8"  width="2"  height="20" fill={ES}/>
            <rect x="1"  y="26" width="30" height="2"  fill={ES}/>
            <rect x="1"  y="8"  width="30" height="1"  fill={BK}/>
            <rect x="1"  y="27" width="30" height="1"  fill={BK}/>
            <rect x="1"  y="8"  width="1"  height="20" fill={BK}/>
            <rect x="30" y="8"  width="1"  height="20" fill={BK}/>
            {/* V flap row by row */}
            {[[1,2],[3,2],[5,2],[7,2],[9,2],[11,2],[13,2],[15,2]].map(([x,w],i)=>(
              <g key={i}>
                <rect x={x}    y={8+i} width={w}   height="1" fill={i===0?FH:FM}/>
                <rect x={30-x-w+2} y={8+i} width={w} height="1" fill={i===0?FM:i>5?FS:FM}/>
              </g>
            ))}
            <rect x="15" y="16" width="2"  height="1"  fill={FS}/>
            <rect x="2"  y="24" width="10" height="1"  fill={ES}/>
            <rect x="20" y="24" width="10" height="1"  fill={ES}/>
            <rect x="2"  y="28" width="30" height="1"  fill={ES}/>
            <rect x="31" y="9"  width="1"  height="19" fill={ES}/>
          </svg>
        )
      }

      // ── Pencil ────────────────────────────────────────────────────────────────
      case 'pencil': {
        const EH=K?'#ffaaaa':'#ffcccc', EM=K?'#dd6666':'#ff9999', ES=K?'#aa3333':'#cc6666'
        const BN=K?'#bbbbbb':'#cccccc', BS=K?'#777777':'#999999'
        const YH=K?'#ffee44':'#ffff88', YM=K?'#ddaa00':'#ffdd00', YS=K?'#996600':'#cc9900'
        const WH=K?'#ddaa88':'#eebb99', WS=K?'#885522':'#aa7733'
        const NK=K?'#555555':'#222222', BK=K?'#cccccc':'#000000'
        return (
          <svg width={s} height={s} viewBox="0 0 32 32" shapeRendering="crispEdges">
            {/* Eraser */}
            <rect x="11" y="1"  width="10" height="5"  fill={EM}/>
            <rect x="11" y="1"  width="10" height="1"  fill={EH}/>
            <rect x="11" y="4"  width="10" height="2"  fill={ES}/>
            <rect x="11" y="1"  width="1"  height="5"  fill={EH}/>
            <rect x="20" y="1"  width="1"  height="5"  fill={ES}/>
            <rect x="11" y="1"  width="10" height="1"  fill={BK}/>
            <rect x="11" y="5"  width="10" height="1"  fill={BK}/>
            <rect x="11" y="1"  width="1"  height="5"  fill={BK}/>
            <rect x="20" y="1"  width="1"  height="5"  fill={BK}/>
            {/* Band */}
            <rect x="11" y="6"  width="10" height="3"  fill={BS}/>
            <rect x="11" y="6"  width="10" height="1"  fill={BN}/>
            <rect x="11" y="6"  width="1"  height="3"  fill={BN}/>
            <rect x="11" y="5"  width="10" height="1"  fill={BK}/>
            <rect x="11" y="8"  width="10" height="1"  fill={BK}/>
            {/* Body */}
            <rect x="11" y="9"  width="10" height="16" fill={YM}/>
            <rect x="11" y="9"  width="2"  height="16" fill={YH}/>
            <rect x="19" y="9"  width="2"  height="16" fill={YS}/>
            <rect x="11" y="9"  width="1"  height="16" fill={BK}/>
            <rect x="20" y="9"  width="1"  height="16" fill={BK}/>
            {/* Wood taper */}
            <rect x="11" y="25" width="10" height="1"  fill={BK}/>
            <rect x="12" y="26" width="8"  height="1"  fill={WH}/>
            <rect x="13" y="27" width="6"  height="1"  fill={WH}/>
            <rect x="14" y="28" width="4"  height="1"  fill={WS}/>
            <rect x="12" y="26" width="1"  height="3"  fill={BK}/>
            <rect x="19" y="26" width="1"  height="3"  fill={BK}/>
            <rect x="13" y="27" width="1"  height="2"  fill={BK}/>
            <rect x="18" y="27" width="1"  height="2"  fill={BK}/>
            {/* Nib */}
            <rect x="14" y="28" width="4"  height="1"  fill={BK}/>
            <rect x="15" y="29" width="2"  height="2"  fill={NK}/>
            <rect x="15" y="29" width="1"  height="2"  fill={BK}/>
            <rect x="16" y="29" width="1"  height="2"  fill={BK}/>
            <rect x="15" y="31" width="2"  height="1"  fill={BK}/>
            {/* Shadow */}
            <rect x="12" y="32" width="10" height="1"  fill={YS}/>
            <rect x="21" y="2"  width="1"  height="30" fill={YS}/>
          </svg>
        )
      }

      // ── Books ─────────────────────────────────────────────────────────────────
      // Three books standing upright, side by side, different heights
      case 'books': {
        // Horizontal isometric stack — 3 books, each with top face, spine, front face, page edge
        const B1T=K?'#aabbff':'#ccddf0', B1H=K?'#6688ee':'#8899ff', B1M=K?'#4466cc':'#5577dd', B1S=K?'#223388':'#334499'
        const B2T=K?'#ffbbbb':'#ffdddd', B2H=K?'#ee7777':'#ff9999', B2M=K?'#cc3333':'#dd4444', B2S=K?'#881111':'#aa2222'
        const B3T=K?'#bbffbb':'#ddffdd', B3H=K?'#77ee77':'#99ff99', B3M=K?'#336633':'#448844', B3S=K?'#114411':'#225522'
        const PG=K?'#dddddd':'#eeeeee', BK=K?'#cccccc':'#000000'
        // Stack goes bottom-left to top-right. Each book: top parallelogram + spine + front + pages.
        // Book height 7px, width 24px, isometric offset 4px per book
        return (
          <svg width={s} height={s} viewBox="0 0 32 32" shapeRendering="crispEdges">
            {/* ── Book 1 — bottom, blue ── */}
            {/* Top face parallelogram: y=20 left to y=17 right */}
            <rect x="1"  y="20" width="24" height="1" fill={B1T}/>
            <rect x="2"  y="19" width="24" height="1" fill={B1T}/>
            <rect x="3"  y="18" width="24" height="1" fill={B1H}/>
            <rect x="4"  y="17" width="24" height="1" fill={B1H}/>
            <rect x="1"  y="20" width="1"  height="1" fill={BK}/>
            <rect x="28" y="17" width="1"  height="4" fill={BK}/>
            <rect x="1"  y="17" width="27" height="1" fill={BK}/>
            {/* Spine — left dark face */}
            <rect x="1"  y="21" width="3"  height="8" fill={B1S}/>
            <rect x="1"  y="21" width="1"  height="8" fill={BK}/>
            <rect x="1"  y="28" width="3"  height="1" fill={BK}/>
            {/* Front face */}
            <rect x="4"  y="21" width="24" height="8" fill={B1M}/>
            <rect x="4"  y="21" width="6"  height="8" fill={B1H}/>
            <rect x="4"  y="21" width="24" height="1" fill={BK}/>
            <rect x="4"  y="28" width="24" height="1" fill={BK}/>
            <rect x="27" y="21" width="1"  height="8" fill={BK}/>
            {/* Page edge */}
            <rect x="28" y="17" width="1"  height="12" fill={PG}/>
            <rect x="28" y="29" width="1"  height="1"  fill={BK}/>

            {/* ── Book 2 — middle, red, offset 4px up ── */}
            <rect x="5"  y="14" width="24" height="1" fill={B2T}/>
            <rect x="6"  y="13" width="24" height="1" fill={B2T}/>
            <rect x="7"  y="12" width="24" height="1" fill={B2H}/>
            <rect x="8"  y="11" width="24" height="1" fill={B2H}/>
            <rect x="5"  y="14" width="1"  height="1" fill={BK}/>
            <rect x="32" y="11" width="1"  height="4" fill={BK}/>
            <rect x="5"  y="11" width="27" height="1" fill={BK}/>
            <rect x="5"  y="15" width="3"  height="7" fill={B2S}/>
            <rect x="5"  y="15" width="1"  height="7" fill={BK}/>
            <rect x="5"  y="21" width="3"  height="1" fill={BK}/>
            <rect x="8"  y="15" width="23" height="7" fill={B2M}/>
            <rect x="8"  y="15" width="6"  height="7" fill={B2H}/>
            <rect x="8"  y="15" width="23" height="1" fill={BK}/>
            <rect x="8"  y="21" width="23" height="1" fill={BK}/>
            <rect x="30" y="15" width="1"  height="7" fill={BK}/>
            <rect x="31" y="11" width="1"  height="11" fill={PG}/>
            <rect x="31" y="22" width="1"  height="1"  fill={BK}/>

            {/* ── Book 3 — top, green, offset 4px up again ── */}
            <rect x="8"  y="8"  width="24" height="1" fill={B3T}/>
            <rect x="9"  y="7"  width="24" height="1" fill={B3T}/>
            <rect x="10" y="6"  width="22" height="1" fill={B3H}/>
            <rect x="8"  y="8"  width="1"  height="1" fill={BK}/>
            <rect x="8"  y="5"  width="24" height="1" fill={BK}/>
            <rect x="8"  y="9"  width="3"  height="6" fill={B3S}/>
            <rect x="8"  y="9"  width="1"  height="6" fill={BK}/>
            <rect x="8"  y="14" width="3"  height="1" fill={BK}/>
            <rect x="11" y="9"  width="20" height="6" fill={B3M}/>
            <rect x="11" y="9"  width="6"  height="6" fill={B3H}/>
            <rect x="11" y="9"  width="20" height="1" fill={BK}/>
            <rect x="11" y="14" width="20" height="1" fill={BK}/>
            <rect x="30" y="9"  width="1"  height="6" fill={BK}/>
            <rect x="31" y="5"  width="1"  height="10" fill={PG}/>
            <rect x="31" y="15" width="1"  height="1"  fill={BK}/>
          </svg>
        )
      }

      // ── Map pin — slim notice board push pin ──────────────────────────────────
      case 'mappin': {
        const PH=K?'#ff9999':'#ffbbbb', PM=K?'#dd2222':'#ee3333', PS=K?'#991111':'#bb2222'
        const NH=K?'#cccccc':'#dddddd', NM=K?'#888888':'#aaaaaa', NS=K?'#444444':'#666666'
        const BK=K?'#cccccc':'#000000'
        return (
          <svg width={s} height={s} viewBox="0 0 32 32" shapeRendering="crispEdges">
            {/* Top disc — slim, 10px wide */}
            <rect x="11" y="2"  width="10" height="1" fill={BK}/>
            <rect x="10" y="3"  width="12" height="1" fill={BK}/>
            <rect x="10" y="4"  width="12" height="3" fill={PH}/>
            <rect x="15" y="4"  width="7"  height="3" fill={PM}/>
            <rect x="19" y="4"  width="3"  height="3" fill={PS}/>
            <rect x="10" y="6"  width="12" height="1" fill={PM}/>
            <rect x="10" y="7"  width="12" height="1" fill={BK}/>
            <rect x="10" y="4"  width="1"  height="4" fill={BK}/>
            <rect x="21" y="4"  width="1"  height="4" fill={BK}/>
            {/* Barrel — 6px wide, narrow */}
            <rect x="13" y="8"  width="6"  height="10" fill={PM}/>
            <rect x="13" y="8"  width="2"  height="10" fill={PH}/>
            <rect x="17" y="8"  width="2"  height="10" fill={PS}/>
            <rect x="13" y="8"  width="1"  height="10" fill={BK}/>
            <rect x="18" y="8"  width="1"  height="10" fill={BK}/>
            {/* Rim highlight and shadow lines */}
            <rect x="13" y="10" width="6"  height="1"  fill={PH}/>
            <rect x="13" y="15" width="6"  height="1"  fill={PS}/>
            {/* Bottom disc — slim, 10px wide */}
            <rect x="10" y="18" width="12" height="1" fill={BK}/>
            <rect x="10" y="19" width="12" height="3" fill={PM}/>
            <rect x="10" y="19" width="3"  height="3" fill={PH}/>
            <rect x="19" y="19" width="3"  height="3" fill={PS}/>
            <rect x="10" y="21" width="12" height="1" fill={PS}/>
            <rect x="10" y="22" width="12" height="1" fill={BK}/>
            <rect x="10" y="19" width="1"  height="4" fill={BK}/>
            <rect x="21" y="19" width="1"  height="4" fill={BK}/>
            {/* Needle — 2px wide, sharp */}
            <rect x="15" y="23" width="2"  height="1" fill={NH}/>
            <rect x="15" y="24" width="2"  height="5" fill={NM}/>
            <rect x="16" y="24" width="1"  height="5" fill={NS}/>
            <rect x="15" y="29" width="2"  height="1" fill={NS}/>
            <rect x="15" y="23" width="1"  height="7" fill={BK}/>
            <rect x="16" y="29" width="1"  height="1" fill={BK}/>
            {/* Shadow spots either side of needle base */}
            <rect x="12" y="23" width="2"  height="1" fill={PS}/>
            <rect x="18" y="23" width="2"  height="1" fill={PS}/>
          </svg>
        )
      }
    }
  }


  // ─── Window content ───────────────────────────────────────────────────────────

  const renderWindowContent = (id: WindowId) => {
    const h2 = { fontSize: '15px', fontWeight: 700, margin: '20px 0 8px', color: text } as const
    const p  = { fontSize: '13px', lineHeight: 1.75, marginBottom: '14px', color: text } as const
    const ul = { margin: '8px 0 14px 22px', fontSize: '13px', lineHeight: 1.75, color: text } as const
    const li = { marginBottom: '8px' } as const
    const note = { fontSize: '11px', color: subtle, marginTop: '20px' } as const
    const divider = (
      <div style={{ height: 1, background: isDark ? '#444' : '#e0e0e0', margin: '20px 0' }} />
    )
    const techLabel = (
      <p style={{ fontSize: '11px', fontWeight: 700, color: subtle, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '20px 0 8px' }}>
        {lang === 'en' ? 'Technical detail' : 'Manylion technegol'}
      </p>
    )

    if (lang === 'cy') {
      switch (id) {

        case 'about':
          return (
            <>
              <p style={p}>Mae'r ymchwil hwn yn archwilio sut mae cymunedau yn cael eu heithrio o benderfyniadau cynllunio — a sut y gallai adeiladu seilwaith digidol newydd roi'r grym hwnnw yn ôl iddynt.</p>
              <h2 style={h2}>Y broblem</h2>
              <p style={p}>Mewn cynllunio trefol, mae mathau lluosog o bŵer yn penderfynu pwy sy'n cael llais:</p>
              <ul style={ul}>
                <li style={li}><strong>Pŵer eiddo:</strong> Gall perchnogion tir wrthod pawb trwy hawliau cyfreithiol</li>
                <li style={li}><strong>Pŵer economaidd:</strong> Gall datblygwyr wrthod trwy gyfalaf</li>
                <li style={li}><strong>Pŵer sefydliadol:</strong> Mae Awdurdodau Lleol yn gwrthod trwy bwerau statudol</li>
                <li style={li}><strong>Pŵer epistemolegol:</strong> Mae gweithwyr proffesiynol yn rheoli mynediad trwy arbenigedd technegol</li>
              </ul>
              <p style={p}>O fewn cymunedau sydd eisoes wedi'u heithrio, mae deinameg fwyafrifol yn distewi pobl anabl, rhentwyr, a lleiafrifoedd ymhellach.</p>
              <h2 style={h2}>Cyd-destun Caerdydd</h2>
              <p style={p}>Mae gan Gaerdydd 28 ward. Mae gan 6 ohonynt Gyngor Cymuned — ond hyd yn oed y rhain yn aml yn cynnig ymgynghori tocenistig yn unig, heb bŵer gwneud penderfyniadau go iawn. Mae gan 22 ward arall ddim strwythur ffurfiol o gwbl.</p>
              <p style={p}>Nid yw absenoldeb Cyngor Cymuned yn atal cymuned rhag paratoi Cynllun Lle yn gyfreithiol — ond mae'n gadael y cwestiwn o gynrychiolaeth heb ei ateb: sut all awdurdod lleol fodloni ei hun bod grŵp yn cynrychioli'r gymdogaeth, heb sefydlu sefydliad newydd canolog?</p>
              <h2 style={h2}>Architecture of Agency</h2>
              <p style={p}>Cyfraniad damcaniaethol canolog y PhD yw'r cynnig bod amodau gofodol, sefydliadol, a thechnegol gyda'i gilydd yn cynhyrchu neu'n cau allan asiantaeth gymunedol — ac y gall ailddylunio unrhyw un o'r tri haen newid pwy sy'n gallu gweithredu, cyfrannu, a bod yn bresennol.</p>
              <p style={p}>Mae dau gysyniad diagnostig yn sail i'r fframwaith: <strong>Absenoldeb Olrhain</strong> — ailadeiladu o gofnodion cynllunio pwy nad oedd yn bresennol a pha amodau strwythurol a gynhyrchodd yr absenoldeb hwnnw — a <strong>Cholled Olrhain</strong> — yr hyn a gynhyrchodd yr absenoldebau hynny: y penderfyniadau a wnaed, yr amgylcheddau a siapiwd, y lleoedd a gynlluniwyd heb wybodaeth y rhai a eithriawyd.</p>
              <h2 style={h2}>Cwestiynau ymchwil</h2>
              <ul style={ul}>
                <li style={li}>Sut all systemau llywodraethiant ymgysylltu â phob rhanddeiliad tra'n canoli cymunedau?</li>
                <li style={li}>Pa fecanweithiau sy'n atal cipio sefydliadol a gormes mwyafrifol?</li>
                <li style={li}>All technoleg ddigidol alluogi asiantaeth gymunedol ddilysiedig, heb greu pwyntiau canoli newydd?</li>
                <li style={li}>Beth mae Cyfiawnder Dylunio yn ei olygu pan fo'n rhan o seilwaith dinesig?</li>
                <li style={li}>Sut rydym yn ailddosbarthu awdurdod epistemolegol ochr yn ochr â phŵer gwneud penderfyniadau?</li>
              </ul>
              <p style={note}>PhD Blwyddyn 1 — Ysgol Bensaernïaeth Cymru, Prifysgol Caerdydd<br />Dan oruchwyliaeth yr Athro Mhairi McVicar, Dr Neil Turnbull, a Simon Gilbert (Pennaeth Cynllunio, Cyngor Caerdydd)</p>
            </>
          )

        case 'why-web3':
          return (
            <>
              <p style={p}>Mae'r ymchwil hwn yn archwilio a all technoleg ddigidol ddosbarthedig helpu i ddatrys methiant cydlynu penodol mewn cynllunio cymunedol — un lle na all y naill ochr na'r llall rannu gwybodaeth angenrheidiol heb risgiau preifatrwydd annerbyniol.</p>
              <h2 style={h2}>Y methiant cydlynu</h2>
              <p style={p}>I gymuned heb Gyngor Cymuned gynhyrchu sylfaen wybodaeth ddilysiedig ar gyfer Cynllun Lle, mae angen cydlynu ar draws sawl math o actor — cymunedau, sefydliadau cymunedol, a'r Cyngor — ond nid oes gan unrhyw un ohonynt ffordd bresennol i rannu'r wybodaeth angenrheidiol heb greu risgiau preifatrwydd neu fynediad annerbyniol.</p>
              <p style={p}>Mae'r her yn ddwyochrog. Nid yn unig mae cymunedau'n methu cyflwyno tystiolaeth gymunedol ddilysiedig i'r awdurdod cynllunio — ni all Cynghorau Cymuned a grwpiau cymunedol gael gafael ar ddata perthnasol gan yr awdurdod lleol mewn ffordd ddilysiedig, preifatrwydd-barchus chwaith.</p>
              <h2 style={h2}>Pam technoleg ddosbarthedig</h2>
              <p style={p}>Mae systemau cronfa ddata traddodiadol yn gofyn i rywun berchnogi a rheoli'r seilwaith. Ar gyfer llywodraethiant trefol, mae hyn yn golygu amnewid rheolaeth yr Awdurdod Lleol â phwynt canoli arall. Nid yw'r strwythur pŵer yn newid — mae'n symud yn unig.</p>
              <p style={p}>Mae'r ymchwil hwn yn archwilio a all technoleg sy'n rhedeg ar draws rhwydwaith dosbarthedig — lle nad oes unrhyw unigolyn neu sefydliad yn berchen ar y seilwaith — gynnal trefniadau cydlynu gwahanol: rhai lle mae preifatrwydd yn cael ei orfodi'n dechnegol, nid ei addo'n unig.</p>
              {divider}
              {techLabel}
              <p style={p}>Mae'r ymchwil yn canolbwyntio ar gredynnau sero-wybodaeth — math o brawf cryptograffig sy'n caniatáu i chi brofi bod rhywbeth yn wir heb ddatgelu'r wybodaeth sylfaenol. Mae hyn yn golygu y gallai Cyngor Caerdydd gael prawf bod sylfaen wybodaeth wedi'i chynhyrchu gan gymuned ddigon gynrychiadol o drigolion — heb erioed weld pwy gyfrannodd beth.</p>
              <p style={p}>Mae Ethereum yn blatfform cynllunio agored-ffynhonnell sy'n rhedeg ar rwydwaith o gyfrifiaduron ledled y byd — nid yw'n eiddo i unrhyw gwmni unigol. Gellir ei ddefnyddio i storio tystiaeth ar-gadwyn yn gyhoeddus ac yn archwiliadwy. Er ei fod yn adnabyddus fel platfform arian digidol, mae ei seilwaith yn cael ei ymchwilio yma at ddibenion llywodraethiant dinesig, nid ariannol.</p>
              <p style={p}>Nid yw technoleg yn datrys problemau pŵer cymdeithasol a gwleidyddol. Mae hygyrchedd yn ofyniad dylunio craidd, nid nodyn troedfel. Dyna pam mae cyd-ddylunio gyda thrigolion Splott yn pennu paramedrau'r system — nid rhagdybiaethau technegol.</p>
            </>
          )

        case 'governance':
          return (
            <>
              <p style={p}>Mae'r ymchwil hwn yn ymchwilio i sut ddylai data cymunedol gael ei lywodraethu. Nid oes gennym yr atebion eto — dyna beth fydd y PhD yn ei ddarganfod.</p>
              <h2 style={h2}>Data ymwelwyr y wefan</h2>
              <p style={p}>Mae'r wefan hon yn casglu data defnydd dienw: pa dudalennau rydych chi'n ymweld â nhw, sut rydych chi'n llywio, math o ddyfais, a gwlad yn unig. Mae Prifysgol Caerdydd yn dal y data hwn dros dro fel stiward yn ystod yr ymchwil PhD (2025–2028). Stiwardiaeth yw hyn, nid perchnogaeth.</p>
              <h2 style={h2}>Data ymchwil</h2>
              <p style={p}>Bydd data o gyfweliadau â chymunedau, cynllunwyr, a rhanddeiliaid eraill yn cael ei lywodraethu gyda chydnabyddiaeth o fuddiannau cymhleth ac weithiau gwrthdaro. Mae gan wahanol randdeiliaid hawliau dilys — nid oes un ateb syml.</p>
              <h2 style={h2}>Beth mae'r ymchwil hwn yn ei archwilio</h2>
              <ul style={ul}>
                <li style={li}>Sut ddylai data ymchwil aml-blaid gael ei lywodraethu?</li>
                <li style={li}>Pa hawliau sydd gan wahanol randdeiliaid?</li>
                <li style={li}>Sut rydych chi'n cydbwyso tryloywder â phreifatrwydd?</li>
                <li style={li}>Beth mae sofraniaeth data cymunedol yn ei olygu pan nad yw "cymuned" yn unffurf?</li>
              </ul>
              <h2 style={h2}>Ymrwymiadau cyfredol</h2>
              <ul style={ul}>
                <li style={li}>Casglu lleiaf — dim ond yr hyn sy'n angenrheidiol</li>
                <li style={li}>Tryloywder llawn am yr hyn sy'n cael ei gasglu a pham</li>
                <li style={li}>Cymeradwyaeth moeseg ymchwil Prifysgol Caerdydd ar gyfer pob casgliad data</li>
                <li style={li}>Ymrwymiad i drosglwyddo llywodraethiant i gymunedau ar ôl y PhD</li>
              </ul>
            </>
          )

        case 'privacy':
          return (
            <>
              <p style={{ fontSize: '11px', color: subtle, marginBottom: '16px' }}>Diweddariad diwethaf: Chwefror 2025</p>
              <h2 style={h2}>Beth mae'r wefan hon yn ei gasglu</h2>
              <p style={p}>Data defnydd dienw: pa dudalennau rydych chi'n ymweld â nhw, sut rydych chi'n llywio, math o ddyfais (symudol/bwrdd gwaith), rhanbarth daearyddol (gwlad yn unig). Dim gwybodaeth bersonol. Dim cwcis tracio. Dim data adnabyddadwy.</p>
              <h2 style={h2}>Pam rydym yn casglu hyn</h2>
              <p style={p}>I ddeall sut mae cymunedau yn ymgysylltu ag ymchwil sofraniaeth data, ac i wella hygyrchedd y cynnwys.</p>
              <h2 style={h2}>Ble mae'n cael ei storio</h2>
              <p style={p}>Mae data yn cael ei brosesu gan Vercel Inc. o dan eu polisi preifatrwydd. Mae Vercel Analytics wedi'i gynllunio i fod yn gydymffurfiol â GDPR.</p>
              <h2 style={h2}>Eich hawliau</h2>
              <ul style={ul}>
                <li style={li}>Deall pa ddata sy'n cael ei gasglu — wedi'i ddogfennu yma</li>
                <li style={li}>Optio allan — gwrthod ar y sgrin mynediad neu glirio data porwr</li>
                <li style={li}>Cysylltu â ni gyda chwestiynau neu bryderon</li>
              </ul>
              <p style={{ fontSize: '12px', marginTop: '20px', color: text }}>Cysylltu: Lucy Dunhill — dunhilll@cardiff.ac.uk</p>
            </>
          )

        case 'contact':
          return (
            <>
              <p style={{ ...p, fontWeight: 700 }}>Lucy Dunhill</p>
              <p style={p}>Ymchwilydd PhD<br />Ysgol Bensaernïaeth Cymru, Prifysgol Caerdydd</p>
              <p style={p}><a href="mailto:dunhilll@cardiff.ac.uk" style={{ color: 'inherit', textDecoration: 'underline' }}>dunhilll@cardiff.ac.uk</a></p>
              <p style={p}>Ar gael ar gyfer cyfarfodydd yng Nghaerdydd ac ar-lein.</p>
              <div style={{ marginTop: '20px' }}>
                {[
                  ['ORCID', 'https://orcid.org/0009-0009-3588-4823'],
                  ['Proffil Caerdydd', 'https://profiles.cardiff.ac.uk/research-staff/dunhilll'],
                  ['GitHub', 'https://github.com/Architecture-of-Agency/overview'],
                  ['Gwefan', 'https://architectureof.agency'],
                ].map(([label, url]) => (
                  <p key={label} style={{ fontSize: '12px', marginBottom: '8px' }}>
                    <strong>{label}:</strong>{' '}
                    <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{url}</a>
                  </p>
                ))}
              </div>
            </>
          )

        case 'phd-development':
          return (
            <>
              <p style={{ ...p, fontStyle: 'italic', color: subtle }}>Cofnod byw o ddatblygiad y PhD. Wedi'i ddiweddaru wrth i'r ymchwil fynd rhagddo.</p>
              <h2 style={h2}>Cam cyfredol</h2>
              <p style={p}>PhD Blwyddyn 1, Ysgol Bensaernïaeth Cymru, Prifysgol Caerdydd. Cyfnod: Sefydlu'r fframwaith damcaniaethol, adeiladu perthnasoedd sefydliadol, a dechrau ymgysylltu â'r gymuned yn Splott.</p>
              <h2 style={h2}>Partneriaethau wedi'u cadarnhau</h2>
              <ul style={ul}>
                <li style={li}>Cyngor Caerdydd — Simon Gilbert (Pennaeth Cynllunio) yn oruchwyliwr eilaidd</li>
                <li style={li}>Prosiect AHRC Co-PP dan arweiniad yr Athro Mhairi McVicar — yn rhedeg Mai–Rhagfyr 2026 ochr yn ochr â'r ymchwil</li>
              </ul>
              <h2 style={h2}>Myfyrdodau a nodiadau proses</h2>
              <p style={{ ...p, fontStyle: 'italic', color: subtle }}>[ I'w ychwanegu wrth i'r ymchwil ddatblygu. ]</p>
              <h2 style={h2}>Penderfyniadau allweddol</h2>
              <p style={{ ...p, fontStyle: 'italic', color: subtle }}>[ I'w ychwanegu wrth i benderfyniadau allweddol gael eu gwneud. ]</p>
            </>
          )

        case 'literature':
          return (
            <>
              <p style={{ ...p, fontStyle: 'italic', color: subtle }}>Wedi'i drefnu yn ôl thema. Bydd anodiadau yn cael eu hehangu wrth i'r PhD fynd rhagddo.</p>
              {[
                {
                  theme: 'Theori Cynllunio',
                  entries: [
                    { ref: 'Arnstein (1969)', note: 'Fframwaith sylfaenol ar gyfer cyfranogiad. Yn sefydlu bod ymgysylltiad cymunedol yn aml yn lawrlwytho cyfrifoldeb heb ailddosbarthu pŵer.' },
                    { ref: 'Rydin (2007)', note: 'Mae gwybodaeth mewn cynllunio yn adnodd cystadleuol y mae ei gyfreithlondeb yn cael ei bennu\'n gymdeithasol — nid mewnbwn niwtral.' },
                    { ref: 'Miessen (2016)', note: 'Cynulliad agweddol fel dewis arall i gyfranogiad consensws. Sail ddamcaniaethol ar gyfer pensaernïaeth luosogol, anghytgord y sylfaen wybodaeth.' },
                    { ref: 'Parvin (2021)', note: 'Cynllunio cymunedol fel problem seilwaith heb ei datrys.' },
                  ]
                },
                {
                  theme: 'Cyfiawnder Dylunio a Methodoleg',
                  entries: [
                    { ref: 'Costanza-Chock (2020)', note: 'Fframwaith ymbarél ar gyfer yr ymchwil hwn. Yn canoli\'r rhai sy\'n cael eu heffeithio fwyaf gan benderfyniadau dylunio yn y broses ddylunio ei hun — nid fel ymgynghorwyr, ond fel arweinwyr.' },
                    { ref: 'Carroll et al. (2020)', note: 'Egwyddorion CARE ar gyfer Llywodraethu Data Brodorol: Budd Cyfunol, Awdurdod i Reoli, Cyfrifoldeb, Moeseg.' },
                  ]
                },
                {
                  theme: 'Anabledd a Chyfiawnder Epistemolegol',
                  entries: [
                    { ref: 'Fricker (2007)', note: 'Anghyfiawnder hermeniwtig — y niwed a wneir pan fo rhywun yn methu â deall eu profiad eu hunain. Yn sail i\'r gofyniad nad yw seilwaith hunaniaeth yn amgodio allgáu presennol.' },
                    { ref: 'Garland-Thomson (2011)', note: 'Y cysyniad camffitio: nid y corff yw\'r broblem ond yr amgylchedd adeiledig sy\'n methu â\'i lety.' },
                    { ref: 'Hamraie (2017)', note: 'Theori anabledd beirniadol wedi\'i gymhwyso i ddylunio. Nid llety yw Cyfiawnder Dylunio — ailddylunio ydyw.' },
                    { ref: 'Goodley (2013)', note: 'Fframwaith astudiaethau anabledd beirniadol wedi\'i integreiddio i gyfraniad damcaniaethol Architecture of Agency.' },
                  ]
                },
                {
                  theme: 'Blockchain a Systemau Trefol',
                  entries: [
                    { ref: 'Ietto et al. (2022); Muth et al. (2022); Rabe et al. (2021)', note: 'Prosiect BBBlockchain, Berlin. Tystiolaeth empirig fwyaf sylweddol ar gyfer blockchain mewn cyd-destunau cynllunio.' },
                    { ref: 'Schneider (2019)', note: 'Mae honiadau datganoli yn aml yn anghyflawn ac yn cuddio asimetreddau pŵer parhaus.' },
                    { ref: 'Lumineau et al. (2021)', note: 'Mae honiadau llywodraethiant angen sylfaen empirig.' },
                  ]
                },
                {
                  theme: 'Sofraniaeth Data a Ffeministiaeth',
                  entries: [
                    { ref: 'Haraway (1991)', note: 'Epistemeg ffeministaidd sylfaenol. Mae gwybodaeth bob amser yn cael ei chynhyrchu o safbwynt — ac mae\'r cwestiwn pwy sy\'n cyfri yn gynllunio yn gwestiwn gwleidyddol, nid technegol.' },
                    { ref: 'Plant (1997)', note: 'Seibrffeminisdiaeth wedi\'i integreiddio i\'r synthesis damcaniaethol. Technoleg fel safle o bosibilrwydd a risg gwleidyddol ffeministaidd.' },
                  ]
                },
              ].map(({ theme, entries }) => (
                <div key={theme} style={{ marginBottom: '24px' }}>
                  <h2 style={h2}>{theme}</h2>
                  {entries.map(({ ref, note }) => (
                    <div key={ref} style={{
                      marginBottom: '10px', padding: '10px 12px',
                      background: isDark ? '#222' : '#f8f8f8',
                      borderLeft: `3px solid ${border}`,
                    }}>
                      <p style={{ fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: text }}>{ref}</p>
                      <p style={{ fontSize: '12px', lineHeight: 1.6, color: text }}>{note}</p>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )

        case 'splott':
          return (
            <>
              <p style={p}>Mae Splott yn gymdogaeth yng nghanol dinas Caerdydd heb Gyngor Cymuned. Mae wedi'i ddewis fel safle peilot ar gyfer yr ymchwil hwn oherwydd ei fod yn cynrychioli'r union fwlch sefydliadol y mae'r ymchwil yn ceisio mynd i'r afael ag ef.</p>
              <h2 style={h2}>Pam Splott</h2>
              <p style={p}>Cymuned drefol fewnol heb y seilwaith sefydliadol ffurfiol i gyfranogi yn y penderfyniadau cynllunio sy'n siapio ble mae ei thrigolion yn byw. Nid diffyg ymgysylltiad yw'r broblem — diffyg mecanwaith dilysiedig i gynrychiolaeth yw hi.</p>
              <h2 style={h2}>Statws cyfredol</h2>
              <p style={p}>Mae perthnasoedd cymunedol a sifil wedi'u hadeiladu dros y deuddeg mis diwethaf. Mae'r ymchwil yn dechrau.</p>
              <p style={{ ...p, fontStyle: 'italic', color: subtle }}>[ Bydd nodiadau maes a diweddariadau yn ymddangos yma wrth i'r ymchwil fynd rhagddo. ]</p>
            </>
          )
      }
    }

    // English content
    switch (id) {

      case 'about':
        return (
          <>
            <p style={p}>This research investigates how communities are excluded from planning decisions — and whether building new digital infrastructure could return that power to them.</p>
            <h2 style={h2}>The problem</h2>
            <p style={p}>In urban planning, multiple types of power determine who gets a voice:</p>
            <ul style={ul}>
              <li style={li}><strong>Property power:</strong> Landowners can override everyone through legal rights</li>
              <li style={li}><strong>Economic power:</strong> Developers can override through capital</li>
              <li style={li}><strong>Institutional power:</strong> Local Authorities override through statutory powers</li>
              <li style={li}><strong>Epistemic power:</strong> Professionals control access through technical expertise</li>
            </ul>
            <p style={p}>Within already-excluded communities, majoritarian dynamics further silence disabled people, renters, and minorities.</p>
            <h2 style={h2}>Cardiff context</h2>
            <p style={p}>Cardiff has 28 wards. Six have Community Councils — but even these often offer only tokenistic consultation with no real decision-making power. The other 22 wards have no formal structure at all.</p>
            <p style={p}>The absence of a Community Council does not legally prevent a community from preparing a Place Plan — but it leaves the question of representation unanswered: how can a local authority satisfy itself that a group genuinely represents the neighbourhood, without requiring a new centralised institution?</p>
            <h2 style={h2}>Architecture of Agency</h2>
            <p style={p}>The PhD's central theoretical contribution proposes that spatial, institutional, and technical conditions together produce or foreclose community agency — and that redesigning any one of those three tiers changes who can act, contribute, and be present.</p>
            <p style={p}>Two diagnostic concepts ground the framework: <strong>Traced Absence</strong> — reconstructing from planning records who was systematically not present and what structural conditions produced that non-participation — and <strong>Traced Loss</strong> — what those absences produced: the decisions made, the environments shaped, the places planned without the knowledge of those who were excluded.</p>
            <h2 style={h2}>Research questions</h2>
            <ul style={ul}>
              <li style={li}>How can governance systems engage all stakeholders whilst centring the communities most affected by planning decisions?</li>
              <li style={li}>What mechanisms prevent both institutional capture and majoritarian tyranny in community participation?</li>
              <li style={li}>Can digital technology enable verified community agency without creating new centralisation points?</li>
              <li style={li}>What does Design Justice look like as civic infrastructure?</li>
              <li style={li}>How do we redistribute epistemic authority alongside decision-making power in urban planning?</li>
            </ul>
            <p style={note}>
              PhD Year 1 — Welsh School of Architecture, Cardiff University<br />
              Supervised by Prof. Mhairi McVicar, Dr Neil Turnbull, and Simon Gilbert (Head of Planning, Cardiff Council)
            </p>
          </>
        )

      case 'why-web3':
        return (
          <>
            <p style={p}>This research investigates whether distributed digital technology can help resolve a specific coordination failure in community planning — one where neither side can currently share the information they need without unacceptable privacy risks.</p>
            <h2 style={h2}>The coordination failure</h2>
            <p style={p}>For a community without a Community Council to produce a verified knowledge base for a Place Plan, coordination is needed across residents, community organisations, and the Council. But none of these parties can currently share the necessary information without creating unacceptable privacy or gatekeeping risks.</p>
            <p style={p}>The challenge runs in both directions. Communities cannot submit verified community evidence to the planning authority — but Community Councils and neighbourhood groups also cannot access relevant local authority data in a verified, privacy-respecting way.</p>
            <h2 style={h2}>Why distributed technology</h2>
            <p style={p}>Traditional database systems require someone to own and control the infrastructure. For urban governance, this means replacing Local Authority control with another centralised controller. The power structure doesn't change — it just moves.</p>
            <p style={p}>This research investigates whether technology that runs across a distributed network — where no single person or organisation owns the infrastructure — can support different coordination arrangements: ones where privacy is enforced technically, not merely promised.</p>
            {divider}
            {techLabel}
            <p style={p}>The specific focus is zero-knowledge credentials — a type of cryptographic proof that lets you verify something is true without revealing the underlying information. This means Cardiff Council could receive proof that a knowledge base was produced by a sufficiently representative cross-section of residents, without ever seeing who contributed what.</p>
            <p style={p}>Ethereum is an open-source computing platform that runs on a global network of computers — it is not owned by any single company. It can be used to store attestations publicly and auditably on-chain. Although it is widely known as a platform for digital currency, its infrastructure is investigated here for civic governance purposes, not financial ones.</p>
            <p style={p}>Technology does not solve social and political power problems. Accessibility is a core design requirement, not a footnote. This is why co-design with Splott residents determines the system's parameters — not technical assumptions made in advance.</p>
          </>
        )

      case 'governance':
        return (
          <>
            <p style={p}>This research investigates what governance should look like for community-held data. We don't have all the answers yet — that's what the PhD is here to find out.</p>
            <h2 style={h2}>Website visitor data</h2>
            <p style={p}>This site collects anonymised usage data: which pages you visit, how you navigate, device type, and country only. Cardiff University holds this data temporarily as steward during the PhD research (2025–2028). This is stewardship, not ownership. Upon research completion, governance will transition to community-determined structures.</p>
            <h2 style={h2}>Research data</h2>
            <p style={p}>Data from interviews with communities, planners, and other stakeholders will be governed with recognition of complex and sometimes competing interests. Different stakeholders have legitimate rights — there is no single simple answer.</p>
            <h2 style={h2}>What this research investigates</h2>
            <ul style={ul}>
              <li style={li}>How should multi-party research data be governed?</li>
              <li style={li}>What rights do different stakeholders have?</li>
              <li style={li}>How do you balance transparency with privacy?</li>
              <li style={li}>What does community data sovereignty mean when "community" isn't monolithic?</li>
            </ul>
            <h2 style={h2}>Current commitments</h2>
            <ul style={ul}>
              <li style={li}>Minimal collection — only what is necessary</li>
              <li style={li}>Full transparency about what is collected and why</li>
              <li style={li}>Cardiff University research ethics approval for all data collection</li>
              <li style={li}>Commitment to transition governance to communities post-PhD</li>
            </ul>
          </>
        )

      case 'privacy':
        return (
          <>
            <p style={{ fontSize: '11px', color: subtle, marginBottom: '16px' }}>Last updated: February 2025</p>
            <h2 style={h2}>What this site collects</h2>
            <p style={p}>Anonymised usage data: which pages you visit, how you navigate, device type (mobile/desktop), geographic region (country only). No personal information. No tracking cookies. No identifiable data.</p>
            <h2 style={h2}>Why we collect this</h2>
            <p style={p}>To understand how communities engage with data sovereignty research, and to improve the accessibility of content.</p>
            <h2 style={h2}>Where it is stored</h2>
            <p style={p}>Data is processed by Vercel Inc. under their privacy policy. Vercel Analytics is designed to be GDPR compliant.</p>
            <h2 style={h2}>Your rights</h2>
            <ul style={ul}>
              <li style={li}>Understand what data is collected — documented here</li>
              <li style={li}>Opt out — decline on the entry screen or clear browser data</li>
              <li style={li}>Contact us with questions or concerns</li>
            </ul>
            <p style={{ fontSize: '12px', marginTop: '20px', color: text }}>Contact: Lucy Dunhill — dunhilll@cardiff.ac.uk</p>
          </>
        )

      case 'contact':
        return (
          <>
            <p style={{ ...p, fontWeight: 700 }}>Lucy Dunhill</p>
            <p style={p}>PhD Researcher<br />Welsh School of Architecture, Cardiff University</p>
            <p style={p}><a href="mailto:dunhilll@cardiff.ac.uk" style={{ color: 'inherit', textDecoration: 'underline' }}>dunhilll@cardiff.ac.uk</a></p>
            <p style={p}>Available for meetings in Cardiff and online.</p>
            <div style={{ marginTop: '20px' }}>
              {[
                ['ORCID', 'https://orcid.org/0009-0009-3588-4823'],
                ['Cardiff Profile', 'https://profiles.cardiff.ac.uk/research-staff/dunhilll'],
                ['GitHub', 'https://github.com/Architecture-of-Agency/overview'],
                ['Website', 'https://architectureof.agency'],
              ].map(([label, url]) => (
                <p key={label} style={{ fontSize: '12px', marginBottom: '8px' }}>
                  <strong>{label}:</strong>{' '}
                  <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{url}</a>
                </p>
              ))}
            </div>
          </>
        )

      case 'phd-development':
        return (
          <>
            <p style={{ ...p, fontStyle: 'italic', color: subtle }}>A living record of the PhD's development. Updated as the research progresses.</p>
            <h2 style={h2}>Current stage</h2>
            <p style={p}>PhD Year 1, Welsh School of Architecture, Cardiff University. Currently establishing the theoretical framework, building institutional relationships, and beginning community engagement in Splott.</p>
            <h2 style={h2}>Confirmed partnerships</h2>
            <ul style={ul}>
              <li style={li}>Cardiff Council — Simon Gilbert (Head of Planning) as secondary supervisor</li>
              <li style={li}>AHRC Co-PP project led by Prof. Mhairi McVicar — running May–December 2026 in parallel with the research</li>
            </ul>
            <h2 style={h2}>Reflections and process notes</h2>
            <p style={{ ...p, fontStyle: 'italic', color: subtle }}>[ To be added as the research develops. ]</p>
            <h2 style={h2}>Key decisions</h2>
            <p style={{ ...p, fontStyle: 'italic', color: subtle }}>[ To be added as key decisions are made. ]</p>
          </>
        )

      case 'literature':
        return (
          <>
            <p style={{ ...p, fontStyle: 'italic', color: subtle }}>Organised by theme. Annotations will be expanded as the PhD progresses.</p>
            {[
              {
                theme: 'Planning Theory',
                entries: [
                  { ref: 'Arnstein (1969)', note: 'Foundational framework for participation. Establishes that most community engagement downloads responsibility without redistributing power. Developed by Rosen and Painter (2019) for contemporary planning contexts.' },
                  { ref: 'Rydin (2007)', note: 'Knowledge in planning functions as a contested resource whose legitimacy is socially determined — not a neutral input.' },
                  { ref: 'Miessen (2016)', note: 'Agonistic assembly as an alternative to consensus-based participation. Theoretical foundation for the knowledge base\'s non-consensus, pluralistic architecture.' },
                  { ref: 'Parvin (2021)', note: 'Community-led planning as an unresolved infrastructure problem.' },
                ],
              },
              {
                theme: 'Design Justice and Methodology',
                entries: [
                  { ref: 'Costanza-Chock (2020)', note: 'Umbrella framework for this research. Centres those most affected by design decisions in the design process itself — not as consultants, but as leaders.' },
                  { ref: 'Carroll et al. (2020)', note: 'The CARE Principles for Indigenous Data Governance: Collective Benefit, Authority to Control, Responsibility, Ethics.' },
                ],
              },
              {
                theme: 'Disability and Epistemic Justice',
                entries: [
                  { ref: 'Fricker (2007)', note: 'Hermeneutical injustice — the harm done when someone lacks the conceptual resources to understand their own experience. Central to the requirement that identity infrastructure must not encode existing exclusions.' },
                  { ref: 'Garland-Thomson (2011)', note: 'The misfit concept: the problem is not the body but the built environment that fails to accommodate it.' },
                  { ref: 'Hamraie (2017)', note: 'Critical disability theory applied to design. Design Justice is not accommodation — it is redesign.' },
                  { ref: 'Goodley (2013)', note: 'Critical disability studies framework integrated into the Architecture of Agency theoretical contribution.' },
                ],
              },
              {
                theme: 'Blockchain and Urban Systems',
                entries: [
                  { ref: 'Ietto et al. (2022); Muth et al. (2022); Rabe et al. (2021)', note: 'BBBlockchain Project, Berlin. Most substantive empirical evidence for blockchain in planning contexts — demonstrating both potential and limitations.' },
                  { ref: 'Schneider (2019)', note: 'Decentralisation claims frequently remain structurally incomplete and obscure persistent power asymmetries.' },
                  { ref: 'Lumineau et al. (2021)', note: 'Governance claims require empirical grounding.' },
                ],
              },
              {
                theme: 'Data Sovereignty and Feminism',
                entries: [
                  { ref: 'Haraway (1991)', note: 'Feminist epistemology foundational to the research\'s insistence that knowledge is always produced from a position — and that whose knowledge counts in planning is a political question, not a technical one.' },
                  { ref: 'Plant (1997)', note: 'Cyberfeminism integrated into the theoretical synthesis. Technology as a site of feminist political possibility and risk.' },
                ],
              },
            ].map(({ theme, entries }) => (
              <div key={theme} style={{ marginBottom: '24px' }}>
                <h2 style={h2}>{theme}</h2>
                {entries.map(({ ref, note }) => (
                  <div key={ref} style={{
                    marginBottom: '10px', padding: '10px 12px',
                    background: isDark ? '#222' : '#f8f8f8',
                    borderLeft: `3px solid ${border}`,
                  }}>
                    <p style={{ fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: text }}>{ref}</p>
                    <p style={{ fontSize: '12px', lineHeight: 1.6, color: text }}>{note}</p>
                  </div>
                ))}
              </div>
            ))}
          </>
        )

      case 'splott':
        return (
          <>
            <p style={p}>Splott is an inner-city neighbourhood in Cardiff without a Community Council. It is the identified pilot site for this research — selected because it represents precisely the institutional gap the research is trying to address.</p>
            <h2 style={h2}>Why Splott</h2>
            <p style={p}>An inner-city urban community without the formal institutional infrastructure to participate in the planning decisions that shape where its residents live. The problem is not lack of engagement — it is the absence of a verified mechanism for representation.</p>
            <h2 style={h2}>Current status</h2>
            <p style={p}>Community and civil society relationships have been built over the past twelve months. The research is beginning.</p>
            <p style={{ ...p, fontStyle: 'italic', color: subtle }}>[ Field notes and updates will appear here as the research progresses. ]</p>
          </>
        )

      default:
        return null
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────────

  if (!mounted) return null

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Architecture of Agency | Loading...</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
        </Head>
        <style jsx global>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Space Mono', monospace; background: #000000; overflow: hidden; }
          .boot-screen {
            position: fixed; inset: 0; background: #000000;
            display: flex; flex-direction: column; justify-content: center;
            padding: 60px; animation: fadeIn 0.2s ease-in;
          }
          .boot-line {
            font-size: 13px; color: #00cc00; margin-bottom: 6px;
            animation: blink-in 0.1s ease-in;
            font-family: 'Space Mono', monospace;
          }
          .boot-line.welcome { color: #ffffff; font-weight: 700; font-size: 15px; margin-bottom: 20px; }
          .boot-cursor {
            display: inline-block; width: 8px; height: 14px;
            background: #00cc00; animation: blink 0.8s step-end infinite;
            vertical-align: middle; margin-left: 4px;
          }
          .boot-bar-container {
            width: 300px; height: 16px; background: #111;
            border: 1px solid #00cc00; overflow: hidden; margin-top: 30px;
          }
          .boot-bar-fill {
            height: 100%; background: #00cc00;
            width: 0%; animation: loadingFill 3.5s linear forwards;
          }
          @keyframes loadingFill { 0% { width: 0% } 100% { width: 100% } }
          @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
          @keyframes blink { 50% { opacity: 0 } }
          @keyframes blink-in { from { opacity: 0 } to { opacity: 1 } }
        `}</style>
        <audio ref={audioRef} preload="auto"><source src="/audio/startup.mp3" type="audio/mpeg" /></audio>
        <div className="boot-screen">
          {bootMessages.map((msg, i) => (
            <div key={i} className={`boot-line${msg === 'Welcome.' ? ' welcome' : ''}`}>
              {msg === 'Welcome.' ? '' : '> '}{msg}
            </div>
          ))}
          {bootMessages.length > 0 && <span className="boot-cursor" />}
          <div className="boot-bar-container">
            <div className="boot-bar-fill" />
          </div>
        </div>
      </>
    )
  }

  if (!hasEntered) {
    return (
      <>
        <Head>
          <title>Architecture of Agency</title>
          <meta name="description" content="PhD Research — Welsh School of Architecture, Cardiff University" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
        </Head>
        <style jsx global>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Space Mono', monospace; background: ${isDark ? '#1a1a1a' : '#e6e6e6'}; color: ${text}; display: flex; align-items: center; justify-content: center; min-height: 100vh; line-height: 1.6; }
          button { font-family: 'Space Mono', monospace; }
        `}</style>
        <audio ref={audioRef} preload="auto"><source src="/audio/startup.mp3" type="audio/mpeg" /></audio>
        <main style={{ maxWidth: '600px', padding: '40px', background: surface, border: `2px solid ${border}`, boxShadow: '4px 4px 0 rgba(0,0,0,0.3)', position: 'relative' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>Architecture of Agency</h1>
          <p style={{ fontSize: '12px', textAlign: 'center', marginBottom: '32px', color: subtle }}>PhD Research — Welsh School of Architecture, Cardiff University</p>
          <p style={{ fontSize: '14px', marginBottom: '16px' }}>This site collects anonymised usage data for research purposes:</p>
          <ul style={{ marginLeft: '24px', marginBottom: '16px', fontSize: '14px', listStyle: 'disc' }}>
            {['Which pages you visit', 'How you navigate the site', 'Device type and region (country only)'].map((b, i) => <li key={i} style={{ marginBottom: '8px' }}>{b}</li>)}
          </ul>
          <p style={{ fontSize: '14px', marginBottom: '16px' }}>This helps us understand how communities engage with data sovereignty research.</p>
          <p style={{ fontSize: '14px', marginBottom: '32px', fontWeight: 700 }}>No personal information is collected.</p>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <button onClick={() => handleConsent(true)} style={{ flex: 1, padding: '12px 24px', fontSize: '14px', fontWeight: 700, background: isDark ? '#ffffff' : '#000000', color: isDark ? '#000000' : '#ffffff', border: 'none', cursor: 'pointer', boxShadow: '2px 2px 0 rgba(0,0,0,0.3)' }}>Accept and enter</button>
            <button onClick={() => handleConsent(false)} style={{ flex: 1, padding: '12px 24px', fontSize: '14px', fontWeight: 700, background: surface, color: text, border: `2px solid ${border}`, cursor: 'pointer', boxShadow: '2px 2px 0 rgba(0,0,0,0.3)' }}>Decline and enter</button>
          </div>
          <p style={{ fontSize: '12px', textAlign: 'center', color: subtle }}>
            <a href="#" onClick={(e) => { e.preventDefault(); handleConsent(false); setTimeout(() => openWindow('privacy'), 600) }} style={{ color: 'inherit', textDecoration: 'underline' }}>Read full privacy policy</a>
          </p>
          <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '8px' }}>
            <button onClick={toggleTheme} style={{ padding: '8px 12px', fontSize: '11px', background: surface, color: text, border: `1px solid ${border}`, cursor: 'pointer' }}>{isDark ? '☀' : '☾'}</button>
            <button onClick={() => setLang(lang === 'en' ? 'cy' : 'en')} style={{ padding: '8px 12px', fontSize: '11px', background: surface, color: text, border: `1px solid ${border}`, cursor: 'pointer' }}>{lang === 'en' ? 'CY' : 'EN'}</button>
          </div>
        </main>
      </>
    )
  }

  // Pixel art cursors as SVG data URIs — match the theme
  const C = isDark  // shorthand
  const FILL  = C ? '#e0e0e0' : '#ffffff'
  const MID   = C ? '#aaaaaa' : '#cccccc'
  const DARK  = C ? '#333333' : '#000000'

  // Arrow cursor — classic pixel art arrow pointing top-left
  const cursorArrow = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' shape-rendering='crispEdges'>
    <rect x='0' y='0' width='2' height='12' fill='${DARK}'/>
    <rect x='2' y='2' width='2' height='8' fill='${DARK}'/>
    <rect x='4' y='4' width='2' height='6' fill='${DARK}'/>
    <rect x='6' y='6' width='2' height='4' fill='${DARK}'/>
    <rect x='8' y='8' width='2' height='2' fill='${DARK}'/>
    <rect x='1' y='1' width='1' height='10' fill='${FILL}'/>
    <rect x='3' y='3' width='1' height='6' fill='${FILL}'/>
    <rect x='5' y='5' width='1' height='4' fill='${FILL}'/>
    <rect x='7' y='7' width='1' height='2' fill='${FILL}'/>
    <rect x='2' y='9' width='2' height='2' fill='${FILL}'/>
    <rect x='4' y='7' width='2' height='2' fill='${FILL}'/>
    <rect x='3' y='10' width='1' height='2' fill='${MID}'/>
    <rect x='5' y='8' width='1' height='1' fill='${MID}'/>
  </svg>`)}`

  // Pointer cursor — pointing finger hand
  const cursorPointer = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' shape-rendering='crispEdges'>
    <rect x='4' y='0' width='2' height='8' fill='${DARK}'/>
    <rect x='6' y='0' width='2' height='1' fill='${DARK}'/>
    <rect x='2' y='6' width='2' height='1' fill='${DARK}'/>
    <rect x='8' y='1' width='2' height='7' fill='${DARK}'/>
    <rect x='10' y='3' width='2' height='6' fill='${DARK}'/>
    <rect x='2' y='7' width='10' height='5' fill='${DARK}'/>
    <rect x='2' y='12' width='12' height='2' fill='${DARK}'/>
    <rect x='4' y='14' width='8' height='2' fill='${DARK}'/>
    <rect x='5' y='1' width='1' height='6' fill='${FILL}'/>
    <rect x='7' y='2' width='1' height='5' fill='${FILL}'/>
    <rect x='9' y='4' width='1' height='4' fill='${FILL}'/>
    <rect x='3' y='8' width='8' height='3' fill='${FILL}'/>
    <rect x='3' y='11' width='10' height='1' fill='${MID}'/>
    <rect x='5' y='13' width='6' height='1' fill='${MID}'/>
  </svg>`)}`

  // Grab cursor — open hand
  const cursorGrab = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' shape-rendering='crispEdges'>
    <rect x='2' y='4' width='2' height='6' fill='${DARK}'/>
    <rect x='4' y='2' width='2' height='8' fill='${DARK}'/>
    <rect x='6' y='2' width='2' height='8' fill='${DARK}'/>
    <rect x='8' y='3' width='2' height='7' fill='${DARK}'/>
    <rect x='10' y='4' width='2' height='6' fill='${DARK}'/>
    <rect x='2' y='10' width='12' height='4' fill='${DARK}'/>
    <rect x='2' y='14' width='12' height='1' fill='${DARK}'/>
    <rect x='3' y='5' width='1' height='4' fill='${FILL}'/>
    <rect x='5' y='3' width='1' height='6' fill='${FILL}'/>
    <rect x='7' y='3' width='1' height='6' fill='${FILL}'/>
    <rect x='9' y='4' width='1' height='5' fill='${FILL}'/>
    <rect x='11' y='5' width='1' height='4' fill='${FILL}'/>
    <rect x='3' y='11' width='10' height='2' fill='${FILL}'/>
    <rect x='3' y='13' width='10' height='1' fill='${MID}'/>
  </svg>`)}`

  // Grabbing cursor — closed fist
  const cursorGrabbing = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' shape-rendering='crispEdges'>
    <rect x='2' y='6' width='12' height='6' fill='${DARK}'/>
    <rect x='2' y='5' width='2' height='1' fill='${DARK}'/>
    <rect x='4' y='4' width='6' height='1' fill='${DARK}'/>
    <rect x='10' y='5' width='2' height='1' fill='${DARK}'/>
    <rect x='12' y='6' width='2' height='2' fill='${DARK}'/>
    <rect x='2' y='12' width='12' height='2' fill='${DARK}'/>
    <rect x='4' y='14' width='8' height='1' fill='${DARK}'/>
    <rect x='3' y='7' width='10' height='4' fill='${FILL}'/>
    <rect x='3' y='6' width='9' height='1' fill='${MID}'/>
    <rect x='3' y='11' width='10' height='1' fill='${MID}'/>
    <rect x='3' y='13' width='10' height='1' fill='${MID}'/>
    <rect x='5' y='14' width='6' height='1' fill='${MID}'/>
  </svg>`)}`

  const cursorCSS = {
    default:  `url("${cursorArrow}") 0 0, default`,
    pointer:  `url("${cursorPointer}") 4 0, pointer`,
    grab:     `url("${cursorGrab}") 6 0, grab`,
    grabbing: `url("${cursorGrabbing}") 6 0, grabbing`,
  }

  return (
    <>
      <Head>
        <title>Architecture of Agency</title>
        <meta name="description" content="PhD research — Welsh School of Architecture, Cardiff University" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Space Mono', 'Courier New', monospace;
          background: ${bg}; color: ${text};
          overflow: hidden; height: 100vh;
          cursor: ${cursorCSS[cursorStyle]};
        }
        .desktop {
          height: 100vh; padding: 20px; padding-bottom: 220px;
          position: relative; user-select: none;
          background: ${isDark ? '#0a0a1a' : '#aec6d4'};
          overflow: hidden;
        }
        .desktop::after {
          content: '';
          position: fixed; inset: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, ${isDark ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.04)'} 2px, ${isDark ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.04)'} 4px);
          pointer-events: none; z-index: 9998;
        }
        .skyline {
          position: fixed;
          bottom: 32px; left: 0; right: 0;
          height: 180px;
          pointer-events: none;
          z-index: 1;
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        .desktop-fade-in { animation: fadeIn 0.8s ease-in; }

        .desktop-icon {
          position: absolute; display: flex; flex-direction: column;
          align-items: center; gap: 6px; cursor: ${cursorCSS.pointer};
          padding: 8px; width: ${cs.width}px;
        }
        .desktop-icon.selected {
          background: ${isDark ? 'rgba(100,100,255,0.25)' : 'rgba(0,0,200,0.15)'};
          outline: 1px dotted ${isDark ? '#6666ff' : '#0000cc'};
        }
        .desktop-icon.dragging { opacity: 0.45; }
        .icon-label {
          font-size: ${cs.font}px; text-align: center;
          max-width: ${cs.width}px; line-height: 1.3;
          overflow-wrap: break-word; word-break: keep-all;
          color: ${text};
          text-shadow: ${isDark ? 'none' : '1px 1px 0 rgba(255,255,255,0.7)'};
        }

        .window {
          position: fixed; width: min(680px, 92vw); max-height: 78vh;
          background: ${surface}; border: 2px solid ${border};
          box-shadow: 6px 6px 0 rgba(0,0,0,0.4);
          display: flex; flex-direction: column;
        }
        .window-titlebar {
          background: ${isDark ? '#1a1a1a' : '#000000'}; color: #ffffff;
          padding: 7px 10px; display: flex; justify-content: space-between; align-items: center;
          border-bottom: 2px solid ${border}; cursor: ${cursorCSS.grab}; user-select: none;
        }
        .window-titlebar:active { cursor: ${cursorCSS.grabbing}; }
        .window-title { font-size: 13px; font-weight: 700; }
        .window-close {
          background: #ff4444; border: 1px solid #000; width: 16px; height: 16px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          font-size: 11px; color: #000; font-family: 'Space Mono', monospace; flex-shrink: 0;
        }
        .window-close:hover { background: #ff6666; }
        .window-tabs {
          display: flex; overflow-x: auto; background: var(--tab-bg);
          border-bottom: 1px solid var(--border); scrollbar-width: none;
        }
        .window-tabs::-webkit-scrollbar { display: none; }
        .window-tab {
          padding: 4px 10px; font-family: 'Space Mono', monospace; font-size: 10px;
          background: transparent; border: none; border-right: 1px solid var(--border);
          color: var(--subtle); cursor: pointer; white-space: nowrap; flex-shrink: 0;
        }
        .window-tab:hover { color: var(--text); }
        .window-tab.active { font-weight: 700; color: var(--text); }
        .window-minimise {
          background: #ffaa00; border: 1px solid #000; width: 16px; height: 16px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          font-size: 14px; line-height: 1; color: #000; font-family: 'Space Mono', monospace;
        }
        .window-minimise:hover { background: #ffcc44; }
        .minimised-slot {
          padding: 2px 8px; font-family: 'Space Mono', monospace; font-size: 10px; font-weight: 700;
          background: var(--surface); border: 1px solid var(--border);
          color: var(--text); cursor: pointer; height: 22px;
          max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .minimised-slot:hover { opacity: 0.8; }
        .window-content { padding: 20px 24px; overflow-y: auto; flex: 1; }
        .window-content::-webkit-scrollbar { width: 12px; }
        .window-content::-webkit-scrollbar-track { background: ${isDark ? '#1a1a1a' : '#ddd'}; border-left: 1px solid ${border}; }
        .window-content::-webkit-scrollbar-thumb { background: ${isDark ? '#555' : '#999'}; border: 1px solid ${border}; }

        .menubar {
          position: fixed; bottom: 0; left: 0; right: 0; height: 32px;
          background: ${isDark ? '#2a2a2a' : '#dddddd'};
          border-top: 1px solid ${border};
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 8px; font-size: 12px; z-index: 9999;
          box-shadow: 0 -1px 0 ${isDark ? '#1a1a1a' : '#ffffff'};
        }
        .menubar-left { display: flex; align-items: center; gap: 8px; }
        .menubar-right { display: flex; align-items: center; gap: 8px; }
        .menu-btn {
          display: flex; align-items: center; padding: 3px 10px;
          background: ${isDark ? '#3a3a3a' : '#e0e0e0'};
          border: 2px solid ${isDark ? '#555' : '#999'};
          font-family: 'Space Mono', monospace; font-size: 12px; font-weight: 700;
          color: ${text}; cursor: pointer; height: 24px; border-radius: 2px;
        }
        .menu-btn:hover { background: ${isDark ? '#4a4a4a' : '#d0d0d0'}; border-color: ${border}; }
        .menu-btn.open { background: ${isDark ? '#0000ff' : '#000000'}; color: #ffffff; border-color: ${isDark ? '#0000ff' : '#000000'}; }
        .apple-menu {
          position: fixed; bottom: 34px; left: 8px;
          background: ${surface}; border: 1px solid ${border};
          box-shadow: 0 -2px 8px rgba(0,0,0,0.3); min-width: 220px; z-index: 10000;
        }
        .apple-menu-item {
          display: block; width: 100%; padding: 7px 18px;
          background: transparent; border: none; text-align: left;
          font-family: 'Space Mono', monospace; font-size: 12px; color: ${text}; cursor: pointer;
        }
        .apple-menu-item:hover { background: ${isDark ? '#0000ff' : '#000000'}; color: #ffffff; }
        .apple-menu-sep { height: 1px; background: ${isDark ? '#555' : '#999'}; margin: 4px 0; }
        .clock { font-size: 12px; font-weight: 700; color: ${text}; padding: 0 8px; border-left: 1px solid ${isDark ? '#555' : '#999'}; margin-left: 4px; }
        .size-btn {
          padding: 2px 7px; background: ${isDark ? '#3a3a3a' : '#e0e0e0'};
          border: 1px solid ${isDark ? '#555' : '#999'};
          font-family: 'Space Mono', monospace; font-size: 11px; font-weight: 700;
          color: ${text}; cursor: pointer;
        }
        .size-btn:hover { background: ${isDark ? '#4a4a4a' : '#d0d0d0'}; }
        .size-btn.active { background: ${isDark ? '#0000ff' : '#000000'}; color: #ffffff; border-color: ${isDark ? '#0000ff' : '#000000'}; }
        .cursor-dot {
          position: fixed; width: 8px; height: 8px;
          background: ${isDark ? '#ffffff' : '#000000'};
          pointer-events: none; z-index: 9997;
          animation: dotFade 0.6s linear forwards;
          image-rendering: pixelated;
        }
        @keyframes dotFade { 0% { opacity: 0.9; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } 100% { opacity: 0; transform: scale(0.4); } }
        .drag-shadow {
          position: fixed; width: ${cs.icon}px; height: ${cs.icon}px;
          background: rgba(0,0,0,0.15); border: 2px dashed ${isDark ? '#888' : '#555'};
          pointer-events: none; z-index: 9996; transform: translate(-50%, -50%);
        }
        @media (max-width: 768px) {
          .menubar { font-size: 11px; padding: 0 4px; }
          .menu-btn { font-size: 11px; padding: 2px 8px; }
          .clock { font-size: 11px; }
        }
      `}</style>

      <audio ref={audioRef} preload="auto"><source src="/audio/startup.mp3" type="audio/mpeg" /></audio>

      {/* Splott streetscape — animated pixel art banner */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes walkR { from { transform: translateX(-80px) } to { transform: translateX(1280px) } }
        @keyframes walkL { from { transform: translateX(1280px) } to { transform: translateX(-80px) } }
        @keyframes busR  { from { transform: translateX(-200px) } to { transform: translateX(1400px) } }
        @keyframes busL  { from { transform: translateX(1400px) } to { transform: translateX(-200px) } }
        .walk-r { animation: walkR linear infinite; }
        .walk-l { animation: walkL linear infinite; }
        .bus-r   { animation: busR linear infinite; }
        .bus-l   { animation: busL linear infinite; }
      `}} />
      <div className="skyline" aria-hidden="true" style={{ overflow: 'hidden' }}>
        <svg width="100%" height="180" viewBox="0 0 1200 180"
          preserveAspectRatio="xMidYMax meet" shapeRendering="crispEdges"
          style={{ display: 'block', overflow: 'visible' }}>

          {/* ── Sky ── */}
          <rect x="0" y="0"   width="1200" height="180" fill={isDark?'#0a0a1a':'#c8dde8'}/>
          <rect x="0" y="0"   width="1200" height="60"  fill={isDark?'#080812':'#aec6d4'}/>
          <rect x="0" y="60"  width="1200" height="40"  fill={isDark?'#0a0a1a':'#bcd5e2'}/>

          {/* ── Ground plane — everything sits on y=130 ── */}
          {/* Pavement */}
          <rect x="0"   y="130" width="1200" height="6"  fill={isDark?'#2a2a2a':'#999999'}/>
          <rect x="0"   y="136" width="1200" height="2"  fill={isDark?'#333':'#aaa'}/>
          {/* Road */}
          <rect x="0"   y="138" width="1200" height="28" fill={isDark?'#1a1a1a':'#555555'}/>
          {/* Road centre line dashes */}
          {Array.from({length:24},(_,i)=>(
            <rect key={i} x={i*52} y="151" width="32" height="3" fill={isDark?'#444':'#777'}/>
          ))}
          {/* Kerb line */}
          <rect x="0"   y="130" width="1200" height="2"  fill={isDark?'#555':'#bbbbbb'}/>
          <rect x="0"   y="136" width="1200" height="2"  fill={isDark?'#222':'#888'}/>

          {/* ── FAR LEFT: Park / green space ── */}
          {/* Grass */}
          <rect x="0"   y="100" width="90"  height="30" fill={isDark?'#1a2a1a':'#559955'}/>
          <rect x="0"   y="96"  width="90"  height="4"  fill={isDark?'#2a3a2a':'#66aa66'}/>
          {/* Park fence */}
          {Array.from({length:9},(_,i)=>(
            <g key={i}>
              <rect x={i*10+2} y="116" width="2" height="14" fill={isDark?'#4a3a2a':'#886644'}/>
              <rect x={i*10+2} y="115" width="8" height="2"  fill={isDark?'#6a5a3a':'#aa8855'}/>
            </g>
          ))}
          {/* Park trees */}
          <rect x="10"  y="88"  width="18" height="28" fill={isDark?'#1a3a1a':'#4a8a4a'}/>
          <rect x="10"  y="88"  width="8"  height="14" fill={isDark?'#2a4a2a':'#5a9a5a'}/>
          <rect x="8"   y="115" width="5"  height="15" fill={isDark?'#3a2a1a':'#664422'}/>
          <rect x="50"  y="92"  width="22" height="24" fill={isDark?'#1a3a1a':'#4a8a4a'}/>
          <rect x="50"  y="92"  width="10" height="12" fill={isDark?'#2a4a2a':'#5a9a5a'}/>
          <rect x="57"  y="115" width="5"  height="15" fill={isDark?'#3a2a1a':'#664422'}/>
          {/* Park bench */}
          <rect x="30"  y="120" width="18" height="3"  fill={isDark?'#6a5a3a':'#aa8855'}/>
          <rect x="31"  y="123" width="2"  height="7"  fill={isDark?'#4a3a2a':'#886644'}/>
          <rect x="45"  y="123" width="2"  height="7"  fill={isDark?'#4a3a2a':'#886644'}/>

          {/* ── LEFT TERRACES ── */}
          {/* Terrace row 1 */}
          <rect x="90"  y="72"  width="120" height="58" fill={isDark?'#3a2a1a':'#bb9977'}/>
          <rect x="90"  y="72"  width="120" height="4"  fill={isDark?'#2a1a0a':'#997755'}/>
          {/* Bay windows */}
          {[95,109,123,137,151,165,179,193].map(x=>(
            <g key={x}>
              <rect x={x} y="82" width="9" height="11" fill={isDark?'#223344':'#88aacc'}/>
              <rect x={x} y="99" width="9" height="11" fill={isDark?'#223344':'#88aacc'}/>
              <rect x={x+4} y="82" width="1" height="11" fill={isDark?'#111':'#5577aa'}/>
              <rect x={x+4} y="99" width="1" height="11" fill={isDark?'#111':'#5577aa'}/>
              <rect x={x}   y="92" width="9" height="1"  fill={isDark?'#111':'#5577aa'}/>
              <rect x={x}   y="109" width="9" height="1" fill={isDark?'#111':'#5577aa'}/>
            </g>
          ))}
          {/* Chimneys */}
          {[95,130,165,198].map(x=>(
            <rect key={x} x={x} y="60" width="8" height="12" fill={isDark?'#3a2a1a':'#997755'}/>
          ))}
          {/* Chimney pots */}
          {[95,130,165,198].map(x=>(
            <rect key={x} x={x+2} y="57" width="4" height="4" fill={isDark?'#555':'#777'}/>
          ))}
          {/* Party walls */}
          {[104,119,134,149,164,179,194].map(x=>(
            <rect key={x} x={x} y="72" width="2" height="58" fill={isDark?'#2a1a0a':'#997755'}/>
          ))}
          {/* Doors */}
          {[97,127,157,187].map(x=>(
            <g key={x}>
              <rect x={x}   y="112" width="10" height="18" fill={isDark?'#3355aa':'#4466bb'}/>
              <rect x={x+2} y="114" width="3"  height="5"  fill={isDark?'#4477cc':'#6688dd'}/>
              <rect x={x+6} y="114" width="3"  height="5"  fill={isDark?'#4477cc':'#6688dd'}/>
            </g>
          ))}

          {/* ── SCV CHARITY SHOP ── */}
          <rect x="210" y="78"  width="85"  height="52" fill={isDark?'#2a2a3a':'#cc4444'}/>
          <rect x="210" y="78"  width="85"  height="6"  fill={isDark?'#1a1a2a':'#aa2222'}/>
          {/* Awning — sits at pavement level y=114 */}
          <rect x="208" y="114" width="89"  height="10" fill={isDark?'#4a3a1a':'#ffcc00'}/>
          {Array.from({length:11},(_,i)=>(
            <rect key={i} x={208+i*8} y="114" width="4" height="10" fill={isDark?'#3a2a0a':'#cc9900'}/>
          ))}
          {/* Shop window */}
          <rect x="218" y="90"  width="65"  height="22" fill={isDark?'#334455':'#aaccee'}/>
          <rect x="238" y="90"  width="2"   height="22" fill={isDark?'#223':'#7799bb'}/>
          <rect x="258" y="90"  width="2"   height="22" fill={isDark?'#223':'#7799bb'}/>
          {/* Sign */}
          <rect x="212" y="80"  width="81"  height="10" fill={isDark?'#ffffff':'#ffffff'}/>
          <text x="215" y="89" fontFamily="Space Mono, monospace" fontSize="7" fontWeight="700" fill="#cc4444">SCV CHARITY SHOP</text>
          {/* Door at ground y=114 */}
          <rect x="245" y="114" width="14"  height="16" fill={isDark?'#334455':'#6688aa'}/>
          <rect x="247" y="116" width="4"   height="6"  fill={isDark?'#445566':'#88aacc'}/>
          <rect x="253" y="116" width="4"   height="6"  fill={isDark?'#445566':'#88aacc'}/>
          {/* Chimney */}
          <rect x="245" y="66"  width="8"   height="12" fill={isDark?'#3a2a1a':'#997755'}/>

          {/* ── CORNER SHOP ── */}
          <rect x="295" y="82"  width="65"  height="48" fill={isDark?'#1a3a1a':'#559944'}/>
          <rect x="295" y="82"  width="65"  height="5"  fill={isDark?'#0a2a0a':'#336633'}/>
          {/* Awning at y=114 */}
          <rect x="293" y="114" width="69"  height="8"  fill={isDark?'#3a5a3a':'#66aa44'}/>
          {/* Window */}
          <rect x="300" y="90"  width="55"  height="22" fill={isDark?'#334455':'#aaccee'}/>
          <rect x="325" y="90"  width="2"   height="22" fill={isDark?'#223':'#7799bb'}/>
          {/* Sign */}
          <rect x="297" y="84"  width="61"  height="8"  fill="#fff"}/>
          <text x="300" y="91" fontFamily="Space Mono, monospace" fontSize="6" fontWeight="700" fill="#336633">CORNER SHOP</text>
          {/* Door */}
          <rect x="315" y="114" width="12"  height="16" fill={isDark?'#334455':'#6688aa'}/>

          {/* ── STREET LAMP 1 — base on y=130 ── */}
          <rect x="375" y="70"  width="4"   height="60" fill={isDark?'#555':'#888'}/>
          <rect x="369" y="70"  width="16"  height="4"  fill={isDark?'#555':'#888'}/>
          <rect x="369" y="66"  width="16"  height="4"  fill={isDark?'#ffeeaa':'#ffffcc'}/>
          <rect x="373" y="126" width="6"   height="4"  fill={isDark?'#444':'#777'}/>

          {/* ── SPLOTT MAGIC ROUNDABOUT — centrepiece ── */}
          {/* Road around roundabout */}
          <rect x="390" y="130" width="290" height="36" fill={isDark?'#1a1a1a':'#555555'}/>
          {/* Island — green oval, fully above ground */}
          <rect x="440" y="94"  width="180" height="4"  fill={isDark?'#1a3a1a':'#4a8a4a'}/>
          <rect x="426" y="98"  width="208" height="4"  fill={isDark?'#1a3a1a':'#4a8a4a'}/>
          <rect x="416" y="102" width="228" height="28" fill={isDark?'#1a3a1a':'#5a9a5a'}/>
          <rect x="416" y="102" width="228" height="6"  fill={isDark?'#2a4a2a':'#6aaa6a'}/>
          <rect x="416" y="128" width="228" height="2"  fill={isDark?'#1a3a1a':'#4a8a4a'}/>
          <rect x="426" y="130" width="208" height="2"  fill={isDark?'#1a2a1a':'#3a7a3a'}/>
          {/* Kerb */}
          <rect x="438" y="92"  width="184" height="4"  fill={isDark?'#444':'#aaa'}/>
          <rect x="414" y="130" width="232" height="2"  fill={isDark?'#444':'#aaa'}/>
          {/* Roundabout sculptures */}
          {/* 1 — chevron cylinder */}
          <rect x="455" y="96"  width="22"  height="22" fill="#cc2222"/>
          {[96,99,102,105,108,111,114].map((y,i)=>(
            <rect key={y} x="455" y={y} width="22" height="2" fill={i%2===0?'#cc2222':'#111111'}/>
          ))}
          <rect x="453" y="96"  width="26"  height="2"  fill={isDark?'#888':'#aaa'}/>
          {/* 2 — tilted warning sign */}
          <rect x="490" y="91"  width="26"  height="26" fill="#ffcc00"/>
          <rect x="490" y="91"  width="26"  height="3"  fill="#cc9900"/>
          <rect x="490" y="91"  width="3"   height="26" fill="#cc9900"/>
          <rect x="500" y="95"  width="4"   height="12" fill="#000"/>
          <rect x="500" y="109" width="4"   height="4"  fill="#000"/>
          {/* 3 — triangle stack */}
          <rect x="528" y="110" width="30"  height="4"  fill="#dd4444"/>
          <rect x="532" y="106" width="22"  height="4"  fill="#cc3333"/>
          <rect x="536" y="102" width="14"  height="4"  fill="#bb2222"/>
          <rect x="540" y="98"  width="6"   height="4"  fill="#aa1111"/>
          {[528,532,536].map(x=>(
            <rect key={x} x={x+2} y="110" width="4" height="4" fill="#ffffff"/>
          ))}
          {/* 4 — sphere of signs */}
          <rect x="568" y="96"  width="30"  height="30" fill="#3355aa"/>
          <rect x="568" y="96"  width="30"  height="5"  fill="#5577cc"/>
          <rect x="568" y="96"  width="5"   height="30" fill="#5577cc"/>
          {[[572,100,'#cc2222'],[580,100,'#22aa22'],[588,100,'#ffcc00'],
            [572,108,'#22aa22'],[580,108,'#3355aa'],[588,108,'#cc2222'],
            [572,116,'#ffcc00'],[580,116,'#cc2222'],[588,116,'#22aa22']].map(([x,y,c],i)=>(
            <rect key={i} x={x as number} y={y as number} width="6" height="6" fill={c as string}/>
          ))}
          {/* Small bush shapes on island */}
          {[430,610].map(x=>(
            <g key={x}>
              <rect x={x}   y="114" width="14" height="14" fill={isDark?'#1a3a1a':'#4a7a4a'}/>
              <rect x={x}   y="114" width="6"  height="7"  fill={isDark?'#2a4a2a':'#5a8a5a'}/>
              <rect x={x+3} y="127" width="6"  height="3"  fill={isDark?'#3a2a1a':'#664422'}/>
            </g>
          ))}

          {/* ── TERRACE ROW 2 — right of roundabout ── */}
          <rect x="690" y="76"  width="100" height="54" fill={isDark?'#3a2a1a':'#bb9977'}/>
          <rect x="690" y="76"  width="100" height="4"  fill={isDark?'#2a1a0a':'#997755'}/>
          {[695,709,723,737,751,765,779].map(x=>(
            <g key={x}>
              <rect x={x} y="86" width="9" height="11" fill={isDark?'#223344':'#88aacc'}/>
              <rect x={x} y="103" width="9" height="11" fill={isDark?'#223344':'#88aacc'}/>
              <rect x={x+4} y="86" width="1" height="11" fill={isDark?'#111':'#5577aa'}/>
              <rect x={x+4} y="103" width="1" height="11" fill={isDark?'#111':'#5577aa'}/>
            </g>
          ))}
          {[695,725,755,780].map(x=>(
            <rect key={x} x={x} y="64" width="8" height="12" fill={isDark?'#3a2a1a':'#997755'}/>
          ))}
          {[704,719,734,749,764,779].map(x=>(
            <rect key={x} x={x} y="76" width="2" height="54" fill={isDark?'#2a1a0a':'#997755'}/>
          ))}
          {[697,727,757].map(x=>(
            <g key={x}>
              <rect x={x}   y="114" width="10" height="16" fill={isDark?'#3355aa':'#4466bb'}/>
              <rect x={x+2} y="116" width="3"  height="5"  fill={isDark?'#4477cc':'#6688dd'}/>
              <rect x={x+6} y="116" width="3"  height="5"  fill={isDark?'#4477cc':'#6688dd'}/>
            </g>
          ))}

          {/* ── AoA BILLBOARD — sits on ground with legs ── */}
          {/* Legs from y=130 up */}
          <rect x="810" y="100" width="5"   height="30" fill={isDark?'#555':'#886633'}/>
          <rect x="855" y="100" width="5"   height="30" fill={isDark?'#444':'#775522'}/>
          {/* Hoarding frame */}
          <rect x="802" y="66"  width="66"  height="36" fill={isDark?'#3a3a1a':'#ccbb88'}/>
          <rect x="802" y="66"  width="66"  height="3"  fill={isDark?'#2a2a0a':'#aa9966'}/>
          <rect x="802" y="66"  width="3"   height="36" fill={isDark?'#2a2a0a':'#aa9966'}/>
          <rect x="865" y="66"  width="3"   height="36" fill={isDark?'#111':'#998855'}/>
          {/* Billboard face */}
          <rect x="805" y="69"  width="60"  height="30" fill={isDark?'#111122':'#f5f0e8'}/>
          <text x="810" y="82" fontFamily="Space Mono, monospace" fontSize="7" fontWeight="700"
            fill={isDark?'#ffffff':'#000000'}>Architecture</text>
          <text x="816" y="93" fontFamily="Space Mono, monospace" fontSize="7" fontWeight="700"
            fill={isDark?'#ffffff':'#000000'}>of Agency</text>

          {/* ── STREET LAMP 2 — base on y=130 ── */}
          <rect x="880" y="70"  width="4"   height="60" fill={isDark?'#555':'#888'}/>
          <rect x="874" y="70"  width="16"  height="4"  fill={isDark?'#555':'#888'}/>
          <rect x="874" y="66"  width="16"  height="4"  fill={isDark?'#ffeeaa':'#ffffcc'}/>
          <rect x="878" y="126" width="6"   height="4"  fill={isDark?'#444':'#777'}/>

          {/* ── STAR CENTRE ── */}
          {/* Main brick block */}
          <rect x="920" y="58"  width="190" height="72" fill={isDark?'#3a2a1a':'#bb8855'}/>
          <rect x="920" y="58"  width="190" height="6"  fill={isDark?'#2a1a0a':'#996633'}/>
          {/* Brick courses */}
          {[110,116,122].map(y=>(
            <rect key={y} x="920" y={y} width="190" height="1" fill={isDark?'#2a1a0a':'#996633'}/>
          ))}
          {/* Metal cladding over large windows */}
          <rect x="960" y="66"  width="110" height="28" fill={isDark?'#334455':'#667788'}/>
          <rect x="960" y="66"  width="110" height="3"  fill={isDark?'#445566':'#7788aa'}/>
          {/* Window grid */}
          {[963,978,993,1008,1023,1038,1053].map(x=>(
            <g key={x}>
              <rect x={x} y="70" width="12" height="20" fill={isDark?'#223344':'#88aabb'}/>
              <rect x={x+6} y="70" width="1" height="20" fill={isDark?'#111':'#667788'}/>
              <rect x={x} y="80" width="12" height="1"   fill={isDark?'#111':'#667788'}/>
            </g>
          ))}
          {/* STAR lettering */}
          <text x="926" y="108" fontFamily="Space Mono, monospace" fontSize="18" fontWeight="700"
            fill={isDark?'#888':'#ccaa88'} letterSpacing="4">STAR</text>
          {/* Canopy entrance — base on y=130 */}
          <rect x="1072" y="100" width="38"  height="6"  fill={isDark?'#445566':'#7799aa'}/>
          <rect x="1072" y="100" width="38"  height="2"  fill={isDark?'#556677':'#88aacc'}/>
          <rect x="1074" y="106" width="5"   height="24" fill={isDark?'#334455':'#5577aa'}/>
          <rect x="1102" y="106" width="5"   height="24" fill={isDark?'#334455':'#5577aa'}/>
          {/* Entrance sign */}
          <rect x="1074" y="90"  width="36"  height="10" fill="#fff"/>
          <text x="1076" y="99" fontFamily="Space Mono, monospace" fontSize="5" fontWeight="700" fill="#bb3333">Splott STAR Centre</text>
          {/* Entrance door */}
          <rect x="1082" y="114" width="16"  height="16" fill={isDark?'#334455':'#aaccdd'}/>
          <rect x="1084" y="116" width="5"   height="7"  fill={isDark?'#556677':'#88aacc'}/>
          <rect x="1091" y="116" width="5"   height="7"  fill={isDark?'#556677':'#88aacc'}/>

          {/* ── RIGHT TERRACES ── */}
          <rect x="1115" y="74"  width="85"  height="56" fill={isDark?'#3a2a1a':'#aa8866'}/>
          <rect x="1115" y="74"  width="85"  height="4"  fill={isDark?'#2a1a0a':'#886644'}/>
          {[1120,1134,1148,1162,1176].map(x=>(
            <g key={x}>
              <rect x={x} y="84" width="9" height="11" fill={isDark?'#223344':'#88aacc'}/>
              <rect x={x} y="101" width="9" height="11" fill={isDark?'#223344':'#88aacc'}/>
              <rect x={x+4} y="84" width="1" height="11" fill={isDark?'#111':'#5577aa'}/>
              <rect x={x+4} y="101" width="1" height="11" fill={isDark?'#111':'#5577aa'}/>
            </g>
          ))}
          {[1120,1150,1178].map(x=>(
            <rect key={x} x={x} y="62" width="8" height="12" fill={isDark?'#3a2a1a':'#997755'}/>
          ))}
          {[1133,1147,1161,1175].map(x=>(
            <rect key={x} x={x} y="74" width="2" height="56" fill={isDark?'#2a1a0a':'#886644'}/>
          ))}
          {[1122,1152].map(x=>(
            <g key={x}>
              <rect x={x}   y="115" width="10" height="15" fill={isDark?'#3355aa':'#4466bb'}/>
              <rect x={x+2} y="117" width="3"  height="5"  fill={isDark?'#4477cc':'#6688dd'}/>
              <rect x={x+6} y="117" width="3"  height="5"  fill={isDark?'#4477cc':'#6688dd'}/>
            </g>
          ))}

          {/* ── STREET LAMP 3 ── */}
          <rect x="1105" y="72"  width="4"   height="58" fill={isDark?'#555':'#888'}/>
          <rect x="1099" y="72"  width="16"  height="4"  fill={isDark?'#555':'#888'}/>
          <rect x="1099" y="68"  width="16"  height="4"  fill={isDark?'#ffeeaa':'#ffffcc'}/>
          <rect x="1103" y="126" width="6"   height="4"  fill={isDark?'#444':'#777'}/>
        </svg>

        {/* ── ANIMATED ELEMENTS — positioned over SVG ── */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>

          {/* Cardiff Bus going RIGHT — red double decker */}
          <div className="bus-r" style={{ position: 'absolute', bottom: '10px', animationDuration: '22s', animationDelay: '0s' }}>
            <svg width="120" height="52" viewBox="0 0 120 52" shapeRendering="crispEdges">
              {/* Body */}
              <rect x="2"  y="4"  width="112" height="38" fill="#cc2222"/>
              <rect x="2"  y="4"  width="112" height="6"  fill="#dd3333"/>
              <rect x="2"  y="38" width="112" height="4"  fill="#aa1111"/>
              <rect x="2"  y="4"  width="4"   height="38" fill="#dd3333"/>
              <rect x="110" y="4" width="4"   height="38" fill="#aa1111"/>
              {/* Destination board */}
              <rect x="8"  y="6"  width="80"  height="8"  fill="#ffffff"/>
              <text x="12" y="13" fontFamily="Space Mono, monospace" fontSize="5" fill="#cc2222">SPLOTT  Cardiff Bus</text>
              {/* Upper deck windows */}
              {[8,28,48,68,88].map(x=>(
                <rect key={x} x={x} y="16" width="16" height="10" fill={isDark?'#334455':'#aaccee'}/>
              ))}
              {/* Lower deck windows */}
              {[8,28,48,68,88].map(x=>(
                <rect key={x+1} x={x} y="28" width="16" height="8" fill={isDark?'#334455':'#aaccee'}/>
              ))}
              {/* Headlights — glow in dark mode */}
              <rect x="106" y="30" width="8" height="6" fill={isDark?'#ffff88':'#ffff44'}/>
              {isDark && <rect x="108" y="29" width="6" height="8" fill="#ffff88" opacity="0.5"/>}
              {/* Rear light */}
              <rect x="2"  y="30" width="6"  height="6"  fill="#ff4444"/>
              {/* Wheels */}
              <rect x="12"  y="42" width="20" height="10" fill="#222"/>
              <rect x="16"  y="44" width="12" height="6"  fill="#444"/>
              <rect x="85"  y="42" width="20" height="10" fill="#222"/>
              <rect x="89"  y="44" width="12" height="6"  fill="#444"/>
            </svg>
          </div>

          {/* Cardiff Bus going LEFT */}
          <div className="bus-l" style={{ position: 'absolute', bottom: '10px', animationDuration: '28s', animationDelay: '-14s' }}>
            <svg width="120" height="52" viewBox="0 0 120 52" shapeRendering="crispEdges" style={{ transform: 'scaleX(-1)' }}>
              <rect x="2"  y="4"  width="112" height="38" fill="#cc2222"/>
              <rect x="2"  y="4"  width="112" height="6"  fill="#dd3333"/>
              <rect x="2"  y="38" width="112" height="4"  fill="#aa1111"/>
              <rect x="2"  y="4"  width="4"   height="38" fill="#dd3333"/>
              <rect x="110" y="4" width="4"   height="38" fill="#aa1111"/>
              <rect x="8"  y="6"  width="80"  height="8"  fill="#ffffff"/>
              <text x="12" y="13" fontFamily="Space Mono, monospace" fontSize="5" fill="#cc2222">CARDIFF BAY  Bus</text>
              {[8,28,48,68,88].map(x=>(
                <rect key={x} x={x} y="16" width="16" height="10" fill={isDark?'#334455':'#aaccee'}/>
              ))}
              {[8,28,48,68,88].map(x=>(
                <rect key={x+1} x={x} y="28" width="16" height="8" fill={isDark?'#334455':'#aaccee'}/>
              ))}
              <rect x="106" y="30" width="8" height="6" fill={isDark?'#ffff88':'#ffff44'}/>
              {isDark && <rect x="108" y="29" width="6" height="8" fill="#ffff88" opacity="0.5"/>}
              <rect x="2"  y="30" width="6"  height="6"  fill="#ff4444"/>
              <rect x="12"  y="42" width="20" height="10" fill="#222"/>
              <rect x="16"  y="44" width="12" height="6"  fill="#444"/>
              <rect x="85"  y="42" width="20" height="10" fill="#222"/>
              <rect x="89"  y="44" width="12" height="6"  fill="#444"/>
            </svg>
          </div>

          {/* Person 1 walking right — dog walker */}
          <div className="walk-r" style={{ position: 'absolute', bottom: '52px', animationDuration: '35s', animationDelay: '-5s' }}>
            <svg width="40" height="28" viewBox="0 0 40 28" shapeRendering="crispEdges">
              <rect x="14" y="2"  width="5" height="5" fill={isDark?'#ddbb88':'#eeccaa'}/>
              <rect x="13" y="7"  width="7" height="10" fill={isDark?'#4466aa':'#5577bb'}/>
              <rect x="13" y="17" width="3" height="7"  fill={isDark?'#226688':'#3377aa'}/>
              <rect x="17" y="17" width="3" height="7"  fill={isDark?'#226688':'#3377aa'}/>
              <rect x="9"  y="18" width="7" height="4"  fill={isDark?'#884422':'#aa6633'}/>
              <rect x="7"  y="16" width="5" height="3"  fill={isDark?'#884422':'#aa6633'}/>
              <rect x="15" y="11" width="1" height="7"  fill={isDark?'#555':'#888'}/>
              <rect x="9"  y="11" width="7" height="1"  fill={isDark?'#555':'#888'}/>
            </svg>
          </div>

          {/* Person 2 walking right */}
          <div className="walk-r" style={{ position: 'absolute', bottom: '52px', animationDuration: '40s', animationDelay: '-20s' }}>
            <svg width="20" height="28" viewBox="0 0 20 28" shapeRendering="crispEdges">
              <rect x="7"  y="2"  width="5" height="5" fill={isDark?'#ddbb88':'#eeccaa'}/>
              <rect x="6"  y="7"  width="7" height="10" fill={isDark?'#cc4422':'#dd5533'}/>
              <rect x="6"  y="17" width="3" height="7"  fill={isDark?'#226688':'#3377aa'}/>
              <rect x="10" y="17" width="3" height="7"  fill={isDark?'#226688':'#3377aa'}/>
            </svg>
          </div>

          {/* Person 3 walking left */}
          <div className="walk-l" style={{ position: 'absolute', bottom: '52px', animationDuration: '38s', animationDelay: '-10s' }}>
            <svg width="20" height="28" viewBox="0 0 20 28" shapeRendering="crispEdges">
              <rect x="7"  y="2"  width="5" height="5" fill={isDark?'#ddbb88':'#eeccaa'}/>
              <rect x="6"  y="7"  width="7" height="10" fill={isDark?'#448844':'#559955'}/>
              <rect x="6"  y="17" width="3" height="7"  fill={isDark?'#334':'#445'}/>
              <rect x="10" y="17" width="3" height="7"  fill={isDark?'#334':'#445'}/>
            </svg>
          </div>

          {/* Wheelchair user going right */}
          <div className="walk-r" style={{ position: 'absolute', bottom: '52px', animationDuration: '45s', animationDelay: '-30s' }}>
            <svg width="36" height="28" viewBox="0 0 36 28" shapeRendering="crispEdges">
              {/* Person */}
              <rect x="6"  y="2"  width="5" height="5" fill={isDark?'#ddbb88':'#eeccaa'}/>
              <rect x="5"  y="7"  width="7" height="8"  fill={isDark?'#4466cc':'#5577dd'}/>
              {/* Wheelchair frame */}
              <rect x="4"  y="15" width="18" height="2"  fill={isDark?'#888':'#aaa'}/>
              <rect x="4"  y="12" width="2"  height="5"  fill={isDark?'#888':'#aaa'}/>
              <rect x="20" y="12" width="2"  height="5"  fill={isDark?'#888':'#aaa'}/>
              {/* Wheels */}
              <rect x="2"  y="17" width="10" height="10" fill="none"/>
              <rect x="3"  y="18" width="8"  height="8"  fill={isDark?'#555':'#777'}/>
              <rect x="4"  y="19" width="6"  height="6"  fill={isDark?'#333':'#aaa'}/>
              <rect x="18" y="18" width="8"  height="8"  fill={isDark?'#555':'#777'}/>
              <rect x="19" y="19" width="6"  height="6"  fill={isDark?'#333':'#aaa'}/>
              {/* Small front wheel */}
              <rect x="22" y="22" width="4"  height="4"  fill={isDark?'#555':'#777'}/>
            </svg>
          </div>

          {/* Cyclist going left */}
          <div className="walk-l" style={{ position: 'absolute', bottom: '52px', animationDuration: '18s', animationDelay: '-8s' }}>
            <svg width="36" height="32" viewBox="0 0 36 32" shapeRendering="crispEdges">
              <rect x="12" y="2"  width="5" height="5"  fill={isDark?'#ddbb88':'#eeccaa'}/>
              <rect x="11" y="7"  width="7" height="8"  fill={isDark?'#cc4444':'#dd5555'}/>
              <rect x="6"  y="16" width="18" height="2"  fill={isDark?'#888':'#666'}/>
              <rect x="6"  y="12" width="2"  height="6"  fill={isDark?'#888':'#666'}/>
              <rect x="22" y="12" width="2"  height="6"  fill={isDark?'#888':'#666'}/>
              <rect x="14" y="14" width="2"  height="4"  fill={isDark?'#888':'#666'}/>
              <rect x="2"  y="18" width="10" height="10" fill="none"/>
              <rect x="3"  y="19" width="8"  height="8"  fill={isDark?'#555':'#777'}/>
              <rect x="4"  y="20" width="6"  height="6"  fill={isDark?'#333':'#aaa'}/>
              <rect x="22" y="18" width="10" height="10" fill="none"/>
              <rect x="23" y="19" width="8"  height="8"  fill={isDark?'#555':'#777'}/>
              <rect x="24" y="20" width="6"  height="6"  fill={isDark?'#333':'#aaa'}/>
            </svg>
          </div>

        </div>
      </div>

      <div className="desktop desktop-fade-in" onClick={() => { setSelectedIcon(null); setStartMenuOpen(false) }}>
        {iconDefs.map(({ id, type }) => (
          <div
            key={id}
            className={`desktop-icon ${selectedIcon === id ? 'selected' : ''} ${draggingIcon === id ? 'dragging' : ''}`}
            style={{ left: `${iconPositions[id]?.x ?? 20}px`, top: `${iconPositions[id]?.y ?? 20}px` }}
            onMouseDown={(e) => { e.stopPropagation(); handleIconMouseDown(e, id) }}
            onTouchStart={(e) => handleIconTouchStart(e, id)}
            onClick={(e) => { e.stopPropagation(); handleIconClick(id) }}
            onMouseEnter={() => { if (!draggingIcon) setCursorStyle('pointer') }}
            onMouseLeave={() => { if (!draggingIcon) setCursorStyle('default') }}
            tabIndex={0} role="button" aria-label={t[id]}
            onKeyDown={(e) => { if (e.key === 'Enter') openWindow(id) }}
          >
            <div style={{ width: cs.icon, height: cs.icon }}>
              {renderIcon(type, cs.icon)}
            </div>
            <div className="icon-label">{t[id]}</div>
          </div>
        ))}
      </div>

      {/* Drag shadow */}
      {iconDragShadow && draggingIcon && iconDragHasMoved && (
        <div className="drag-shadow" style={{ left: `${iconDragShadow.x}px`, top: `${iconDragShadow.y}px` }} />
      )}

      {/* Windows */}
      {(Object.keys(windows) as WindowId[]).map((id) => {
        const win = windows[id]
        if (!win.isOpen) return null
        return (
          <div
            key={id} className="window"
            style={{ left: `${win.position.x}px`, top: `${win.position.y}px`, zIndex: win.zIndex }}
            onClick={() => bringToFront(id)}
          >
            {/* Tab bar — horizontal navigation */}
            <div className="window-tabs">
              {(Object.keys(windows) as WindowId[]).filter(w => windows[w].isOpen || minimisedWindows.includes(w)).map(wid => (
                <button
                  key={wid}
                  className={`window-tab ${wid === id ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); if (wid !== id) { bringToFront(wid); openWindow(wid) } }}
                >
                  {t[wid]}
                </button>
              ))}
            </div>
            <div className="window-titlebar" onMouseDown={(e) => handleWindowTitlebarMouseDown(e, id)}>
              <div className="window-title">{windowTitles[lang][id]}</div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button className="window-minimise" onClick={(e) => { e.stopPropagation(); minimiseWindow(id) }} aria-label="Minimise">−</button>
                <button className="window-close" onClick={(e) => { e.stopPropagation(); closeWindow(id) }} aria-label={t.close}>×</button>
              </div>
            </div>
            <div className="window-content">{renderWindowContent(id)}</div>
          </div>
        )
      })}

      {/* Menubar */}
      <div className="menubar">
        <div className="menubar-left">
          <button className={`menu-btn ${startMenuOpen ? 'open' : ''}`} onClick={(e) => { e.stopPropagation(); setStartMenuOpen(!startMenuOpen) }} aria-label="Menu" aria-expanded={startMenuOpen}>
            {t.menu}
          </button>
          {/* Minimised window slots */}
          {minimisedWindows.map(id => (
            <button
              key={id}
              className="minimised-slot"
              onClick={() => restoreWindow(id)}
              title={windowTitles[lang][id]}
            >
              {t[id]}
            </button>
          ))}
        </div>
        <div className="menubar-right">
          <span style={{ fontSize: '11px', color: subtle, marginRight: '4px' }}>{t.iconsLabel}</span>
          {(['small', 'medium', 'large'] as const).map((s) => (
            <button key={s} className={`size-btn ${iconSize === s ? 'active' : ''}`} onClick={() => changeIconSize(s)} aria-label={`${s} icons`}>
              {s[0].toUpperCase()}
            </button>
          ))}
          <div className="clock">{clock}</div>
        </div>
      </div>

      {/* Start menu */}
      {startMenuOpen && (
        <div className="apple-menu" onClick={(e) => e.stopPropagation()}>
          <button className="apple-menu-item" onClick={() => { toggleTheme(); setStartMenuOpen(false) }}>
            {isDark ? t.lightMode : t.darkMode}
          </button>
          <button className="apple-menu-item" onClick={() => { setLang(lang === 'en' ? 'cy' : 'en'); setStartMenuOpen(false) }}>
            {t.langSwitch}
          </button>
          <div className="apple-menu-sep" />
          <button className="apple-menu-item" onClick={() => { toggleCursorTrail(); setStartMenuOpen(false) }}>
            {cursorTrailEnabled ? t.trailOn : t.trailOff}
          </button>
        </div>
      )}

      {/* Cursor trail */}
      {trailDots.map(dot => (
        <div key={dot.id} className="cursor-dot" style={{ left: `${dot.x}px`, top: `${dot.y}px` }} />
      ))}
    </>
  )
}
  const [draggingIcon, setDraggingIcon] = useState<WindowId | null>(null)
  const [iconDragStart, setIconDragStart] = useState({ x: 0, y: 0 })
  const [iconDragHasMoved, setIconDragHasMoved] = useState(false)
  const [iconDragShadow, setIconDragShadow] = useState<{ x: number; y: number } | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const dotIdRef = useRef(0)

  // Clock
  useEffect(() => {
    const update = () => {
      const now = new Date()
      const h = now.getHours().toString().padStart(2, '0')
      const m = now.getMinutes().toString().padStart(2, '0')
      setClock(`${h}:${m}`)
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') || 'light'
    const entered = localStorage.getItem('has_entered')
    const savedTrail = localStorage.getItem('cursor_trail')
    const savedPositions = localStorage.getItem('icon_positions')
    const savedIconSize = localStorage.getItem('icon_size') as 'small' | 'medium' | 'large' | null

    const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent)
    const isPhone = /iPhone|iPod|Android.*Mobile/i.test(navigator.userAgent)
    setIsMobile(isTablet || isPhone || window.innerWidth < 768)

    setTheme(savedTheme)
    if (entered === 'true') setHasEntered(true)
    if (savedTrail !== null) setCursorTrailEnabled(savedTrail === 'true')
    if (savedIconSize) setIconSize(savedIconSize)
    if (savedPositions) {
      try {
        setIconPositions(prev => ({ ...prev, ...JSON.parse(savedPositions) }))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    if (!startMenuOpen) return
    const handler = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (!t.closest('.start-menu') && !t.closest('.start-button')) setStartMenuOpen(false)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [startMenuOpen])

  // Window dragging
  useEffect(() => {
    if (!draggingWindow) return
    const onMove = (e: MouseEvent) => {
      setCursorStyle('grabbing')
      setWindows(prev => ({
        ...prev,
        [draggingWindow]: {
          ...prev[draggingWindow],
          position: {
            x: e.clientX - windowDragOffset.x,
            y: Math.max(0, e.clientY - windowDragOffset.y),
          }
        }
      }))
    }
    const onUp = () => { setDraggingWindow(null); setCursorStyle('default') }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [draggingWindow, windowDragOffset])

  // Icon dragging
  useEffect(() => {
    if (!draggingIcon) return
    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - iconDragStart.x
      const dy = e.clientY - iconDragStart.y
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) { setIconDragHasMoved(true); setCursorStyle('grabbing') }
      setIconPositions(prev => ({
        ...prev,
        [draggingIcon]: { x: prev[draggingIcon].x + dx, y: prev[draggingIcon].y + dy }
      }))
      setIconDragStart({ x: e.clientX, y: e.clientY })
      setIconDragShadow({ x: e.clientX, y: e.clientY })
    }
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      setIconPositions(prev => ({
        ...prev,
        [draggingIcon]: {
          x: prev[draggingIcon].x + (touch.clientX - iconDragStart.x),
          y: prev[draggingIcon].y + (touch.clientY - iconDragStart.y),
        }
      }))
      setIconDragStart({ x: touch.clientX, y: touch.clientY })
    }
    const onUp = () => {
      setIconPositions(prev => {
        const snapped = { ...prev, [draggingIcon]: { x: snapToGrid(prev[draggingIcon].x), y: snapToGrid(prev[draggingIcon].y) } }
        localStorage.setItem('icon_positions', JSON.stringify(snapped))
        return snapped
      })
      setDraggingIcon(null); setIconDragShadow(null); setCursorStyle('default')
      setTimeout(() => setIconDragHasMoved(false), 50)
    }
    const onTouchEnd = () => {
      setIconPositions(prev => {
        const snapped = { ...prev, [draggingIcon]: { x: snapToGrid(prev[draggingIcon].x), y: snapToGrid(prev[draggingIcon].y) } }
        localStorage.setItem('icon_positions', JSON.stringify(snapped))
        return snapped
      })
      setDraggingIcon(null); setIconDragShadow(null)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onTouchMove)
    window.addEventListener('touchend', onTouchEnd)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [draggingIcon, iconDragStart])

  const handleIconMouseDown = (e: React.MouseEvent, id: WindowId) => {
    e.preventDefault(); setSelectedIcon(id); setDraggingIcon(id)
    setIconDragStart({ x: e.clientX, y: e.clientY }); setIconDragHasMoved(false); setCursorStyle('grab')
  }
  const handleIconTouchStart = (e: React.TouchEvent, id: WindowId) => {
    const touch = e.touches[0]; setSelectedIcon(id); setDraggingIcon(id)
    setIconDragStart({ x: touch.clientX, y: touch.clientY }); setIconDragHasMoved(false)
  }
  const handleIconClick = (id: WindowId) => {
    if (iconDragHasMoved) return
    if (isMobile) { openWindow(id); return }
    const now = Date.now()
    if (now - lastClickTime < 300 && selectedIcon === id) openWindow(id)
    setLastClickTime(now); setSelectedIcon(id)
  }

  const openWindow = (id: WindowId) => {
    const newZ = topZIndex + 1; setTopZIndex(newZ)
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], isOpen: true, zIndex: newZ } }))
    setMinimisedWindows(prev => prev.filter(w => w !== id))
  }
  const closeWindow = (id: WindowId) => {
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], isOpen: false } }))
    setMinimisedWindows(prev => prev.filter(w => w !== id))
  }
  const minimiseWindow = (id: WindowId) => {
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], isOpen: false } }))
    setMinimisedWindows(prev => prev.includes(id) ? prev : [...prev, id])
  }
  const restoreWindow = (id: WindowId) => {
    const newZ = topZIndex + 1; setTopZIndex(newZ)
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], isOpen: true, zIndex: newZ } }))
    setMinimisedWindows(prev => prev.filter(w => w !== id))
  }
  const bringToFront = (id: WindowId) => {
    const newZ = topZIndex + 1; setTopZIndex(newZ)
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], zIndex: newZ } }))
  }
  const handleWindowTitlebarMouseDown = (e: React.MouseEvent, id: WindowId) => {
    e.preventDefault(); bringToFront(id); setDraggingWindow(id)
    setWindowDragOffset({ x: e.clientX - windows[id].position.x, y: e.clientY - windows[id].position.y })
    setCursorStyle('grabbing')
  }

  // Cursor trail
  useEffect(() => {
    if (!hasEntered || !cursorTrailEnabled || isMobile) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const handler = (e: MouseEvent) => {
      const dot = { x: e.clientX, y: e.clientY, id: dotIdRef.current++ }
      setTrailDots(prev => [...prev, dot])
      setTimeout(() => setTrailDots(prev => prev.filter(d => d.id !== dot.id)), 600)
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [hasEntered, cursorTrailEnabled, isMobile])

  const handleConsent = (accepted: boolean) => {
    localStorage.setItem('analytics_consent', accepted ? 'accepted' : 'declined')
    localStorage.setItem('has_entered', 'true')
    setIsLoading(true)
    setBootMessages([])
    if (audioRef.current) audioRef.current.play().catch(() => {})

    const messages = [
      'Architecture of Agency OS v1.0',
      'Checking memory... OK',
      'Loading extensions...',
      'Mounting volumes... OK',
      'Initialising community protocols...',
      'Loading ZK credential layer...',
      'Connecting to Cardiff Council... OK',
      'Loading Splott community data...',
      'Applying Design Justice framework...',
      'Welcome.',
    ]
    messages.forEach((msg, i) => {
      setTimeout(() => {
        setBootMessages(prev => [...prev, msg])
      }, i * 300)
    })

    setTimeout(() => {
      setHasEntered(true)
      setIsLoading(false)
    }, 3500)
  }
  const toggleTheme = () => {
    const n = theme === 'light' ? 'dark' : 'light'; setTheme(n); localStorage.setItem('theme', n)
  }
  const toggleCursorTrail = () => {
    const n = !cursorTrailEnabled; setCursorTrailEnabled(n); localStorage.setItem('cursor_trail', n.toString())
  }
  const changeIconSize = (s: 'small' | 'medium' | 'large') => {
    setIconSize(s); localStorage.setItem('icon_size', s)
  }

  const iconSizes = {
    small:  { icon: 48, width: 95,  font: 10 },
    medium: { icon: 64, width: 120, font: 11 },
    large:  { icon: 80, width: 140, font: 13 },
  }
  const cs = iconSizes[iconSize]

  // Labels — bilingual
  const labels = {
    en: {
      about: 'About', 'why-web3': 'Why Web3', governance: 'Governance',
      privacy: 'Privacy', contact: 'Contact', 'phd-development': 'PhD',
      literature: 'Reading', splott: 'Splott',
      menu: 'Menu', langSwitch: 'Newid i Gymraeg',
      lightMode: 'Switch to light mode', darkMode: 'Switch to dark mode',
      trailOn: 'Cursor trail: on', trailOff: 'Cursor trail: off',
      iconsLabel: 'Icons:', close: 'Close',
    },
    cy: {
      about: 'Ynghylch', 'why-web3': 'Pam Web3', governance: 'Llywodraethu',
      privacy: 'Preifatrwydd', contact: 'Cysylltu', 'phd-development': 'PhD',
      literature: 'Darllen', splott: 'Splott',
      menu: 'Dewislen', langSwitch: 'Switch to English',
      lightMode: 'Newid i fodd golau', darkMode: 'Newid i fodd tywyll',
      trailOn: 'Llwybr cyrchwr: ymlaen', trailOff: 'Llwybr cyrchwr: i ffwrdd',
      iconsLabel: 'Eiconau:', close: 'Cau',
    }
  }
  const t = labels[lang as 'en' | 'cy']

  const windowTitles: Record<string, Record<WindowId, string>> = {
    en: {
      'about': 'About', 'why-web3': 'Why Web3?', 'governance': 'Data Governance',
      'privacy': 'Privacy Policy', 'contact': 'Contact',
      'phd-development': 'PhD Development', 'literature': 'Literature', 'splott': 'Splott',
    },
    cy: {
      'about': 'Ynghylch', 'why-web3': 'Pam Web3?', 'governance': 'Llywodraethu Data',
      'privacy': 'Polisi Preifatrwydd', 'contact': 'Cysylltu',
      'phd-development': 'Datblygiad PhD', 'literature': 'Llenyddiaeth', 'splott': 'Splott',
    }
  }

  const isDark = theme === 'dark'
  const bg      = isDark ? '#1a1a1a' : '#c0c0c0'
  const surface = isDark ? '#2a2a2a' : '#ffffff'
  const border  = isDark ? '#666666' : '#000000'
  const text    = isDark ? '#e0e0e0' : '#000000'
  const subtle  = isDark ? '#999999' : '#666666'

  type IconType = 'document' | 'globe3' | 'cabinet' | 'lock' | 'envelope' | 'pencil' | 'books' | 'mappin'

  const iconDefs: Array<{ id: WindowId; type: IconType }> = [
    { id: 'about',           type: 'document' },
    { id: 'why-web3',        type: 'globe3'   },
    { id: 'governance',      type: 'cabinet'  },
    { id: 'privacy',         type: 'lock'     },
    { id: 'contact',         type: 'envelope' },
    { id: 'phd-development', type: 'pencil'   },
    { id: 'literature',      type: 'books'    },
    { id: 'splott',          type: 'mappin'   },
  ]

  // Icons on 32×32 grid, stepped shading (highlight/mid/shadow), no gradients, no curves.
  const renderIcon = (type: IconType, s: number) => {
    const K = isDark

    switch (type) {

      // ── Document ──────────────────────────────────────────────────────────────
      case 'document': {
        const PH=K?'#eeeeee':'#ffffff', PM=K?'#bbbbbb':'#dddddd', PS=K?'#888888':'#aaaaaa'
        const LN=K?'#666666':'#999999', FK=K?'#666666':'#bbbbbb', BK=K?'#cccccc':'#000000'
        return (
          <svg width={s} height={s} viewBox="0 0 32 32" shapeRendering="crispEdges">
            {/* Page body */}
            <rect x="2" y="0" width="27" height="32" fill={PM}/>
            <rect x="2" y="0" width="17" height="32" fill={PH}/>
            {/* Folded top-right corner — step shape */}
            <rect x="19" y="0" width="10" height="8" fill={FK}/>
            <rect x="19" y="0" width="1"  height="7" fill={PS}/>
            <rect x="19" y="7" width="10" height="1" fill={BK}/>
            <rect x="29" y="0" width="1"  height="32" fill={BK}/>
            {/* Outline */}
            <rect x="2"  y="0"  width="1"  height="32" fill={BK}/>
            <rect x="2"  y="0"  width="28" height="1"  fill={BK}/>
            <rect x="2"  y="31" width="28" height="1"  fill={BK}/>
            {/* Text lines */}
            {[8,12,16,20,24].map(y=><rect key={y} x="5" y={y} width="20" height="2" fill={LN}/>)}
            <rect x="5" y="28" width="12" height="2" fill={LN}/>
            {/* Shadow */}
            <rect x="3"  y="32" width="28" height="1" fill={PS}/>
            <rect x="30" y="1"  width="1"  height="31" fill={PS}/>
          </svg>
        )
      }

      // ── Globe with 3 ─────────────────────────────────────────────────────────
      case 'globe3': {
        // Proper stepped-shading globe — circle built from variable-width rows
        const O1=K?'#aabbff':'#bbccff', O2=K?'#3366dd':'#4477ee'
        const O3=K?'#1144bb':'#2255cc', O4=K?'#002288':'#0033aa'
        const G1=K?'#88cc88':'#aaddaa', G2=K?'#448844':'#559955', G3=K?'#335533':'#224422'
        const BK=K?'#cccccc':'#000000'
        // Each row: [x_start, width] approximating a circle on 32x32 grid
        const rows:[number,number][]=[
          [10,12],[7,18],[5,22],[3,26],[2,28],[1,30],[1,30],[1,30],[1,30],[1,30],
          [1,30],[1,30],[1,30],[1,30],[1,30],[1,30],[1,30],[1,30],[1,30],[1,30],
          [1,30],[1,30],[1,30],[1,30],[1,30],[2,28],[3,26],[5,22],[7,18],[10,12],
        ]
        return (
          <svg width={s} height={s} viewBox="0 0 32 32" shapeRendering="crispEdges">
            {/* Ocean fill */}
            {rows.map(([x,w],i)=><rect key={`f${i}`} x={x} y={i+1} width={w} height={1} fill={O2}/>)}
            {/* Highlight — top-left arc */}
            {rows.slice(0,10).map(([x,w],i)=><rect key={`h${i}`} x={x} y={i+1} width={Math.floor(w*0.4)} height={1} fill={O1}/>)}
            {/* Shadow — bottom-right arc */}
            {rows.slice(18).map(([x,w],i)=><rect key={`s${i}`} x={x+Math.floor(w*0.6)} y={i+19} width={Math.floor(w*0.4)} height={1} fill={O3}/>)}
            {rows.slice(24).map(([x,w],i)=><rect key={`d${i}`} x={x+Math.floor(w*0.7)} y={i+25} width={Math.floor(w*0.3)} height={1} fill={O4}/>)}
            {/* Outline */}
            {rows.map(([x,w],i)=>[
              <rect key={`ol${i}`} x={x} y={i+1} width={1} height={1} fill={BK}/>,
              <rect key={`or${i}`} x={x+w-1} y={i+1} width={1} height={1} fill={BK}/>,
            ])}
            <rect x="8"  y="1"  width="16" height="1" fill={BK}/>
            <rect x="8"  y="31" width="16" height="1" fill={BK}/>
            {/* Latitude lines */}
            <rect x="2"  y="9"  width="28" height="1" fill={O3}/>
            <rect x="1"  y="16" width="30" height="1" fill={O3}/>
            <rect x="2"  y="23" width="28" height="1" fill={O3}/>
            {/* Longitude lines */}
            <rect x="9"  y="2"  width="1" height="28" fill={O3}/>
            <rect x="22" y="2"  width="1" height="28" fill={O3}/>
            {/* Landmasses */}
            <rect x="2"  y="6"  width="4" height="6"  fill={G2}/>
            <rect x="2"  y="6"  width="2" height="2"  fill={G1}/>
            <rect x="5"  y="10" width="2" height="2"  fill={G3}/>
            <rect x="13" y="6"  width="4" height="4"  fill={G2}/>
            <rect x="13" y="6"  width="2" height="2"  fill={G1}/>
            <rect x="13" y="11" width="4" height="9"  fill={G2}/>
            <rect x="13" y="11" width="2" height="3"  fill={G1}/>
            <rect x="15" y="18" width="2" height="2"  fill={G3}/>
            <rect x="18" y="5"  width="6" height="6"  fill={G2}/>
            <rect x="18" y="5"  width="3" height="2"  fill={G1}/>
            <rect x="22" y="9"  width="2" height="3"  fill={G3}/>
            <rect x="22" y="19" width="4" height="3"  fill={G2}/>
            {/* Pixel "3" white bottom-right */}
            <rect x="18" y="19" width="8" height="2" fill="#ffffff"/>
            <rect x="24" y="21" width="2" height="2" fill="#ffffff"/>
            <rect x="20" y="23" width="6" height="2" fill="#ffffff"/>
            <rect x="24" y="25" width="2" height="2" fill="#ffffff"/>
            <rect x="18" y="27" width="8" height="2" fill="#ffffff"/>
            {/* Drop shadow */}
            <rect x="8"  y="32" width="16" height="1" fill={O4}/>
          </svg>
        )
      }

      // ── Filing cabinet ────────────────────────────────────────────────────────
      case 'cabinet': {
        const BH=K?'#bbbbbb':'#dddddd', BM=K?'#888888':'#aaaaaa', BS=K?'#555555':'#777777'
        const DH=K?'#cccccc':'#eeeeee', DM=K?'#999999':'#cccccc', DS=K?'#666666':'#999999'
        const HH=K?'#dddddd':'#ffffff', HS=K?'#444444':'#888888'
        const BK=K?'#cccccc':'#000000'
        return (
          <svg width={s} height={s} viewBox="0 0 32 32" shapeRendering="crispEdges">
            <rect x="2"  y="1"  width="28" height="30" fill={BM}/>
            <rect x="2"  y="1"  width="3"  height="30" fill={BH}/>
            <rect x="27" y="1"  width="3"  height="30" fill={BS}/>
            <rect x="2"  y="1"  width="28" height="1"  fill={BK}/>
            <rect x="2"  y="31" width="28" height="1"  fill={BK}/>
            <rect x="2"  y="1"  width="1"  height="31" fill={BK}/>
            <rect x="29" y="1"  width="1"  height="31" fill={BK}/>
            {[3,12,21].map(y=>(
              <g key={y}>
                <rect x="4"  y={y}   width="24" height="8"  fill={DM}/>
                <rect x="4"  y={y}   width="24" height="2"  fill={DH}/>
                <rect x="4"  y={y+6} width="24" height="2"  fill={DS}/>
                <rect x="4"  y={y}   width="1"  height="8"  fill={DH}/>
                <rect x="27" y={y}   width="1"  height="8"  fill={DS}/>
                <rect x="4"  y={y}   width="24" height="1"  fill={BK}/>
                <rect x="4"  y={y+8} width="24" height="1"  fill={BK}/>
                <rect x="11" y={y+3} width="10" height="3"  fill={HS}/>
                <rect x="11" y={y+3} width="10" height="1"  fill={HH}/>
                <rect x="11" y={y+3} width="1"  height="3"  fill={HH}/>
                <rect x="11" y={y+2} width="10" height="1"  fill={BK}/>
                <rect x="11" y={y+5} width="10" height="1"  fill={BK}/>
                <rect x="11" y={y+2} width="1"  height="4"  fill={BK}/>
                <rect x="20" y={y+2} width="1"  height="4"  fill={BK}/>
              </g>
            ))}
            <rect x="3"  y="32" width="28" height="1"  fill={BS}/>
            <rect x="30" y="2"  width="1"  height="30" fill={BS}/>
          </svg>
        )
      }

      // ── Lock ──────────────────────────────────────────────────────────────────
      case 'lock': {
        const GH=K?'#ffee66':'#ffff99', GM=K?'#ddaa00':'#ffcc00', GS=K?'#996600':'#cc9900'
        const SH=K?'#bbbbbb':'#dddddd', SM=K?'#888888':'#aaaaaa', SS=K?'#555555':'#777777'
        const BK=K?'#cccccc':'#000000'
        return (
          <svg width={s} height={s} viewBox="0 0 32 32" shapeRendering="crispEdges">
            {/* Left post */}
            <rect x="8"  y="3"  width="4"  height="14" fill={SM}/>
            <rect x="8"  y="3"  width="1"  height="14" fill={SH}/>
            <rect x="11" y="3"  width="1"  height="14" fill={SS}/>
            <rect x="8"  y="3"  width="1"  height="14" fill={BK}/>
            <rect x="11" y="3"  width="1"  height="14" fill={BK}/>
            {/* Right post */}
            <rect x="20" y="3"  width="4"  height="14" fill={SM}/>
            <rect x="20" y="3"  width="1"  height="14" fill={SH}/>
            <rect x="23" y="3"  width="1"  height="14" fill={SS}/>
            <rect x="20" y="3"  width="1"  height="14" fill={BK}/>
            <rect x="23" y="3"  width="1"  height="14" fill={BK}/>
            {/* Top bar */}
            <rect x="8"  y="3"  width="16" height="4"  fill={SM}/>
            <rect x="8"  y="3"  width="16" height="1"  fill={SH}/>
            <rect x="8"  y="3"  width="16" height="1"  fill={BK}/>
            {/* Body */}
            <rect x="3"  y="15" width="26" height="16" fill={GM}/>
            <rect x="3"  y="15" width="26" height="3"  fill={GH}/>
            <rect x="3"  y="27" width="26" height="4"  fill={GS}/>
            <rect x="3"  y="15" width="2"  height="16" fill={GH}/>
            <rect x="27" y="15" width="2"  height="16" fill={GS}/>
            <rect x="3"  y="15" width="26" height="1"  fill={BK}/>
            <rect x="3"  y="30" width="26" height="1"  fill={BK}/>
            <rect x="3"  y="15" width="1"  height="16" fill={BK}/>
            <rect x="28" y="15" width="1"  height="16" fill={BK}/>
            {/* Keyhole — round top + slot */}
            <rect x="14" y="19" width="4"  height="1"  fill={BK}/>
            <rect x="13" y="20" width="6"  height="4"  fill={BK}/>
            <rect x="14" y="24" width="4"  height="1"  fill={BK}/>
            <rect x="15" y="25" width="2"  height="3"  fill={BK}/>
            {/* Drop shadow */}
            <rect x="4"  y="31" width="26" height="1"  fill={GS}/>
            <rect x="29" y="16" width="1"  height="15" fill={GS}/>
          </svg>
        )
      }

      // ── Envelope ──────────────────────────────────────────────────────────────
      case 'envelope': {
        const EH=K?'#eeeeee':'#ffffff', EM=K?'#cccccc':'#eeeeee', ES=K?'#888888':'#cccccc'
        const FH=K?'#ff8888':'#ff6666', FM=K?'#cc3333':'#dd3333', FS=K?'#881111':'#aa1111'
        const BK=K?'#cccccc':'#000000'
        return (
          <svg width={s} height={s} viewBox="0 0 32 32" shapeRendering="crispEdges">
            <rect x="1"  y="8"  width="30" height="20" fill={EM}/>
            <rect x="1"  y="8"  width="2"  height="20" fill={EH}/>
            <rect x="29" y="8"  width="2"  height="20" fill={ES}/>
            <rect x="1"  y="26" width="30" height="2"  fill={ES}/>
            <rect x="1"  y="8"  width="30" height="1"  fill={BK}/>
            <rect x="1"  y="27" width="30" height="1"  fill={BK}/>
            <rect x="1"  y="8"  width="1"  height="20" fill={BK}/>
            <rect x="30" y="8"  width="1"  height="20" fill={BK}/>
            {/* V flap row by row */}
            {[[1,2],[3,2],[5,2],[7,2],[9,2],[11,2],[13,2],[15,2]].map(([x,w],i)=>(
              <g key={i}>
                <rect x={x}    y={8+i} width={w}   height="1" fill={i===0?FH:FM}/>
                <rect x={30-x-w+2} y={8+i} width={w} height="1" fill={i===0?FM:i>5?FS:FM}/>
              </g>
            ))}
            <rect x="15" y="16" width="2"  height="1"  fill={FS}/>
            <rect x="2"  y="24" width="10" height="1"  fill={ES}/>
            <rect x="20" y="24" width="10" height="1"  fill={ES}/>
            <rect x="2"  y="28" width="30" height="1"  fill={ES}/>
            <rect x="31" y="9"  width="1"  height="19" fill={ES}/>
          </svg>
        )
      }

      // ── Pencil ────────────────────────────────────────────────────────────────
      case 'pencil': {
        const EH=K?'#ffaaaa':'#ffcccc', EM=K?'#dd6666':'#ff9999', ES=K?'#aa3333':'#cc6666'
        const BN=K?'#bbbbbb':'#cccccc', BS=K?'#777777':'#999999'
        const YH=K?'#ffee44':'#ffff88', YM=K?'#ddaa00':'#ffdd00', YS=K?'#996600':'#cc9900'
        const WH=K?'#ddaa88':'#eebb99', WS=K?'#885522':'#aa7733'
        const NK=K?'#555555':'#222222', BK=K?'#cccccc':'#000000'
        return (
          <svg width={s} height={s} viewBox="0 0 32 32" shapeRendering="crispEdges">
            {/* Eraser */}
            <rect x="11" y="1"  width="10" height="5"  fill={EM}/>
            <rect x="11" y="1"  width="10" height="1"  fill={EH}/>
            <rect x="11" y="4"  width="10" height="2"  fill={ES}/>
            <rect x="11" y="1"  width="1"  height="5"  fill={EH}/>
            <rect x="20" y="1"  width="1"  height="5"  fill={ES}/>
            <rect x="11" y="1"  width="10" height="1"  fill={BK}/>
            <rect x="11" y="5"  width="10" height="1"  fill={BK}/>
            <rect x="11" y="1"  width="1"  height="5"  fill={BK}/>
            <rect x="20" y="1"  width="1"  height="5"  fill={BK}/>
            {/* Band */}
            <rect x="11" y="6"  width="10" height="3"  fill={BS}/>
            <rect x="11" y="6"  width="10" height="1"  fill={BN}/>
            <rect x="11" y="6"  width="1"  height="3"  fill={BN}/>
            <rect x="11" y="5"  width="10" height="1"  fill={BK}/>
            <rect x="11" y="8"  width="10" height="1"  fill={BK}/>
            {/* Body */}
            <rect x="11" y="9"  width="10" height="16" fill={YM}/>
            <rect x="11" y="9"  width="2"  height="16" fill={YH}/>
            <rect x="19" y="9"  width="2"  height="16" fill={YS}/>
            <rect x="11" y="9"  width="1"  height="16" fill={BK}/>
            <rect x="20" y="9"  width="1"  height="16" fill={BK}/>
            {/* Wood taper */}
            <rect x="11" y="25" width="10" height="1"  fill={BK}/>
            <rect x="12" y="26" width="8"  height="1"  fill={WH}/>
            <rect x="13" y="27" width="6"  height="1"  fill={WH}/>
            <rect x="14" y="28" width="4"  height="1"  fill={WS}/>
            <rect x="12" y="26" width="1"  height="3"  fill={BK}/>
            <rect x="19" y="26" width="1"  height="3"  fill={BK}/>
            <rect x="13" y="27" width="1"  height="2"  fill={BK}/>
            <rect x="18" y="27" width="1"  height="2"  fill={BK}/>
            {/* Nib */}
            <rect x="14" y="28" width="4"  height="1"  fill={BK}/>
            <rect x="15" y="29" width="2"  height="2"  fill={NK}/>
            <rect x="15" y="29" width="1"  height="2"  fill={BK}/>
            <rect x="16" y="29" width="1"  height="2"  fill={BK}/>
            <rect x="15" y="31" width="2"  height="1"  fill={BK}/>
            {/* Shadow */}
            <rect x="12" y="32" width="10" height="1"  fill={YS}/>
            <rect x="21" y="2"  width="1"  height="30" fill={YS}/>
          </svg>
        )
      }

      // ── Books ─────────────────────────────────────────────────────────────────
      // Three books standing upright, side by side, different heights
      case 'books': {
        // Horizontal isometric stack — 3 books, each with top face, spine, front face, page edge
        const B1T=K?'#aabbff':'#ccddf0', B1H=K?'#6688ee':'#8899ff', B1M=K?'#4466cc':'#5577dd', B1S=K?'#223388':'#334499'
        const B2T=K?'#ffbbbb':'#ffdddd', B2H=K?'#ee7777':'#ff9999', B2M=K?'#cc3333':'#dd4444', B2S=K?'#881111':'#aa2222'
        const B3T=K?'#bbffbb':'#ddffdd', B3H=K?'#77ee77':'#99ff99', B3M=K?'#336633':'#448844', B3S=K?'#114411':'#225522'
        const PG=K?'#dddddd':'#eeeeee', BK=K?'#cccccc':'#000000'
        // Stack goes bottom-left to top-right. Each book: top parallelogram + spine + front + pages.
        // Book height 7px, width 24px, isometric offset 4px per book
        return (
          <svg width={s} height={s} viewBox="0 0 32 32" shapeRendering="crispEdges">
            {/* ── Book 1 — bottom, blue ── */}
            {/* Top face parallelogram: y=20 left to y=17 right */}
            <rect x="1"  y="20" width="24" height="1" fill={B1T}/>
            <rect x="2"  y="19" width="24" height="1" fill={B1T}/>
            <rect x="3"  y="18" width="24" height="1" fill={B1H}/>
            <rect x="4"  y="17" width="24" height="1" fill={B1H}/>
            <rect x="1"  y="20" width="1"  height="1" fill={BK}/>
            <rect x="28" y="17" width="1"  height="4" fill={BK}/>
            <rect x="1"  y="17" width="27" height="1" fill={BK}/>
            {/* Spine — left dark face */}
            <rect x="1"  y="21" width="3"  height="8" fill={B1S}/>
            <rect x="1"  y="21" width="1"  height="8" fill={BK}/>
            <rect x="1"  y="28" width="3"  height="1" fill={BK}/>
            {/* Front face */}
            <rect x="4"  y="21" width="24" height="8" fill={B1M}/>
            <rect x="4"  y="21" width="6"  height="8" fill={B1H}/>
            <rect x="4"  y="21" width="24" height="1" fill={BK}/>
            <rect x="4"  y="28" width="24" height="1" fill={BK}/>
            <rect x="27" y="21" width="1"  height="8" fill={BK}/>
            {/* Page edge */}
            <rect x="28" y="17" width="1"  height="12" fill={PG}/>
            <rect x="28" y="29" width="1"  height="1"  fill={BK}/>

            {/* ── Book 2 — middle, red, offset 4px up ── */}
            <rect x="5"  y="14" width="24" height="1" fill={B2T}/>
            <rect x="6"  y="13" width="24" height="1" fill={B2T}/>
            <rect x="7"  y="12" width="24" height="1" fill={B2H}/>
            <rect x="8"  y="11" width="24" height="1" fill={B2H}/>
            <rect x="5"  y="14" width="1"  height="1" fill={BK}/>
            <rect x="32" y="11" width="1"  height="4" fill={BK}/>
            <rect x="5"  y="11" width="27" height="1" fill={BK}/>
            <rect x="5"  y="15" width="3"  height="7" fill={B2S}/>
            <rect x="5"  y="15" width="1"  height="7" fill={BK}/>
            <rect x="5"  y="21" width="3"  height="1" fill={BK}/>
            <rect x="8"  y="15" width="23" height="7" fill={B2M}/>
            <rect x="8"  y="15" width="6"  height="7" fill={B2H}/>
            <rect x="8"  y="15" width="23" height="1" fill={BK}/>
            <rect x="8"  y="21" width="23" height="1" fill={BK}/>
            <rect x="30" y="15" width="1"  height="7" fill={BK}/>
            <rect x="31" y="11" width="1"  height="11" fill={PG}/>
            <rect x="31" y="22" width="1"  height="1"  fill={BK}/>

            {/* ── Book 3 — top, green, offset 4px up again ── */}
            <rect x="8"  y="8"  width="24" height="1" fill={B3T}/>
            <rect x="9"  y="7"  width="24" height="1" fill={B3T}/>
            <rect x="10" y="6"  width="22" height="1" fill={B3H}/>
            <rect x="8"  y="8"  width="1"  height="1" fill={BK}/>
            <rect x="8"  y="5"  width="24" height="1" fill={BK}/>
            <rect x="8"  y="9"  width="3"  height="6" fill={B3S}/>
            <rect x="8"  y="9"  width="1"  height="6" fill={BK}/>
            <rect x="8"  y="14" width="3"  height="1" fill={BK}/>
            <rect x="11" y="9"  width="20" height="6" fill={B3M}/>
            <rect x="11" y="9"  width="6"  height="6" fill={B3H}/>
            <rect x="11" y="9"  width="20" height="1" fill={BK}/>
            <rect x="11" y="14" width="20" height="1" fill={BK}/>
            <rect x="30" y="9"  width="1"  height="6" fill={BK}/>
            <rect x="31" y="5"  width="1"  height="10" fill={PG}/>
            <rect x="31" y="15" width="1"  height="1"  fill={BK}/>
          </svg>
        )
      }

      // ── Map pin — slim notice board push pin ──────────────────────────────────
      case 'mappin': {
        const PH=K?'#ff9999':'#ffbbbb', PM=K?'#dd2222':'#ee3333', PS=K?'#991111':'#bb2222'
        const NH=K?'#cccccc':'#dddddd', NM=K?'#888888':'#aaaaaa', NS=K?'#444444':'#666666'
        const BK=K?'#cccccc':'#000000'
        return (
          <svg width={s} height={s} viewBox="0 0 32 32" shapeRendering="crispEdges">
            {/* Top disc — slim, 10px wide */}
            <rect x="11" y="2"  width="10" height="1" fill={BK}/>
            <rect x="10" y="3"  width="12" height="1" fill={BK}/>
            <rect x="10" y="4"  width="12" height="3" fill={PH}/>
            <rect x="15" y="4"  width="7"  height="3" fill={PM}/>
            <rect x="19" y="4"  width="3"  height="3" fill={PS}/>
            <rect x="10" y="6"  width="12" height="1" fill={PM}/>
            <rect x="10" y="7"  width="12" height="1" fill={BK}/>
            <rect x="10" y="4"  width="1"  height="4" fill={BK}/>
            <rect x="21" y="4"  width="1"  height="4" fill={BK}/>
            {/* Barrel — 6px wide, narrow */}
            <rect x="13" y="8"  width="6"  height="10" fill={PM}/>
            <rect x="13" y="8"  width="2"  height="10" fill={PH}/>
            <rect x="17" y="8"  width="2"  height="10" fill={PS}/>
            <rect x="13" y="8"  width="1"  height="10" fill={BK}/>
            <rect x="18" y="8"  width="1"  height="10" fill={BK}/>
            {/* Rim highlight and shadow lines */}
            <rect x="13" y="10" width="6"  height="1"  fill={PH}/>
            <rect x="13" y="15" width="6"  height="1"  fill={PS}/>
            {/* Bottom disc — slim, 10px wide */}
            <rect x="10" y="18" width="12" height="1" fill={BK}/>
            <rect x="10" y="19" width="12" height="3" fill={PM}/>
            <rect x="10" y="19" width="3"  height="3" fill={PH}/>
            <rect x="19" y="19" width="3"  height="3" fill={PS}/>
            <rect x="10" y="21" width="12" height="1" fill={PS}/>
            <rect x="10" y="22" width="12" height="1" fill={BK}/>
            <rect x="10" y="19" width="1"  height="4" fill={BK}/>
            <rect x="21" y="19" width="1"  height="4" fill={BK}/>
            {/* Needle — 2px wide, sharp */}
            <rect x="15" y="23" width="2"  height="1" fill={NH}/>
            <rect x="15" y="24" width="2"  height="5" fill={NM}/>
            <rect x="16" y="24" width="1"  height="5" fill={NS}/>
            <rect x="15" y="29" width="2"  height="1" fill={NS}/>
            <rect x="15" y="23" width="1"  height="7" fill={BK}/>
            <rect x="16" y="29" width="1"  height="1" fill={BK}/>
            {/* Shadow spots either side of needle base */}
            <rect x="12" y="23" width="2"  height="1" fill={PS}/>
            <rect x="18" y="23" width="2"  height="1" fill={PS}/>
          </svg>
        )
      }
    }
  }


  // ─── Window content ───────────────────────────────────────────────────────────

  const renderWindowContent = (id: WindowId) => {
    const h2 = { fontSize: '15px', fontWeight: 700, margin: '20px 0 8px', color: text } as const
    const p  = { fontSize: '13px', lineHeight: 1.75, marginBottom: '14px', color: text } as const
    const ul = { margin: '8px 0 14px 22px', fontSize: '13px', lineHeight: 1.75, color: text } as const
    const li = { marginBottom: '8px' } as const
    const note = { fontSize: '11px', color: subtle, marginTop: '20px' } as const
    const divider = (
      <div style={{ height: 1, background: isDark ? '#444' : '#e0e0e0', margin: '20px 0' }} />
    )
    const techLabel = (
      <p style={{ fontSize: '11px', fontWeight: 700, color: subtle, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '20px 0 8px' }}>
        {lang === 'en' ? 'Technical detail' : 'Manylion technegol'}
      </p>
    )

    if (lang === 'cy') {
      switch (id) {

        case 'about':
          return (
            <>
              <p style={p}>Mae'r ymchwil hwn yn archwilio sut mae cymunedau yn cael eu heithrio o benderfyniadau cynllunio — a sut y gallai adeiladu seilwaith digidol newydd roi'r grym hwnnw yn ôl iddynt.</p>
              <h2 style={h2}>Y broblem</h2>
              <p style={p}>Mewn cynllunio trefol, mae mathau lluosog o bŵer yn penderfynu pwy sy'n cael llais:</p>
              <ul style={ul}>
                <li style={li}><strong>Pŵer eiddo:</strong> Gall perchnogion tir wrthod pawb trwy hawliau cyfreithiol</li>
                <li style={li}><strong>Pŵer economaidd:</strong> Gall datblygwyr wrthod trwy gyfalaf</li>
                <li style={li}><strong>Pŵer sefydliadol:</strong> Mae Awdurdodau Lleol yn gwrthod trwy bwerau statudol</li>
                <li style={li}><strong>Pŵer epistemolegol:</strong> Mae gweithwyr proffesiynol yn rheoli mynediad trwy arbenigedd technegol</li>
              </ul>
              <p style={p}>O fewn cymunedau sydd eisoes wedi'u heithrio, mae deinameg fwyafrifol yn distewi pobl anabl, rhentwyr, a lleiafrifoedd ymhellach.</p>
              <h2 style={h2}>Cyd-destun Caerdydd</h2>
              <p style={p}>Mae gan Gaerdydd 28 ward. Mae gan 6 ohonynt Gyngor Cymuned — ond hyd yn oed y rhain yn aml yn cynnig ymgynghori tocenistig yn unig, heb bŵer gwneud penderfyniadau go iawn. Mae gan 22 ward arall ddim strwythur ffurfiol o gwbl.</p>
              <p style={p}>Nid yw absenoldeb Cyngor Cymuned yn atal cymuned rhag paratoi Cynllun Lle yn gyfreithiol — ond mae'n gadael y cwestiwn o gynrychiolaeth heb ei ateb: sut all awdurdod lleol fodloni ei hun bod grŵp yn cynrychioli'r gymdogaeth, heb sefydlu sefydliad newydd canolog?</p>
              <h2 style={h2}>Architecture of Agency</h2>
              <p style={p}>Cyfraniad damcaniaethol canolog y PhD yw'r cynnig bod amodau gofodol, sefydliadol, a thechnegol gyda'i gilydd yn cynhyrchu neu'n cau allan asiantaeth gymunedol — ac y gall ailddylunio unrhyw un o'r tri haen newid pwy sy'n gallu gweithredu, cyfrannu, a bod yn bresennol.</p>
              <p style={p}>Mae dau gysyniad diagnostig yn sail i'r fframwaith: <strong>Absenoldeb Olrhain</strong> — ailadeiladu o gofnodion cynllunio pwy nad oedd yn bresennol a pha amodau strwythurol a gynhyrchodd yr absenoldeb hwnnw — a <strong>Cholled Olrhain</strong> — yr hyn a gynhyrchodd yr absenoldebau hynny: y penderfyniadau a wnaed, yr amgylcheddau a siapiwd, y lleoedd a gynlluniwyd heb wybodaeth y rhai a eithriawyd.</p>
              <h2 style={h2}>Cwestiynau ymchwil</h2>
              <ul style={ul}>
                <li style={li}>Sut all systemau llywodraethiant ymgysylltu â phob rhanddeiliad tra'n canoli cymunedau?</li>
                <li style={li}>Pa fecanweithiau sy'n atal cipio sefydliadol a gormes mwyafrifol?</li>
                <li style={li}>All technoleg ddigidol alluogi asiantaeth gymunedol ddilysiedig, heb greu pwyntiau canoli newydd?</li>
                <li style={li}>Beth mae Cyfiawnder Dylunio yn ei olygu pan fo'n rhan o seilwaith dinesig?</li>
                <li style={li}>Sut rydym yn ailddosbarthu awdurdod epistemolegol ochr yn ochr â phŵer gwneud penderfyniadau?</li>
              </ul>
              <p style={note}>PhD Blwyddyn 1 — Ysgol Bensaernïaeth Cymru, Prifysgol Caerdydd<br />Dan oruchwyliaeth yr Athro Mhairi McVicar, Dr Neil Turnbull, a Simon Gilbert (Pennaeth Cynllunio, Cyngor Caerdydd)</p>
            </>
          )

        case 'why-web3':
          return (
            <>
              <p style={p}>Mae'r ymchwil hwn yn archwilio a all technoleg ddigidol ddosbarthedig helpu i ddatrys methiant cydlynu penodol mewn cynllunio cymunedol — un lle na all y naill ochr na'r llall rannu gwybodaeth angenrheidiol heb risgiau preifatrwydd annerbyniol.</p>
              <h2 style={h2}>Y methiant cydlynu</h2>
              <p style={p}>I gymuned heb Gyngor Cymuned gynhyrchu sylfaen wybodaeth ddilysiedig ar gyfer Cynllun Lle, mae angen cydlynu ar draws sawl math o actor — cymunedau, sefydliadau cymunedol, a'r Cyngor — ond nid oes gan unrhyw un ohonynt ffordd bresennol i rannu'r wybodaeth angenrheidiol heb greu risgiau preifatrwydd neu fynediad annerbyniol.</p>
              <p style={p}>Mae'r her yn ddwyochrog. Nid yn unig mae cymunedau'n methu cyflwyno tystiolaeth gymunedol ddilysiedig i'r awdurdod cynllunio — ni all Cynghorau Cymuned a grwpiau cymunedol gael gafael ar ddata perthnasol gan yr awdurdod lleol mewn ffordd ddilysiedig, preifatrwydd-barchus chwaith.</p>
              <h2 style={h2}>Pam technoleg ddosbarthedig</h2>
              <p style={p}>Mae systemau cronfa ddata traddodiadol yn gofyn i rywun berchnogi a rheoli'r seilwaith. Ar gyfer llywodraethiant trefol, mae hyn yn golygu amnewid rheolaeth yr Awdurdod Lleol â phwynt canoli arall. Nid yw'r strwythur pŵer yn newid — mae'n symud yn unig.</p>
              <p style={p}>Mae'r ymchwil hwn yn archwilio a all technoleg sy'n rhedeg ar draws rhwydwaith dosbarthedig — lle nad oes unrhyw unigolyn neu sefydliad yn berchen ar y seilwaith — gynnal trefniadau cydlynu gwahanol: rhai lle mae preifatrwydd yn cael ei orfodi'n dechnegol, nid ei addo'n unig.</p>
              {divider}
              {techLabel}
              <p style={p}>Mae'r ymchwil yn canolbwyntio ar gredynnau sero-wybodaeth — math o brawf cryptograffig sy'n caniatáu i chi brofi bod rhywbeth yn wir heb ddatgelu'r wybodaeth sylfaenol. Mae hyn yn golygu y gallai Cyngor Caerdydd gael prawf bod sylfaen wybodaeth wedi'i chynhyrchu gan gymuned ddigon gynrychiadol o drigolion — heb erioed weld pwy gyfrannodd beth.</p>
              <p style={p}>Mae Ethereum yn blatfform cynllunio agored-ffynhonnell sy'n rhedeg ar rwydwaith o gyfrifiaduron ledled y byd — nid yw'n eiddo i unrhyw gwmni unigol. Gellir ei ddefnyddio i storio tystiaeth ar-gadwyn yn gyhoeddus ac yn archwiliadwy. Er ei fod yn adnabyddus fel platfform arian digidol, mae ei seilwaith yn cael ei ymchwilio yma at ddibenion llywodraethiant dinesig, nid ariannol.</p>
              <p style={p}>Nid yw technoleg yn datrys problemau pŵer cymdeithasol a gwleidyddol. Mae hygyrchedd yn ofyniad dylunio craidd, nid nodyn troedfel. Dyna pam mae cyd-ddylunio gyda thrigolion Splott yn pennu paramedrau'r system — nid rhagdybiaethau technegol.</p>
            </>
          )

        case 'governance':
          return (
            <>
              <p style={p}>Mae'r ymchwil hwn yn ymchwilio i sut ddylai data cymunedol gael ei lywodraethu. Nid oes gennym yr atebion eto — dyna beth fydd y PhD yn ei ddarganfod.</p>
              <h2 style={h2}>Data ymwelwyr y wefan</h2>
              <p style={p}>Mae'r wefan hon yn casglu data defnydd dienw: pa dudalennau rydych chi'n ymweld â nhw, sut rydych chi'n llywio, math o ddyfais, a gwlad yn unig. Mae Prifysgol Caerdydd yn dal y data hwn dros dro fel stiward yn ystod yr ymchwil PhD (2025–2028). Stiwardiaeth yw hyn, nid perchnogaeth.</p>
              <h2 style={h2}>Data ymchwil</h2>
              <p style={p}>Bydd data o gyfweliadau â chymunedau, cynllunwyr, a rhanddeiliaid eraill yn cael ei lywodraethu gyda chydnabyddiaeth o fuddiannau cymhleth ac weithiau gwrthdaro. Mae gan wahanol randdeiliaid hawliau dilys — nid oes un ateb syml.</p>
              <h2 style={h2}>Beth mae'r ymchwil hwn yn ei archwilio</h2>
              <ul style={ul}>
                <li style={li}>Sut ddylai data ymchwil aml-blaid gael ei lywodraethu?</li>
                <li style={li}>Pa hawliau sydd gan wahanol randdeiliaid?</li>
                <li style={li}>Sut rydych chi'n cydbwyso tryloywder â phreifatrwydd?</li>
                <li style={li}>Beth mae sofraniaeth data cymunedol yn ei olygu pan nad yw "cymuned" yn unffurf?</li>
              </ul>
              <h2 style={h2}>Ymrwymiadau cyfredol</h2>
              <ul style={ul}>
                <li style={li}>Casglu lleiaf — dim ond yr hyn sy'n angenrheidiol</li>
                <li style={li}>Tryloywder llawn am yr hyn sy'n cael ei gasglu a pham</li>
                <li style={li}>Cymeradwyaeth moeseg ymchwil Prifysgol Caerdydd ar gyfer pob casgliad data</li>
                <li style={li}>Ymrwymiad i drosglwyddo llywodraethiant i gymunedau ar ôl y PhD</li>
              </ul>
            </>
          )

        case 'privacy':
          return (
            <>
              <p style={{ fontSize: '11px', color: subtle, marginBottom: '16px' }}>Diweddariad diwethaf: Chwefror 2025</p>
              <h2 style={h2}>Beth mae'r wefan hon yn ei gasglu</h2>
              <p style={p}>Data defnydd dienw: pa dudalennau rydych chi'n ymweld â nhw, sut rydych chi'n llywio, math o ddyfais (symudol/bwrdd gwaith), rhanbarth daearyddol (gwlad yn unig). Dim gwybodaeth bersonol. Dim cwcis tracio. Dim data adnabyddadwy.</p>
              <h2 style={h2}>Pam rydym yn casglu hyn</h2>
              <p style={p}>I ddeall sut mae cymunedau yn ymgysylltu ag ymchwil sofraniaeth data, ac i wella hygyrchedd y cynnwys.</p>
              <h2 style={h2}>Ble mae'n cael ei storio</h2>
              <p style={p}>Mae data yn cael ei brosesu gan Vercel Inc. o dan eu polisi preifatrwydd. Mae Vercel Analytics wedi'i gynllunio i fod yn gydymffurfiol â GDPR.</p>
              <h2 style={h2}>Eich hawliau</h2>
              <ul style={ul}>
                <li style={li}>Deall pa ddata sy'n cael ei gasglu — wedi'i ddogfennu yma</li>
                <li style={li}>Optio allan — gwrthod ar y sgrin mynediad neu glirio data porwr</li>
                <li style={li}>Cysylltu â ni gyda chwestiynau neu bryderon</li>
              </ul>
              <p style={{ fontSize: '12px', marginTop: '20px', color: text }}>Cysylltu: Lucy Dunhill — dunhilll@cardiff.ac.uk</p>
            </>
          )

        case 'contact':
          return (
            <>
              <p style={{ ...p, fontWeight: 700 }}>Lucy Dunhill</p>
              <p style={p}>Ymchwilydd PhD<br />Ysgol Bensaernïaeth Cymru, Prifysgol Caerdydd</p>
              <p style={p}><a href="mailto:dunhilll@cardiff.ac.uk" style={{ color: 'inherit', textDecoration: 'underline' }}>dunhilll@cardiff.ac.uk</a></p>
              <p style={p}>Ar gael ar gyfer cyfarfodydd yng Nghaerdydd ac ar-lein.</p>
              <div style={{ marginTop: '20px' }}>
                {[
                  ['ORCID', 'https://orcid.org/0009-0009-3588-4823'],
                  ['Proffil Caerdydd', 'https://profiles.cardiff.ac.uk/research-staff/dunhilll'],
                  ['GitHub', 'https://github.com/Architecture-of-Agency/overview'],
                  ['Gwefan', 'https://architectureof.agency'],
                ].map(([label, url]) => (
                  <p key={label} style={{ fontSize: '12px', marginBottom: '8px' }}>
                    <strong>{label}:</strong>{' '}
                    <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{url}</a>
                  </p>
                ))}
              </div>
            </>
          )

        case 'phd-development':
          return (
            <>
              <p style={{ ...p, fontStyle: 'italic', color: subtle }}>Cofnod byw o ddatblygiad y PhD. Wedi'i ddiweddaru wrth i'r ymchwil fynd rhagddo.</p>
              <h2 style={h2}>Cam cyfredol</h2>
              <p style={p}>PhD Blwyddyn 1, Ysgol Bensaernïaeth Cymru, Prifysgol Caerdydd. Cyfnod: Sefydlu'r fframwaith damcaniaethol, adeiladu perthnasoedd sefydliadol, a dechrau ymgysylltu â'r gymuned yn Splott.</p>
              <h2 style={h2}>Partneriaethau wedi'u cadarnhau</h2>
              <ul style={ul}>
                <li style={li}>Cyngor Caerdydd — Simon Gilbert (Pennaeth Cynllunio) yn oruchwyliwr eilaidd</li>
                <li style={li}>Prosiect AHRC Co-PP dan arweiniad yr Athro Mhairi McVicar — yn rhedeg Mai–Rhagfyr 2026 ochr yn ochr â'r ymchwil</li>
              </ul>
              <h2 style={h2}>Myfyrdodau a nodiadau proses</h2>
              <p style={{ ...p, fontStyle: 'italic', color: subtle }}>[ I'w ychwanegu wrth i'r ymchwil ddatblygu. ]</p>
              <h2 style={h2}>Penderfyniadau allweddol</h2>
              <p style={{ ...p, fontStyle: 'italic', color: subtle }}>[ I'w ychwanegu wrth i benderfyniadau allweddol gael eu gwneud. ]</p>
            </>
          )

        case 'literature':
          return (
            <>
              <p style={{ ...p, fontStyle: 'italic', color: subtle }}>Wedi'i drefnu yn ôl thema. Bydd anodiadau yn cael eu hehangu wrth i'r PhD fynd rhagddo.</p>
              {[
                {
                  theme: 'Theori Cynllunio',
                  entries: [
                    { ref: 'Arnstein (1969)', note: 'Fframwaith sylfaenol ar gyfer cyfranogiad. Yn sefydlu bod ymgysylltiad cymunedol yn aml yn lawrlwytho cyfrifoldeb heb ailddosbarthu pŵer.' },
                    { ref: 'Rydin (2007)', note: 'Mae gwybodaeth mewn cynllunio yn adnodd cystadleuol y mae ei gyfreithlondeb yn cael ei bennu\'n gymdeithasol — nid mewnbwn niwtral.' },
                    { ref: 'Miessen (2016)', note: 'Cynulliad agweddol fel dewis arall i gyfranogiad consensws. Sail ddamcaniaethol ar gyfer pensaernïaeth luosogol, anghytgord y sylfaen wybodaeth.' },
                    { ref: 'Parvin (2021)', note: 'Cynllunio cymunedol fel problem seilwaith heb ei datrys.' },
                  ]
                },
                {
                  theme: 'Cyfiawnder Dylunio a Methodoleg',
                  entries: [
                    { ref: 'Costanza-Chock (2020)', note: 'Fframwaith ymbarél ar gyfer yr ymchwil hwn. Yn canoli\'r rhai sy\'n cael eu heffeithio fwyaf gan benderfyniadau dylunio yn y broses ddylunio ei hun — nid fel ymgynghorwyr, ond fel arweinwyr.' },
                    { ref: 'Carroll et al. (2020)', note: 'Egwyddorion CARE ar gyfer Llywodraethu Data Brodorol: Budd Cyfunol, Awdurdod i Reoli, Cyfrifoldeb, Moeseg.' },
                  ]
                },
                {
                  theme: 'Anabledd a Chyfiawnder Epistemolegol',
                  entries: [
                    { ref: 'Fricker (2007)', note: 'Anghyfiawnder hermeniwtig — y niwed a wneir pan fo rhywun yn methu â deall eu profiad eu hunain. Yn sail i\'r gofyniad nad yw seilwaith hunaniaeth yn amgodio allgáu presennol.' },
                    { ref: 'Garland-Thomson (2011)', note: 'Y cysyniad camffitio: nid y corff yw\'r broblem ond yr amgylchedd adeiledig sy\'n methu â\'i lety.' },
                    { ref: 'Hamraie (2017)', note: 'Theori anabledd beirniadol wedi\'i gymhwyso i ddylunio. Nid llety yw Cyfiawnder Dylunio — ailddylunio ydyw.' },
                    { ref: 'Goodley (2013)', note: 'Fframwaith astudiaethau anabledd beirniadol wedi\'i integreiddio i gyfraniad damcaniaethol Architecture of Agency.' },
                  ]
                },
                {
                  theme: 'Blockchain a Systemau Trefol',
                  entries: [
                    { ref: 'Ietto et al. (2022); Muth et al. (2022); Rabe et al. (2021)', note: 'Prosiect BBBlockchain, Berlin. Tystiolaeth empirig fwyaf sylweddol ar gyfer blockchain mewn cyd-destunau cynllunio.' },
                    { ref: 'Schneider (2019)', note: 'Mae honiadau datganoli yn aml yn anghyflawn ac yn cuddio asimetreddau pŵer parhaus.' },
                    { ref: 'Lumineau et al. (2021)', note: 'Mae honiadau llywodraethiant angen sylfaen empirig.' },
                  ]
                },
                {
                  theme: 'Sofraniaeth Data a Ffeministiaeth',
                  entries: [
                    { ref: 'Haraway (1991)', note: 'Epistemeg ffeministaidd sylfaenol. Mae gwybodaeth bob amser yn cael ei chynhyrchu o safbwynt — ac mae\'r cwestiwn pwy sy\'n cyfri yn gynllunio yn gwestiwn gwleidyddol, nid technegol.' },
                    { ref: 'Plant (1997)', note: 'Seibrffeminisdiaeth wedi\'i integreiddio i\'r synthesis damcaniaethol. Technoleg fel safle o bosibilrwydd a risg gwleidyddol ffeministaidd.' },
                  ]
                },
              ].map(({ theme, entries }) => (
                <div key={theme} style={{ marginBottom: '24px' }}>
                  <h2 style={h2}>{theme}</h2>
                  {entries.map(({ ref, note }) => (
                    <div key={ref} style={{
                      marginBottom: '10px', padding: '10px 12px',
                      background: isDark ? '#222' : '#f8f8f8',
                      borderLeft: `3px solid ${border}`,
                    }}>
                      <p style={{ fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: text }}>{ref}</p>
                      <p style={{ fontSize: '12px', lineHeight: 1.6, color: text }}>{note}</p>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )

        case 'splott':
          return (
            <>
              <p style={p}>Mae Splott yn gymdogaeth yng nghanol dinas Caerdydd heb Gyngor Cymuned. Mae wedi'i ddewis fel safle peilot ar gyfer yr ymchwil hwn oherwydd ei fod yn cynrychioli'r union fwlch sefydliadol y mae'r ymchwil yn ceisio mynd i'r afael ag ef.</p>
              <h2 style={h2}>Pam Splott</h2>
              <p style={p}>Cymuned drefol fewnol heb y seilwaith sefydliadol ffurfiol i gyfranogi yn y penderfyniadau cynllunio sy'n siapio ble mae ei thrigolion yn byw. Nid diffyg ymgysylltiad yw'r broblem — diffyg mecanwaith dilysiedig i gynrychiolaeth yw hi.</p>
              <h2 style={h2}>Statws cyfredol</h2>
              <p style={p}>Mae perthnasoedd cymunedol a sifil wedi'u hadeiladu dros y deuddeg mis diwethaf. Mae'r ymchwil yn dechrau.</p>
              <p style={{ ...p, fontStyle: 'italic', color: subtle }}>[ Bydd nodiadau maes a diweddariadau yn ymddangos yma wrth i'r ymchwil fynd rhagddo. ]</p>
            </>
          )
      }
    }

    // English content
    switch (id) {

      case 'about':
        return (
          <>
            <p style={p}>This research investigates how communities are excluded from planning decisions — and whether building new digital infrastructure could return that power to them.</p>
            <h2 style={h2}>The problem</h2>
            <p style={p}>In urban planning, multiple types of power determine who gets a voice:</p>
            <ul style={ul}>
              <li style={li}><strong>Property power:</strong> Landowners can override everyone through legal rights</li>
              <li style={li}><strong>Economic power:</strong> Developers can override through capital</li>
              <li style={li}><strong>Institutional power:</strong> Local Authorities override through statutory powers</li>
              <li style={li}><strong>Epistemic power:</strong> Professionals control access through technical expertise</li>
            </ul>
            <p style={p}>Within already-excluded communities, majoritarian dynamics further silence disabled people, renters, and minorities.</p>
            <h2 style={h2}>Cardiff context</h2>
            <p style={p}>Cardiff has 28 wards. Six have Community Councils — but even these often offer only tokenistic consultation with no real decision-making power. The other 22 wards have no formal structure at all.</p>
            <p style={p}>The absence of a Community Council does not legally prevent a community from preparing a Place Plan — but it leaves the question of representation unanswered: how can a local authority satisfy itself that a group genuinely represents the neighbourhood, without requiring a new centralised institution?</p>
            <h2 style={h2}>Architecture of Agency</h2>
            <p style={p}>The PhD's central theoretical contribution proposes that spatial, institutional, and technical conditions together produce or foreclose community agency — and that redesigning any one of those three tiers changes who can act, contribute, and be present.</p>
            <p style={p}>Two diagnostic concepts ground the framework: <strong>Traced Absence</strong> — reconstructing from planning records who was systematically not present and what structural conditions produced that non-participation — and <strong>Traced Loss</strong> — what those absences produced: the decisions made, the environments shaped, the places planned without the knowledge of those who were excluded.</p>
            <h2 style={h2}>Research questions</h2>
            <ul style={ul}>
              <li style={li}>How can governance systems engage all stakeholders whilst centring the communities most affected by planning decisions?</li>
              <li style={li}>What mechanisms prevent both institutional capture and majoritarian tyranny in community participation?</li>
              <li style={li}>Can digital technology enable verified community agency without creating new centralisation points?</li>
              <li style={li}>What does Design Justice look like as civic infrastructure?</li>
              <li style={li}>How do we redistribute epistemic authority alongside decision-making power in urban planning?</li>
            </ul>
            <p style={note}>
              PhD Year 1 — Welsh School of Architecture, Cardiff University<br />
              Supervised by Prof. Mhairi McVicar, Dr Neil Turnbull, and Simon Gilbert (Head of Planning, Cardiff Council)
            </p>
          </>
        )

      case 'why-web3':
        return (
          <>
            <p style={p}>This research investigates whether distributed digital technology can help resolve a specific coordination failure in community planning — one where neither side can currently share the information they need without unacceptable privacy risks.</p>
            <h2 style={h2}>The coordination failure</h2>
            <p style={p}>For a community without a Community Council to produce a verified knowledge base for a Place Plan, coordination is needed across residents, community organisations, and the Council. But none of these parties can currently share the necessary information without creating unacceptable privacy or gatekeeping risks.</p>
            <p style={p}>The challenge runs in both directions. Communities cannot submit verified community evidence to the planning authority — but Community Councils and neighbourhood groups also cannot access relevant local authority data in a verified, privacy-respecting way.</p>
            <h2 style={h2}>Why distributed technology</h2>
            <p style={p}>Traditional database systems require someone to own and control the infrastructure. For urban governance, this means replacing Local Authority control with another centralised controller. The power structure doesn't change — it just moves.</p>
            <p style={p}>This research investigates whether technology that runs across a distributed network — where no single person or organisation owns the infrastructure — can support different coordination arrangements: ones where privacy is enforced technically, not merely promised.</p>
            {divider}
            {techLabel}
            <p style={p}>The specific focus is zero-knowledge credentials — a type of cryptographic proof that lets you verify something is true without revealing the underlying information. This means Cardiff Council could receive proof that a knowledge base was produced by a sufficiently representative cross-section of residents, without ever seeing who contributed what.</p>
            <p style={p}>Ethereum is an open-source computing platform that runs on a global network of computers — it is not owned by any single company. It can be used to store attestations publicly and auditably on-chain. Although it is widely known as a platform for digital currency, its infrastructure is investigated here for civic governance purposes, not financial ones.</p>
            <p style={p}>Technology does not solve social and political power problems. Accessibility is a core design requirement, not a footnote. This is why co-design with Splott residents determines the system's parameters — not technical assumptions made in advance.</p>
          </>
        )

      case 'governance':
        return (
          <>
            <p style={p}>This research investigates what governance should look like for community-held data. We don't have all the answers yet — that's what the PhD is here to find out.</p>
            <h2 style={h2}>Website visitor data</h2>
            <p style={p}>This site collects anonymised usage data: which pages you visit, how you navigate, device type, and country only. Cardiff University holds this data temporarily as steward during the PhD research (2025–2028). This is stewardship, not ownership. Upon research completion, governance will transition to community-determined structures.</p>
            <h2 style={h2}>Research data</h2>
            <p style={p}>Data from interviews with communities, planners, and other stakeholders will be governed with recognition of complex and sometimes competing interests. Different stakeholders have legitimate rights — there is no single simple answer.</p>
            <h2 style={h2}>What this research investigates</h2>
            <ul style={ul}>
              <li style={li}>How should multi-party research data be governed?</li>
              <li style={li}>What rights do different stakeholders have?</li>
              <li style={li}>How do you balance transparency with privacy?</li>
              <li style={li}>What does community data sovereignty mean when "community" isn't monolithic?</li>
            </ul>
            <h2 style={h2}>Current commitments</h2>
            <ul style={ul}>
              <li style={li}>Minimal collection — only what is necessary</li>
              <li style={li}>Full transparency about what is collected and why</li>
              <li style={li}>Cardiff University research ethics approval for all data collection</li>
              <li style={li}>Commitment to transition governance to communities post-PhD</li>
            </ul>
          </>
        )

      case 'privacy':
        return (
          <>
            <p style={{ fontSize: '11px', color: subtle, marginBottom: '16px' }}>Last updated: February 2025</p>
            <h2 style={h2}>What this site collects</h2>
            <p style={p}>Anonymised usage data: which pages you visit, how you navigate, device type (mobile/desktop), geographic region (country only). No personal information. No tracking cookies. No identifiable data.</p>
            <h2 style={h2}>Why we collect this</h2>
            <p style={p}>To understand how communities engage with data sovereignty research, and to improve the accessibility of content.</p>
            <h2 style={h2}>Where it is stored</h2>
            <p style={p}>Data is processed by Vercel Inc. under their privacy policy. Vercel Analytics is designed to be GDPR compliant.</p>
            <h2 style={h2}>Your rights</h2>
            <ul style={ul}>
              <li style={li}>Understand what data is collected — documented here</li>
              <li style={li}>Opt out — decline on the entry screen or clear browser data</li>
              <li style={li}>Contact us with questions or concerns</li>
            </ul>
            <p style={{ fontSize: '12px', marginTop: '20px', color: text }}>Contact: Lucy Dunhill — dunhilll@cardiff.ac.uk</p>
          </>
        )

      case 'contact':
        return (
          <>
            <p style={{ ...p, fontWeight: 700 }}>Lucy Dunhill</p>
            <p style={p}>PhD Researcher<br />Welsh School of Architecture, Cardiff University</p>
            <p style={p}><a href="mailto:dunhilll@cardiff.ac.uk" style={{ color: 'inherit', textDecoration: 'underline' }}>dunhilll@cardiff.ac.uk</a></p>
            <p style={p}>Available for meetings in Cardiff and online.</p>
            <div style={{ marginTop: '20px' }}>
              {[
                ['ORCID', 'https://orcid.org/0009-0009-3588-4823'],
                ['Cardiff Profile', 'https://profiles.cardiff.ac.uk/research-staff/dunhilll'],
                ['GitHub', 'https://github.com/Architecture-of-Agency/overview'],
                ['Website', 'https://architectureof.agency'],
              ].map(([label, url]) => (
                <p key={label} style={{ fontSize: '12px', marginBottom: '8px' }}>
                  <strong>{label}:</strong>{' '}
                  <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{url}</a>
                </p>
              ))}
            </div>
          </>
        )

      case 'phd-development':
        return (
          <>
            <p style={{ ...p, fontStyle: 'italic', color: subtle }}>A living record of the PhD's development. Updated as the research progresses.</p>
            <h2 style={h2}>Current stage</h2>
            <p style={p}>PhD Year 1, Welsh School of Architecture, Cardiff University. Currently establishing the theoretical framework, building institutional relationships, and beginning community engagement in Splott.</p>
            <h2 style={h2}>Confirmed partnerships</h2>
            <ul style={ul}>
              <li style={li}>Cardiff Council — Simon Gilbert (Head of Planning) as secondary supervisor</li>
              <li style={li}>AHRC Co-PP project led by Prof. Mhairi McVicar — running May–December 2026 in parallel with the research</li>
            </ul>
            <h2 style={h2}>Reflections and process notes</h2>
            <p style={{ ...p, fontStyle: 'italic', color: subtle }}>[ To be added as the research develops. ]</p>
            <h2 style={h2}>Key decisions</h2>
            <p style={{ ...p, fontStyle: 'italic', color: subtle }}>[ To be added as key decisions are made. ]</p>
          </>
        )

      case 'literature':
        return (
          <>
            <p style={{ ...p, fontStyle: 'italic', color: subtle }}>Organised by theme. Annotations will be expanded as the PhD progresses.</p>
            {[
              {
                theme: 'Planning Theory',
                entries: [
                  { ref: 'Arnstein (1969)', note: 'Foundational framework for participation. Establishes that most community engagement downloads responsibility without redistributing power. Developed by Rosen and Painter (2019) for contemporary planning contexts.' },
                  { ref: 'Rydin (2007)', note: 'Knowledge in planning functions as a contested resource whose legitimacy is socially determined — not a neutral input.' },
                  { ref: 'Miessen (2016)', note: 'Agonistic assembly as an alternative to consensus-based participation. Theoretical foundation for the knowledge base\'s non-consensus, pluralistic architecture.' },
                  { ref: 'Parvin (2021)', note: 'Community-led planning as an unresolved infrastructure problem.' },
                ],
              },
              {
                theme: 'Design Justice and Methodology',
                entries: [
                  { ref: 'Costanza-Chock (2020)', note: 'Umbrella framework for this research. Centres those most affected by design decisions in the design process itself — not as consultants, but as leaders.' },
                  { ref: 'Carroll et al. (2020)', note: 'The CARE Principles for Indigenous Data Governance: Collective Benefit, Authority to Control, Responsibility, Ethics.' },
                ],
              },
              {
                theme: 'Disability and Epistemic Justice',
                entries: [
                  { ref: 'Fricker (2007)', note: 'Hermeneutical injustice — the harm done when someone lacks the conceptual resources to understand their own experience. Central to the requirement that identity infrastructure must not encode existing exclusions.' },
                  { ref: 'Garland-Thomson (2011)', note: 'The misfit concept: the problem is not the body but the built environment that fails to accommodate it.' },
                  { ref: 'Hamraie (2017)', note: 'Critical disability theory applied to design. Design Justice is not accommodation — it is redesign.' },
                  { ref: 'Goodley (2013)', note: 'Critical disability studies framework integrated into the Architecture of Agency theoretical contribution.' },
                ],
              },
              {
                theme: 'Blockchain and Urban Systems',
                entries: [
                  { ref: 'Ietto et al. (2022); Muth et al. (2022); Rabe et al. (2021)', note: 'BBBlockchain Project, Berlin. Most substantive empirical evidence for blockchain in planning contexts — demonstrating both potential and limitations.' },
                  { ref: 'Schneider (2019)', note: 'Decentralisation claims frequently remain structurally incomplete and obscure persistent power asymmetries.' },
                  { ref: 'Lumineau et al. (2021)', note: 'Governance claims require empirical grounding.' },
                ],
              },
              {
                theme: 'Data Sovereignty and Feminism',
                entries: [
                  { ref: 'Haraway (1991)', note: 'Feminist epistemology foundational to the research\'s insistence that knowledge is always produced from a position — and that whose knowledge counts in planning is a political question, not a technical one.' },
                  { ref: 'Plant (1997)', note: 'Cyberfeminism integrated into the theoretical synthesis. Technology as a site of feminist political possibility and risk.' },
                ],
              },
            ].map(({ theme, entries }) => (
              <div key={theme} style={{ marginBottom: '24px' }}>
                <h2 style={h2}>{theme}</h2>
                {entries.map(({ ref, note }) => (
                  <div key={ref} style={{
                    marginBottom: '10px', padding: '10px 12px',
                    background: isDark ? '#222' : '#f8f8f8',
                    borderLeft: `3px solid ${border}`,
                  }}>
                    <p style={{ fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: text }}>{ref}</p>
                    <p style={{ fontSize: '12px', lineHeight: 1.6, color: text }}>{note}</p>
                  </div>
                ))}
              </div>
            ))}
          </>
        )

      case 'splott':
        return (
          <>
            <p style={p}>Splott is an inner-city neighbourhood in Cardiff without a Community Council. It is the identified pilot site for this research — selected because it represents precisely the institutional gap the research is trying to address.</p>
            <h2 style={h2}>Why Splott</h2>
            <p style={p}>An inner-city urban community without the formal institutional infrastructure to participate in the planning decisions that shape where its residents live. The problem is not lack of engagement — it is the absence of a verified mechanism for representation.</p>
            <h2 style={h2}>Current status</h2>
            <p style={p}>Community and civil society relationships have been built over the past twelve months. The research is beginning.</p>
            <p style={{ ...p, fontStyle: 'italic', color: subtle }}>[ Field notes and updates will appear here as the research progresses. ]</p>
          </>
        )

      default:
        return null
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────────

  if (!mounted) return null

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Architecture of Agency | Loading...</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
        </Head>
        <style jsx global>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Space Mono', monospace; background: #000000; overflow: hidden; }
          .boot-screen {
            position: fixed; inset: 0; background: #000000;
            display: flex; flex-direction: column; justify-content: center;
            padding: 60px; animation: fadeIn 0.2s ease-in;
          }
          .boot-line {
            font-size: 13px; color: #00cc00; margin-bottom: 6px;
            animation: blink-in 0.1s ease-in;
            font-family: 'Space Mono', monospace;
          }
          .boot-line.welcome { color: #ffffff; font-weight: 700; font-size: 15px; margin-bottom: 20px; }
          .boot-cursor {
            display: inline-block; width: 8px; height: 14px;
            background: #00cc00; animation: blink 0.8s step-end infinite;
            vertical-align: middle; margin-left: 4px;
          }
          .boot-bar-container {
            width: 300px; height: 16px; background: #111;
            border: 1px solid #00cc00; overflow: hidden; margin-top: 30px;
          }
          .boot-bar-fill {
            height: 100%; background: #00cc00;
            width: 0%; animation: loadingFill 3.5s linear forwards;
          }
          @keyframes loadingFill { 0% { width: 0% } 100% { width: 100% } }
          @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
          @keyframes blink { 50% { opacity: 0 } }
          @keyframes blink-in { from { opacity: 0 } to { opacity: 1 } }
        `}</style>
        <audio ref={audioRef} preload="auto"><source src="/audio/startup.mp3" type="audio/mpeg" /></audio>
        <div className="boot-screen">
          {bootMessages.map((msg, i) => (
            <div key={i} className={`boot-line${msg === 'Welcome.' ? ' welcome' : ''}`}>
              {msg === 'Welcome.' ? '' : '> '}{msg}
            </div>
          ))}
          {bootMessages.length > 0 && <span className="boot-cursor" />}
          <div className="boot-bar-container">
            <div className="boot-bar-fill" />
          </div>
        </div>
      </>
    )
  }

  if (!hasEntered) {
    return (
      <>
        <Head>
          <title>Architecture of Agency</title>
          <meta name="description" content="PhD Research — Welsh School of Architecture, Cardiff University" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
        </Head>
        <style jsx global>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Space Mono', monospace; background: ${isDark ? '#1a1a1a' : '#e6e6e6'}; color: ${text}; display: flex; align-items: center; justify-content: center; min-height: 100vh; line-height: 1.6; }
          button { font-family: 'Space Mono', monospace; }
        `}</style>
        <audio ref={audioRef} preload="auto"><source src="/audio/startup.mp3" type="audio/mpeg" /></audio>
        <main style={{ maxWidth: '600px', padding: '40px', background: surface, border: `2px solid ${border}`, boxShadow: '4px 4px 0 rgba(0,0,0,0.3)', position: 'relative' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>Architecture of Agency</h1>
          <p style={{ fontSize: '12px', textAlign: 'center', marginBottom: '32px', color: subtle }}>PhD Research — Welsh School of Architecture, Cardiff University</p>
          <p style={{ fontSize: '14px', marginBottom: '16px' }}>This site collects anonymised usage data for research purposes:</p>
          <ul style={{ marginLeft: '24px', marginBottom: '16px', fontSize: '14px', listStyle: 'disc' }}>
            {['Which pages you visit', 'How you navigate the site', 'Device type and region (country only)'].map((b, i) => <li key={i} style={{ marginBottom: '8px' }}>{b}</li>)}
          </ul>
          <p style={{ fontSize: '14px', marginBottom: '16px' }}>This helps us understand how communities engage with data sovereignty research.</p>
          <p style={{ fontSize: '14px', marginBottom: '32px', fontWeight: 700 }}>No personal information is collected.</p>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <button onClick={() => handleConsent(true)} style={{ flex: 1, padding: '12px 24px', fontSize: '14px', fontWeight: 700, background: isDark ? '#ffffff' : '#000000', color: isDark ? '#000000' : '#ffffff', border: 'none', cursor: 'pointer', boxShadow: '2px 2px 0 rgba(0,0,0,0.3)' }}>Accept and enter</button>
            <button onClick={() => handleConsent(false)} style={{ flex: 1, padding: '12px 24px', fontSize: '14px', fontWeight: 700, background: surface, color: text, border: `2px solid ${border}`, cursor: 'pointer', boxShadow: '2px 2px 0 rgba(0,0,0,0.3)' }}>Decline and enter</button>
          </div>
          <p style={{ fontSize: '12px', textAlign: 'center', color: subtle }}>
            <a href="#" onClick={(e) => { e.preventDefault(); handleConsent(false); setTimeout(() => openWindow('privacy'), 600) }} style={{ color: 'inherit', textDecoration: 'underline' }}>Read full privacy policy</a>
          </p>
          <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '8px' }}>
            <button onClick={toggleTheme} style={{ padding: '8px 12px', fontSize: '11px', background: surface, color: text, border: `1px solid ${border}`, cursor: 'pointer' }}>{isDark ? '☀' : '☾'}</button>
            <button onClick={() => setLang(lang === 'en' ? 'cy' : 'en')} style={{ padding: '8px 12px', fontSize: '11px', background: surface, color: text, border: `1px solid ${border}`, cursor: 'pointer' }}>{lang === 'en' ? 'CY' : 'EN'}</button>
          </div>
        </main>
      </>
    )
  }

  // Pixel art cursors as SVG data URIs — match the theme
  const C = isDark  // shorthand
  const FILL  = C ? '#e0e0e0' : '#ffffff'
  const MID   = C ? '#aaaaaa' : '#cccccc'
  const DARK  = C ? '#333333' : '#000000'

  // Arrow cursor — classic pixel art arrow pointing top-left
  const cursorArrow = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' shape-rendering='crispEdges'>
    <rect x='0' y='0' width='2' height='12' fill='${DARK}'/>
    <rect x='2' y='2' width='2' height='8' fill='${DARK}'/>
    <rect x='4' y='4' width='2' height='6' fill='${DARK}'/>
    <rect x='6' y='6' width='2' height='4' fill='${DARK}'/>
    <rect x='8' y='8' width='2' height='2' fill='${DARK}'/>
    <rect x='1' y='1' width='1' height='10' fill='${FILL}'/>
    <rect x='3' y='3' width='1' height='6' fill='${FILL}'/>
    <rect x='5' y='5' width='1' height='4' fill='${FILL}'/>
    <rect x='7' y='7' width='1' height='2' fill='${FILL}'/>
    <rect x='2' y='9' width='2' height='2' fill='${FILL}'/>
    <rect x='4' y='7' width='2' height='2' fill='${FILL}'/>
    <rect x='3' y='10' width='1' height='2' fill='${MID}'/>
    <rect x='5' y='8' width='1' height='1' fill='${MID}'/>
  </svg>`)}`

  // Pointer cursor — pointing finger hand
  const cursorPointer = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' shape-rendering='crispEdges'>
    <rect x='4' y='0' width='2' height='8' fill='${DARK}'/>
    <rect x='6' y='0' width='2' height='1' fill='${DARK}'/>
    <rect x='2' y='6' width='2' height='1' fill='${DARK}'/>
    <rect x='8' y='1' width='2' height='7' fill='${DARK}'/>
    <rect x='10' y='3' width='2' height='6' fill='${DARK}'/>
    <rect x='2' y='7' width='10' height='5' fill='${DARK}'/>
    <rect x='2' y='12' width='12' height='2' fill='${DARK}'/>
    <rect x='4' y='14' width='8' height='2' fill='${DARK}'/>
    <rect x='5' y='1' width='1' height='6' fill='${FILL}'/>
    <rect x='7' y='2' width='1' height='5' fill='${FILL}'/>
    <rect x='9' y='4' width='1' height='4' fill='${FILL}'/>
    <rect x='3' y='8' width='8' height='3' fill='${FILL}'/>
    <rect x='3' y='11' width='10' height='1' fill='${MID}'/>
    <rect x='5' y='13' width='6' height='1' fill='${MID}'/>
  </svg>`)}`

  // Grab cursor — open hand
  const cursorGrab = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' shape-rendering='crispEdges'>
    <rect x='2' y='4' width='2' height='6' fill='${DARK}'/>
    <rect x='4' y='2' width='2' height='8' fill='${DARK}'/>
    <rect x='6' y='2' width='2' height='8' fill='${DARK}'/>
    <rect x='8' y='3' width='2' height='7' fill='${DARK}'/>
    <rect x='10' y='4' width='2' height='6' fill='${DARK}'/>
    <rect x='2' y='10' width='12' height='4' fill='${DARK}'/>
    <rect x='2' y='14' width='12' height='1' fill='${DARK}'/>
    <rect x='3' y='5' width='1' height='4' fill='${FILL}'/>
    <rect x='5' y='3' width='1' height='6' fill='${FILL}'/>
    <rect x='7' y='3' width='1' height='6' fill='${FILL}'/>
    <rect x='9' y='4' width='1' height='5' fill='${FILL}'/>
    <rect x='11' y='5' width='1' height='4' fill='${FILL}'/>
    <rect x='3' y='11' width='10' height='2' fill='${FILL}'/>
    <rect x='3' y='13' width='10' height='1' fill='${MID}'/>
  </svg>`)}`

  // Grabbing cursor — closed fist
  const cursorGrabbing = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' shape-rendering='crispEdges'>
    <rect x='2' y='6' width='12' height='6' fill='${DARK}'/>
    <rect x='2' y='5' width='2' height='1' fill='${DARK}'/>
    <rect x='4' y='4' width='6' height='1' fill='${DARK}'/>
    <rect x='10' y='5' width='2' height='1' fill='${DARK}'/>
    <rect x='12' y='6' width='2' height='2' fill='${DARK}'/>
    <rect x='2' y='12' width='12' height='2' fill='${DARK}'/>
    <rect x='4' y='14' width='8' height='1' fill='${DARK}'/>
    <rect x='3' y='7' width='10' height='4' fill='${FILL}'/>
    <rect x='3' y='6' width='9' height='1' fill='${MID}'/>
    <rect x='3' y='11' width='10' height='1' fill='${MID}'/>
    <rect x='3' y='13' width='10' height='1' fill='${MID}'/>
    <rect x='5' y='14' width='6' height='1' fill='${MID}'/>
  </svg>`)}`

  const cursorCSS = {
    default:  `url("${cursorArrow}") 0 0, default`,
    pointer:  `url("${cursorPointer}") 4 0, pointer`,
    grab:     `url("${cursorGrab}") 6 0, grab`,
    grabbing: `url("${cursorGrabbing}") 6 0, grabbing`,
  }

  return (
    <>
      <Head>
        <title>Architecture of Agency</title>
        <meta name="description" content="PhD research — Welsh School of Architecture, Cardiff University" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Space Mono', 'Courier New', monospace;
          background: ${bg}; color: ${text};
          overflow: hidden; height: 100vh;
          cursor: ${cursorCSS[cursorStyle]};
        }
        .desktop {
          height: 100vh; padding: 20px; padding-bottom: 220px;
          position: relative; user-select: none;
          background: ${isDark ? '#0a0a1a' : '#aec6d4'};
          overflow: hidden;
        }
        .desktop::after {
          content: '';
          position: fixed; inset: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, ${isDark ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.04)'} 2px, ${isDark ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.04)'} 4px);
          pointer-events: none; z-index: 9998;
        }
        .skyline {
          position: fixed;
          bottom: 32px; left: 0; right: 0;
          height: 180px;
          pointer-events: none;
          z-index: 1;
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        .desktop-fade-in { animation: fadeIn 0.8s ease-in; }

        .desktop-icon {
          position: absolute; display: flex; flex-direction: column;
          align-items: center; gap: 6px; cursor: ${cursorCSS.pointer};
          padding: 8px; width: ${cs.width}px;
        }
        .desktop-icon.selected {
          background: ${isDark ? 'rgba(100,100,255,0.25)' : 'rgba(0,0,200,0.15)'};
          outline: 1px dotted ${isDark ? '#6666ff' : '#0000cc'};
        }
        .desktop-icon.dragging { opacity: 0.45; }
        .icon-label {
          font-size: ${cs.font}px; text-align: center;
          max-width: ${cs.width}px; line-height: 1.3;
          overflow-wrap: break-word; word-break: keep-all;
          color: ${text};
          text-shadow: ${isDark ? 'none' : '1px 1px 0 rgba(255,255,255,0.7)'};
        }

        .window {
          position: fixed; width: min(680px, 92vw); max-height: 78vh;
          background: ${surface}; border: 2px solid ${border};
          box-shadow: 6px 6px 0 rgba(0,0,0,0.4);
          display: flex; flex-direction: column;
        }
        .window-titlebar {
          background: ${isDark ? '#1a1a1a' : '#000000'}; color: #ffffff;
          padding: 7px 10px; display: flex; justify-content: space-between; align-items: center;
          border-bottom: 2px solid ${border}; cursor: ${cursorCSS.grab}; user-select: none;
        }
        .window-titlebar:active { cursor: ${cursorCSS.grabbing}; }
        .window-title { font-size: 13px; font-weight: 700; }
        .window-close {
          background: #ff4444; border: 1px solid #000; width: 16px; height: 16px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          font-size: 11px; color: #000; font-family: 'Space Mono', monospace; flex-shrink: 0;
        }
        .window-close:hover { background: #ff6666; }
        .window-tabs {
          display: flex; overflow-x: auto; background: var(--tab-bg);
          border-bottom: 1px solid var(--border); scrollbar-width: none;
        }
        .window-tabs::-webkit-scrollbar { display: none; }
        .window-tab {
          padding: 4px 10px; font-family: 'Space Mono', monospace; font-size: 10px;
          background: transparent; border: none; border-right: 1px solid var(--border);
          color: var(--subtle); cursor: pointer; white-space: nowrap; flex-shrink: 0;
        }
        .window-tab:hover { color: var(--text); }
        .window-tab.active { font-weight: 700; color: var(--text); }
        .window-minimise {
          background: #ffaa00; border: 1px solid #000; width: 16px; height: 16px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          font-size: 14px; line-height: 1; color: #000; font-family: 'Space Mono', monospace;
        }
        .window-minimise:hover { background: #ffcc44; }
        .minimised-slot {
          padding: 2px 8px; font-family: 'Space Mono', monospace; font-size: 10px; font-weight: 700;
          background: var(--surface); border: 1px solid var(--border);
          color: var(--text); cursor: pointer; height: 22px;
          max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .minimised-slot:hover { opacity: 0.8; }
        .window-content { padding: 20px 24px; overflow-y: auto; flex: 1; }
        .window-content::-webkit-scrollbar { width: 12px; }
        .window-content::-webkit-scrollbar-track { background: ${isDark ? '#1a1a1a' : '#ddd'}; border-left: 1px solid ${border}; }
        .window-content::-webkit-scrollbar-thumb { background: ${isDark ? '#555' : '#999'}; border: 1px solid ${border}; }

        .menubar {
          position: fixed; bottom: 0; left: 0; right: 0; height: 32px;
          background: ${isDark ? '#2a2a2a' : '#dddddd'};
          border-top: 1px solid ${border};
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 8px; font-size: 12px; z-index: 9999;
          box-shadow: 0 -1px 0 ${isDark ? '#1a1a1a' : '#ffffff'};
        }
        .menubar-left { display: flex; align-items: center; gap: 8px; }
        .menubar-right { display: flex; align-items: center; gap: 8px; }
        .menu-btn {
          display: flex; align-items: center; padding: 3px 10px;
          background: ${isDark ? '#3a3a3a' : '#e0e0e0'};
          border: 2px solid ${isDark ? '#555' : '#999'};
          font-family: 'Space Mono', monospace; font-size: 12px; font-weight: 700;
          color: ${text}; cursor: pointer; height: 24px; border-radius: 2px;
        }
        .menu-btn:hover { background: ${isDark ? '#4a4a4a' : '#d0d0d0'}; border-color: ${border}; }
        .menu-btn.open { background: ${isDark ? '#0000ff' : '#000000'}; color: #ffffff; border-color: ${isDark ? '#0000ff' : '#000000'}; }
        .apple-menu {
          position: fixed; bottom: 34px; left: 8px;
          background: ${surface}; border: 1px solid ${border};
          box-shadow: 0 -2px 8px rgba(0,0,0,0.3); min-width: 220px; z-index: 10000;
        }
        .apple-menu-item {
          display: block; width: 100%; padding: 7px 18px;
          background: transparent; border: none; text-align: left;
          font-family: 'Space Mono', monospace; font-size: 12px; color: ${text}; cursor: pointer;
        }
        .apple-menu-item:hover { background: ${isDark ? '#0000ff' : '#000000'}; color: #ffffff; }
        .apple-menu-sep { height: 1px; background: ${isDark ? '#555' : '#999'}; margin: 4px 0; }
        .clock { font-size: 12px; font-weight: 700; color: ${text}; padding: 0 8px; border-left: 1px solid ${isDark ? '#555' : '#999'}; margin-left: 4px; }
        .size-btn {
          padding: 2px 7px; background: ${isDark ? '#3a3a3a' : '#e0e0e0'};
          border: 1px solid ${isDark ? '#555' : '#999'};
          font-family: 'Space Mono', monospace; font-size: 11px; font-weight: 700;
          color: ${text}; cursor: pointer;
        }
        .size-btn:hover { background: ${isDark ? '#4a4a4a' : '#d0d0d0'}; }
        .size-btn.active { background: ${isDark ? '#0000ff' : '#000000'}; color: #ffffff; border-color: ${isDark ? '#0000ff' : '#000000'}; }
        .cursor-dot {
          position: fixed; width: 8px; height: 8px;
          background: ${isDark ? '#ffffff' : '#000000'};
          pointer-events: none; z-index: 9997;
          animation: dotFade 0.6s linear forwards;
          image-rendering: pixelated;
        }
        @keyframes dotFade { 0% { opacity: 0.9; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } 100% { opacity: 0; transform: scale(0.4); } }
        .drag-shadow {
          position: fixed; width: ${cs.icon}px; height: ${cs.icon}px;
          background: rgba(0,0,0,0.15); border: 2px dashed ${isDark ? '#888' : '#555'};
          pointer-events: none; z-index: 9996; transform: translate(-50%, -50%);
        }
        @media (max-width: 768px) {
          .menubar { font-size: 11px; padding: 0 4px; }
          .menu-btn { font-size: 11px; padding: 2px 8px; }
          .clock { font-size: 11px; }
        }
      `}</style>

      <audio ref={audioRef} preload="auto"><source src="/audio/startup.mp3" type="audio/mpeg" /></audio>

      {/* Splott streetscape — animated pixel art banner */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes walkR { from { transform: translateX(-80px) } to { transform: translateX(1280px) } }
        @keyframes walkL { from { transform: translateX(1280px) } to { transform: translateX(-80px) } }
        @keyframes busR  { from { transform: translateX(-200px) } to { transform: translateX(1400px) } }
        @keyframes busL  { from { transform: translateX(1400px) } to { transform: translateX(-200px) } }
        .walk-r { animation: walkR linear infinite; }
        .walk-l { animation: walkL linear infinite; }
        .bus-r   { animation: busR linear infinite; }
        .bus-l   { animation: busL linear infinite; }
      `}} />
      <div className="skyline" aria-hidden="true" style={{ overflow: 'hidden' }}>
        <svg width="100%" height="180" viewBox="0 0 1200 180"
          preserveAspectRatio="xMidYMax meet" shapeRendering="crispEdges"
          style={{ display: 'block', overflow: 'visible' }}>

          {/* ── Sky ── */}
          <rect x="0" y="0"   width="1200" height="180" fill={isDark?'#0a0a1a':'#c8dde8'}/>
          <rect x="0" y="0"   width="1200" height="60"  fill={isDark?'#080812':'#aec6d4'}/>
          <rect x="0" y="60"  width="1200" height="40"  fill={isDark?'#0a0a1a':'#bcd5e2'}/>

          {/* ── Ground plane — everything sits on y=130 ── */}
          {/* Pavement */}
          <rect x="0"   y="130" width="1200" height="6"  fill={isDark?'#2a2a2a':'#999999'}/>
          <rect x="0"   y="136" width="1200" height="2"  fill={isDark?'#333':'#aaa'}/>
          {/* Road */}
          <rect x="0"   y="138" width="1200" height="28" fill={isDark?'#1a1a1a':'#555555'}/>
          {/* Road centre line dashes */}
          {Array.from({length:24},(_,i)=>(
            <rect key={i} x={i*52} y="151" width="32" height="3" fill={isDark?'#444':'#777'}/>
          ))}
          {/* Kerb line */}
          <rect x="0"   y="130" width="1200" height="2"  fill={isDark?'#555':'#bbbbbb'}/>
          <rect x="0"   y="136" width="1200" height="2"  fill={isDark?'#222':'#888'}/>

          {/* ── FAR LEFT: Park / green space ── */}
          {/* Grass */}
          <rect x="0"   y="100" width="90"  height="30" fill={isDark?'#1a2a1a':'#559955'}/>
          <rect x="0"   y="96"  width="90"  height="4"  fill={isDark?'#2a3a2a':'#66aa66'}/>
          {/* Park fence */}
          {Array.from({length:9},(_,i)=>(
            <g key={i}>
              <rect x={i*10+2} y="116" width="2" height="14" fill={isDark?'#4a3a2a':'#886644'}/>
              <rect x={i*10+2} y="115" width="8" height="2"  fill={isDark?'#6a5a3a':'#aa8855'}/>
            </g>
          ))}
          {/* Park trees */}
          <rect x="10"  y="88"  width="18" height="28" fill={isDark?'#1a3a1a':'#4a8a4a'}/>
          <rect x="10"  y="88"  width="8"  height="14" fill={isDark?'#2a4a2a':'#5a9a5a'}/>
          <rect x="8"   y="115" width="5"  height="15" fill={isDark?'#3a2a1a':'#664422'}/>
          <rect x="50"  y="92"  width="22" height="24" fill={isDark?'#1a3a1a':'#4a8a4a'}/>
          <rect x="50"  y="92"  width="10" height="12" fill={isDark?'#2a4a2a':'#5a9a5a'}/>
          <rect x="57"  y="115" width="5"  height="15" fill={isDark?'#3a2a1a':'#664422'}/>
          {/* Park bench */}
          <rect x="30"  y="120" width="18" height="3"  fill={isDark?'#6a5a3a':'#aa8855'}/>
          <rect x="31"  y="123" width="2"  height="7"  fill={isDark?'#4a3a2a':'#886644'}/>
          <rect x="45"  y="123" width="2"  height="7"  fill={isDark?'#4a3a2a':'#886644'}/>

          {/* ── LEFT TERRACES ── */}
          {/* Terrace row 1 */}
          <rect x="90"  y="72"  width="120" height="58" fill={isDark?'#3a2a1a':'#bb9977'}/>
          <rect x="90"  y="72"  width="120" height="4"  fill={isDark?'#2a1a0a':'#997755'}/>
          {/* Bay windows */}
          {[95,109,123,137,151,165,179,193].map(x=>(
            <g key={x}>
              <rect x={x} y="82" width="9" height="11" fill={isDark?'#223344':'#88aacc'}/>
              <rect x={x} y="99" width="9" height="11" fill={isDark?'#223344':'#88aacc'}/>
              <rect x={x+4} y="82" width="1" height="11" fill={isDark?'#111':'#5577aa'}/>
              <rect x={x+4} y="99" width="1" height="11" fill={isDark?'#111':'#5577aa'}/>
              <rect x={x}   y="92" width="9" height="1"  fill={isDark?'#111':'#5577aa'}/>
              <rect x={x}   y="109" width="9" height="1" fill={isDark?'#111':'#5577aa'}/>
            </g>
          ))}
          {/* Chimneys */}
          {[95,130,165,198].map(x=>(
            <rect key={x} x={x} y="60" width="8" height="12" fill={isDark?'#3a2a1a':'#997755'}/>
          ))}
          {/* Chimney pots */}
          {[95,130,165,198].map(x=>(
            <rect key={x} x={x+2} y="57" width="4" height="4" fill={isDark?'#555':'#777'}/>
          ))}
          {/* Party walls */}
          {[104,119,134,149,164,179,194].map(x=>(
            <rect key={x} x={x} y="72" width="2" height="58" fill={isDark?'#2a1a0a':'#997755'}/>
          ))}
          {/* Doors */}
          {[97,127,157,187].map(x=>(
            <g key={x}>
              <rect x={x}   y="112" width="10" height="18" fill={isDark?'#3355aa':'#4466bb'}/>
              <rect x={x+2} y="114" width="3"  height="5"  fill={isDark?'#4477cc':'#6688dd'}/>
              <rect x={x+6} y="114" width="3"  height="5"  fill={isDark?'#4477cc':'#6688dd'}/>
            </g>
          ))}

          {/* ── SCV CHARITY SHOP ── */}
          <rect x="210" y="78"  width="85"  height="52" fill={isDark?'#2a2a3a':'#cc4444'}/>
          <rect x="210" y="78"  width="85"  height="6"  fill={isDark?'#1a1a2a':'#aa2222'}/>
          {/* Awning — sits at pavement level y=114 */}
          <rect x="208" y="114" width="89"  height="10" fill={isDark?'#4a3a1a':'#ffcc00'}/>
          {Array.from({length:11},(_,i)=>(
            <rect key={i} x={208+i*8} y="114" width="4" height="10" fill={isDark?'#3a2a0a':'#cc9900'}/>
          ))}
          {/* Shop window */}
          <rect x="218" y="90"  width="65"  height="22" fill={isDark?'#334455':'#aaccee'}/>
          <rect x="238" y="90"  width="2"   height="22" fill={isDark?'#223':'#7799bb'}/>
          <rect x="258" y="90"  width="2"   height="22" fill={isDark?'#223':'#7799bb'}/>
          {/* Sign */}
          <rect x="212" y="80"  width="81"  height="10" fill={isDark?'#ffffff':'#ffffff'}/>
          <text x="215" y="89" fontFamily="Space Mono, monospace" fontSize="7" fontWeight="700" fill="#cc4444">SCV CHARITY SHOP</text>
          {/* Door at ground y=114 */}
          <rect x="245" y="114" width="14"  height="16" fill={isDark?'#334455':'#6688aa'}/>
          <rect x="247" y="116" width="4"   height="6"  fill={isDark?'#445566':'#88aacc'}/>
          <rect x="253" y="116" width="4"   height="6"  fill={isDark?'#445566':'#88aacc'}/>
          {/* Chimney */}
          <rect x="245" y="66"  width="8"   height="12" fill={isDark?'#3a2a1a':'#997755'}/>

          {/* ── CORNER SHOP ── */}
          <rect x="295" y="82"  width="65"  height="48" fill={isDark?'#1a3a1a':'#559944'}/>
          <rect x="295" y="82"  width="65"  height="5"  fill={isDark?'#0a2a0a':'#336633'}/>
          {/* Awning at y=114 */}
          <rect x="293" y="114" width="69"  height="8"  fill={isDark?'#3a5a3a':'#66aa44'}/>
          {/* Window */}
          <rect x="300" y="90"  width="55"  height="22" fill={isDark?'#334455':'#aaccee'}/>
          <rect x="325" y="90"  width="2"   height="22" fill={isDark?'#223':'#7799bb'}/>
          {/* Sign */}
          <rect x="297" y="84"  width="61"  height="8"  fill="#fff"}/>
          <text x="300" y="91" fontFamily="Space Mono, monospace" fontSize="6" fontWeight="700" fill="#336633">CORNER SHOP</text>
          {/* Door */}
          <rect x="315" y="114" width="12"  height="16" fill={isDark?'#334455':'#6688aa'}/>

          {/* ── STREET LAMP 1 — base on y=130 ── */}
          <rect x="375" y="70"  width="4"   height="60" fill={isDark?'#555':'#888'}/>
          <rect x="369" y="70"  width="16"  height="4"  fill={isDark?'#555':'#888'}/>
          <rect x="369" y="66"  width="16"  height="4"  fill={isDark?'#ffeeaa':'#ffffcc'}/>
          <rect x="373" y="126" width="6"   height="4"  fill={isDark?'#444':'#777'}/>

          {/* ── SPLOTT MAGIC ROUNDABOUT — centrepiece ── */}
          {/* Road around roundabout */}
          <rect x="390" y="130" width="290" height="36" fill={isDark?'#1a1a1a':'#555555'}/>
          {/* Island — green oval, fully above ground */}
          <rect x="440" y="94"  width="180" height="4"  fill={isDark?'#1a3a1a':'#4a8a4a'}/>
          <rect x="426" y="98"  width="208" height="4"  fill={isDark?'#1a3a1a':'#4a8a4a'}/>
          <rect x="416" y="102" width="228" height="28" fill={isDark?'#1a3a1a':'#5a9a5a'}/>
          <rect x="416" y="102" width="228" height="6"  fill={isDark?'#2a4a2a':'#6aaa6a'}/>
          <rect x="416" y="128" width="228" height="2"  fill={isDark?'#1a3a1a':'#4a8a4a'}/>
          <rect x="426" y="130" width="208" height="2"  fill={isDark?'#1a2a1a':'#3a7a3a'}/>
          {/* Kerb */}
          <rect x="438" y="92"  width="184" height="4"  fill={isDark?'#444':'#aaa'}/>
          <rect x="414" y="130" width="232" height="2"  fill={isDark?'#444':'#aaa'}/>
          {/* Roundabout sculptures */}
          {/* 1 — chevron cylinder */}
          <rect x="455" y="96"  width="22"  height="22" fill="#cc2222"/>
          {[96,99,102,105,108,111,114].map((y,i)=>(
            <rect key={y} x="455" y={y} width="22" height="2" fill={i%2===0?'#cc2222':'#111111'}/>
          ))}
          <rect x="453" y="96"  width="26"  height="2"  fill={isDark?'#888':'#aaa'}/>
          {/* 2 — tilted warning sign */}
          <rect x="490" y="91"  width="26"  height="26" fill="#ffcc00"/>
          <rect x="490" y="91"  width="26"  height="3"  fill="#cc9900"/>
          <rect x="490" y="91"  width="3"   height="26" fill="#cc9900"/>
          <rect x="500" y="95"  width="4"   height="12" fill="#000"/>
          <rect x="500" y="109" width="4"   height="4"  fill="#000"/>
          {/* 3 — triangle stack */}
          <rect x="528" y="110" width="30"  height="4"  fill="#dd4444"/>
          <rect x="532" y="106" width="22"  height="4"  fill="#cc3333"/>
          <rect x="536" y="102" width="14"  height="4"  fill="#bb2222"/>
          <rect x="540" y="98"  width="6"   height="4"  fill="#aa1111"/>
          {[528,532,536].map(x=>(
            <rect key={x} x={x+2} y="110" width="4" height="4" fill="#ffffff"/>
          ))}
          {/* 4 — sphere of signs */}
          <rect x="568" y="96"  width="30"  height="30" fill="#3355aa"/>
          <rect x="568" y="96"  width="30"  height="5"  fill="#5577cc"/>
          <rect x="568" y="96"  width="5"   height="30" fill="#5577cc"/>
          {[[572,100,'#cc2222'],[580,100,'#22aa22'],[588,100,'#ffcc00'],
            [572,108,'#22aa22'],[580,108,'#3355aa'],[588,108,'#cc2222'],
            [572,116,'#ffcc00'],[580,116,'#cc2222'],[588,116,'#22aa22']].map(([x,y,c],i)=>(
            <rect key={i} x={x as number} y={y as number} width="6" height="6" fill={c as string}/>
          ))}
          {/* Small bush shapes on island */}
          {[430,610].map(x=>(
            <g key={x}>
              <rect x={x}   y="114" width="14" height="14" fill={isDark?'#1a3a1a':'#4a7a4a'}/>
              <rect x={x}   y="114" width="6"  height="7"  fill={isDark?'#2a4a2a':'#5a8a5a'}/>
              <rect x={x+3} y="127" width="6"  height="3"  fill={isDark?'#3a2a1a':'#664422'}/>
            </g>
          ))}

          {/* ── TERRACE ROW 2 — right of roundabout ── */}
          <rect x="690" y="76"  width="100" height="54" fill={isDark?'#3a2a1a':'#bb9977'}/>
          <rect x="690" y="76"  width="100" height="4"  fill={isDark?'#2a1a0a':'#997755'}/>
          {[695,709,723,737,751,765,779].map(x=>(
            <g key={x}>
              <rect x={x} y="86" width="9" height="11" fill={isDark?'#223344':'#88aacc'}/>
              <rect x={x} y="103" width="9" height="11" fill={isDark?'#223344':'#88aacc'}/>
              <rect x={x+4} y="86" width="1" height="11" fill={isDark?'#111':'#5577aa'}/>
              <rect x={x+4} y="103" width="1" height="11" fill={isDark?'#111':'#5577aa'}/>
            </g>
          ))}
          {[695,725,755,780].map(x=>(
            <rect key={x} x={x} y="64" width="8" height="12" fill={isDark?'#3a2a1a':'#997755'}/>
          ))}
          {[704,719,734,749,764,779].map(x=>(
            <rect key={x} x={x} y="76" width="2" height="54" fill={isDark?'#2a1a0a':'#997755'}/>
          ))}
          {[697,727,757].map(x=>(
            <g key={x}>
              <rect x={x}   y="114" width="10" height="16" fill={isDark?'#3355aa':'#4466bb'}/>
              <rect x={x+2} y="116" width="3"  height="5"  fill={isDark?'#4477cc':'#6688dd'}/>
              <rect x={x+6} y="116" width="3"  height="5"  fill={isDark?'#4477cc':'#6688dd'}/>
            </g>
          ))}

          {/* ── AoA BILLBOARD — sits on ground with legs ── */}
          {/* Legs from y=130 up */}
          <rect x="810" y="100" width="5"   height="30" fill={isDark?'#555':'#886633'}/>
          <rect x="855" y="100" width="5"   height="30" fill={isDark?'#444':'#775522'}/>
          {/* Hoarding frame */}
          <rect x="802" y="66"  width="66"  height="36" fill={isDark?'#3a3a1a':'#ccbb88'}/>
          <rect x="802" y="66"  width="66"  height="3"  fill={isDark?'#2a2a0a':'#aa9966'}/>
          <rect x="802" y="66"  width="3"   height="36" fill={isDark?'#2a2a0a':'#aa9966'}/>
          <rect x="865" y="66"  width="3"   height="36" fill={isDark?'#111':'#998855'}/>
          {/* Billboard face */}
          <rect x="805" y="69"  width="60"  height="30" fill={isDark?'#111122':'#f5f0e8'}/>
          <text x="810" y="82" fontFamily="Space Mono, monospace" fontSize="7" fontWeight="700"
            fill={isDark?'#ffffff':'#000000'}>Architecture</text>
          <text x="816" y="93" fontFamily="Space Mono, monospace" fontSize="7" fontWeight="700"
            fill={isDark?'#ffffff':'#000000'}>of Agency</text>

          {/* ── STREET LAMP 2 — base on y=130 ── */}
          <rect x="880" y="70"  width="4"   height="60" fill={isDark?'#555':'#888'}/>
          <rect x="874" y="70"  width="16"  height="4"  fill={isDark?'#555':'#888'}/>
          <rect x="874" y="66"  width="16"  height="4"  fill={isDark?'#ffeeaa':'#ffffcc'}/>
          <rect x="878" y="126" width="6"   height="4"  fill={isDark?'#444':'#777'}/>

          {/* ── STAR CENTRE ── */}
          {/* Main brick block */}
          <rect x="920" y="58"  width="190" height="72" fill={isDark?'#3a2a1a':'#bb8855'}/>
          <rect x="920" y="58"  width="190" height="6"  fill={isDark?'#2a1a0a':'#996633'}/>
          {/* Brick courses */}
          {[110,116,122].map(y=>(
            <rect key={y} x="920" y={y} width="190" height="1" fill={isDark?'#2a1a0a':'#996633'}/>
          ))}
          {/* Metal cladding over large windows */}
          <rect x="960" y="66"  width="110" height="28" fill={isDark?'#334455':'#667788'}/>
          <rect x="960" y="66"  width="110" height="3"  fill={isDark?'#445566':'#7788aa'}/>
          {/* Window grid */}
          {[963,978,993,1008,1023,1038,1053].map(x=>(
            <g key={x}>
              <rect x={x} y="70" width="12" height="20" fill={isDark?'#223344':'#88aabb'}/>
              <rect x={x+6} y="70" width="1" height="20" fill={isDark?'#111':'#667788'}/>
              <rect x={x} y="80" width="12" height="1"   fill={isDark?'#111':'#667788'}/>
            </g>
          ))}
          {/* STAR lettering */}
          <text x="926" y="108" fontFamily="Space Mono, monospace" fontSize="18" fontWeight="700"
            fill={isDark?'#888':'#ccaa88'} letterSpacing="4">STAR</text>
          {/* Canopy entrance — base on y=130 */}
          <rect x="1072" y="100" width="38"  height="6"  fill={isDark?'#445566':'#7799aa'}/>
          <rect x="1072" y="100" width="38"  height="2"  fill={isDark?'#556677':'#88aacc'}/>
          <rect x="1074" y="106" width="5"   height="24" fill={isDark?'#334455':'#5577aa'}/>
          <rect x="1102" y="106" width="5"   height="24" fill={isDark?'#334455':'#5577aa'}/>
          {/* Entrance sign */}
          <rect x="1074" y="90"  width="36"  height="10" fill="#fff"/>
          <text x="1076" y="99" fontFamily="Space Mono, monospace" fontSize="5" fontWeight="700" fill="#bb3333">Splott STAR Centre</text>
          {/* Entrance door */}
          <rect x="1082" y="114" width="16"  height="16" fill={isDark?'#334455':'#aaccdd'}/>
          <rect x="1084" y="116" width="5"   height="7"  fill={isDark?'#556677':'#88aacc'}/>
          <rect x="1091" y="116" width="5"   height="7"  fill={isDark?'#556677':'#88aacc'}/>

          {/* ── RIGHT TERRACES ── */}
          <rect x="1115" y="74"  width="85"  height="56" fill={isDark?'#3a2a1a':'#aa8866'}/>
          <rect x="1115" y="74"  width="85"  height="4"  fill={isDark?'#2a1a0a':'#886644'}/>
          {[1120,1134,1148,1162,1176].map(x=>(
            <g key={x}>
              <rect x={x} y="84" width="9" height="11" fill={isDark?'#223344':'#88aacc'}/>
              <rect x={x} y="101" width="9" height="11" fill={isDark?'#223344':'#88aacc'}/>
              <rect x={x+4} y="84" width="1" height="11" fill={isDark?'#111':'#5577aa'}/>
              <rect x={x+4} y="101" width="1" height="11" fill={isDark?'#111':'#5577aa'}/>
            </g>
          ))}
          {[1120,1150,1178].map(x=>(
            <rect key={x} x={x} y="62" width="8" height="12" fill={isDark?'#3a2a1a':'#997755'}/>
          ))}
          {[1133,1147,1161,1175].map(x=>(
            <rect key={x} x={x} y="74" width="2" height="56" fill={isDark?'#2a1a0a':'#886644'}/>
          ))}
          {[1122,1152].map(x=>(
            <g key={x}>
              <rect x={x}   y="115" width="10" height="15" fill={isDark?'#3355aa':'#4466bb'}/>
              <rect x={x+2} y="117" width="3"  height="5"  fill={isDark?'#4477cc':'#6688dd'}/>
              <rect x={x+6} y="117" width="3"  height="5"  fill={isDark?'#4477cc':'#6688dd'}/>
            </g>
          ))}

          {/* ── STREET LAMP 3 ── */}
          <rect x="1105" y="72"  width="4"   height="58" fill={isDark?'#555':'#888'}/>
          <rect x="1099" y="72"  width="16"  height="4"  fill={isDark?'#555':'#888'}/>
          <rect x="1099" y="68"  width="16"  height="4"  fill={isDark?'#ffeeaa':'#ffffcc'}/>
          <rect x="1103" y="126" width="6"   height="4"  fill={isDark?'#444':'#777'}/>
        </svg>

        {/* ── ANIMATED ELEMENTS — positioned over SVG ── */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>

          {/* Cardiff Bus going RIGHT — red double decker */}
          <div className="bus-r" style={{ position: 'absolute', bottom: '10px', animationDuration: '22s', animationDelay: '0s' }}>
            <svg width="120" height="52" viewBox="0 0 120 52" shapeRendering="crispEdges">
              {/* Body */}
              <rect x="2"  y="4"  width="112" height="38" fill="#cc2222"/>
              <rect x="2"  y="4"  width="112" height="6"  fill="#dd3333"/>
              <rect x="2"  y="38" width="112" height="4"  fill="#aa1111"/>
              <rect x="2"  y="4"  width="4"   height="38" fill="#dd3333"/>
              <rect x="110" y="4" width="4"   height="38" fill="#aa1111"/>
              {/* Destination board */}
              <rect x="8"  y="6"  width="80"  height="8"  fill="#ffffff"/>
              <text x="12" y="13" fontFamily="Space Mono, monospace" fontSize="5" fill="#cc2222">SPLOTT  Cardiff Bus</text>
              {/* Upper deck windows */}
              {[8,28,48,68,88].map(x=>(
                <rect key={x} x={x} y="16" width="16" height="10" fill={isDark?'#334455':'#aaccee'}/>
              ))}
              {/* Lower deck windows */}
              {[8,28,48,68,88].map(x=>(
                <rect key={x+1} x={x} y="28" width="16" height="8" fill={isDark?'#334455':'#aaccee'}/>
              ))}
              {/* Headlights — glow in dark mode */}
              <rect x="106" y="30" width="8" height="6" fill={isDark?'#ffff88':'#ffff44'}/>
              {isDark && <rect x="108" y="29" width="6" height="8" fill="#ffff88" opacity="0.5"/>}
              {/* Rear light */}
              <rect x="2"  y="30" width="6"  height="6"  fill="#ff4444"/>
              {/* Wheels */}
              <rect x="12"  y="42" width="20" height="10" fill="#222"/>
              <rect x="16"  y="44" width="12" height="6"  fill="#444"/>
              <rect x="85"  y="42" width="20" height="10" fill="#222"/>
              <rect x="89"  y="44" width="12" height="6"  fill="#444"/>
            </svg>
          </div>

          {/* Cardiff Bus going LEFT */}
          <div className="bus-l" style={{ position: 'absolute', bottom: '10px', animationDuration: '28s', animationDelay: '-14s' }}>
            <svg width="120" height="52" viewBox="0 0 120 52" shapeRendering="crispEdges" style={{ transform: 'scaleX(-1)' }}>
              <rect x="2"  y="4"  width="112" height="38" fill="#cc2222"/>
              <rect x="2"  y="4"  width="112" height="6"  fill="#dd3333"/>
              <rect x="2"  y="38" width="112" height="4"  fill="#aa1111"/>
              <rect x="2"  y="4"  width="4"   height="38" fill="#dd3333"/>
              <rect x="110" y="4" width="4"   height="38" fill="#aa1111"/>
              <rect x="8"  y="6"  width="80"  height="8"  fill="#ffffff"/>
              <text x="12" y="13" fontFamily="Space Mono, monospace" fontSize="5" fill="#cc2222">CARDIFF BAY  Bus</text>
              {[8,28,48,68,88].map(x=>(
                <rect key={x} x={x} y="16" width="16" height="10" fill={isDark?'#334455':'#aaccee'}/>
              ))}
              {[8,28,48,68,88].map(x=>(
                <rect key={x+1} x={x} y="28" width="16" height="8" fill={isDark?'#334455':'#aaccee'}/>
              ))}
              <rect x="106" y="30" width="8" height="6" fill={isDark?'#ffff88':'#ffff44'}/>
              {isDark && <rect x="108" y="29" width="6" height="8" fill="#ffff88" opacity="0.5"/>}
              <rect x="2"  y="30" width="6"  height="6"  fill="#ff4444"/>
              <rect x="12"  y="42" width="20" height="10" fill="#222"/>
              <rect x="16"  y="44" width="12" height="6"  fill="#444"/>
              <rect x="85"  y="42" width="20" height="10" fill="#222"/>
              <rect x="89"  y="44" width="12" height="6"  fill="#444"/>
            </svg>
          </div>

          {/* Person 1 walking right — dog walker */}
          <div className="walk-r" style={{ position: 'absolute', bottom: '52px', animationDuration: '35s', animationDelay: '-5s' }}>
            <svg width="40" height="28" viewBox="0 0 40 28" shapeRendering="crispEdges">
              <rect x="14" y="2"  width="5" height="5" fill={isDark?'#ddbb88':'#eeccaa'}/>
              <rect x="13" y="7"  width="7" height="10" fill={isDark?'#4466aa':'#5577bb'}/>
              <rect x="13" y="17" width="3" height="7"  fill={isDark?'#226688':'#3377aa'}/>
              <rect x="17" y="17" width="3" height="7"  fill={isDark?'#226688':'#3377aa'}/>
              <rect x="9"  y="18" width="7" height="4"  fill={isDark?'#884422':'#aa6633'}/>
              <rect x="7"  y="16" width="5" height="3"  fill={isDark?'#884422':'#aa6633'}/>
              <rect x="15" y="11" width="1" height="7"  fill={isDark?'#555':'#888'}/>
              <rect x="9"  y="11" width="7" height="1"  fill={isDark?'#555':'#888'}/>
            </svg>
          </div>

          {/* Person 2 walking right */}
          <div className="walk-r" style={{ position: 'absolute', bottom: '52px', animationDuration: '40s', animationDelay: '-20s' }}>
            <svg width="20" height="28" viewBox="0 0 20 28" shapeRendering="crispEdges">
              <rect x="7"  y="2"  width="5" height="5" fill={isDark?'#ddbb88':'#eeccaa'}/>
              <rect x="6"  y="7"  width="7" height="10" fill={isDark?'#cc4422':'#dd5533'}/>
              <rect x="6"  y="17" width="3" height="7"  fill={isDark?'#226688':'#3377aa'}/>
              <rect x="10" y="17" width="3" height="7"  fill={isDark?'#226688':'#3377aa'}/>
            </svg>
          </div>

          {/* Person 3 walking left */}
          <div className="walk-l" style={{ position: 'absolute', bottom: '52px', animationDuration: '38s', animationDelay: '-10s' }}>
            <svg width="20" height="28" viewBox="0 0 20 28" shapeRendering="crispEdges">
              <rect x="7"  y="2"  width="5" height="5" fill={isDark?'#ddbb88':'#eeccaa'}/>
              <rect x="6"  y="7"  width="7" height="10" fill={isDark?'#448844':'#559955'}/>
              <rect x="6"  y="17" width="3" height="7"  fill={isDark?'#334':'#445'}/>
              <rect x="10" y="17" width="3" height="7"  fill={isDark?'#334':'#445'}/>
            </svg>
          </div>

          {/* Wheelchair user going right */}
          <div className="walk-r" style={{ position: 'absolute', bottom: '52px', animationDuration: '45s', animationDelay: '-30s' }}>
            <svg width="36" height="28" viewBox="0 0 36 28" shapeRendering="crispEdges">
              {/* Person */}
              <rect x="6"  y="2"  width="5" height="5" fill={isDark?'#ddbb88':'#eeccaa'}/>
              <rect x="5"  y="7"  width="7" height="8"  fill={isDark?'#4466cc':'#5577dd'}/>
              {/* Wheelchair frame */}
              <rect x="4"  y="15" width="18" height="2"  fill={isDark?'#888':'#aaa'}/>
              <rect x="4"  y="12" width="2"  height="5"  fill={isDark?'#888':'#aaa'}/>
              <rect x="20" y="12" width="2"  height="5"  fill={isDark?'#888':'#aaa'}/>
              {/* Wheels */}
              <rect x="2"  y="17" width="10" height="10" fill="none"/>
              <rect x="3"  y="18" width="8"  height="8"  fill={isDark?'#555':'#777'}/>
              <rect x="4"  y="19" width="6"  height="6"  fill={isDark?'#333':'#aaa'}/>
              <rect x="18" y="18" width="8"  height="8"  fill={isDark?'#555':'#777'}/>
              <rect x="19" y="19" width="6"  height="6"  fill={isDark?'#333':'#aaa'}/>
              {/* Small front wheel */}
              <rect x="22" y="22" width="4"  height="4"  fill={isDark?'#555':'#777'}/>
            </svg>
          </div>

          {/* Cyclist going left */}
          <div className="walk-l" style={{ position: 'absolute', bottom: '52px', animationDuration: '18s', animationDelay: '-8s' }}>
            <svg width="36" height="32" viewBox="0 0 36 32" shapeRendering="crispEdges">
              <rect x="12" y="2"  width="5" height="5"  fill={isDark?'#ddbb88':'#eeccaa'}/>
              <rect x="11" y="7"  width="7" height="8"  fill={isDark?'#cc4444':'#dd5555'}/>
              <rect x="6"  y="16" width="18" height="2"  fill={isDark?'#888':'#666'}/>
              <rect x="6"  y="12" width="2"  height="6"  fill={isDark?'#888':'#666'}/>
              <rect x="22" y="12" width="2"  height="6"  fill={isDark?'#888':'#666'}/>
              <rect x="14" y="14" width="2"  height="4"  fill={isDark?'#888':'#666'}/>
              <rect x="2"  y="18" width="10" height="10" fill="none"/>
              <rect x="3"  y="19" width="8"  height="8"  fill={isDark?'#555':'#777'}/>
              <rect x="4"  y="20" width="6"  height="6"  fill={isDark?'#333':'#aaa'}/>
              <rect x="22" y="18" width="10" height="10" fill="none"/>
              <rect x="23" y="19" width="8"  height="8"  fill={isDark?'#555':'#777'}/>
              <rect x="24" y="20" width="6"  height="6"  fill={isDark?'#333':'#aaa'}/>
            </svg>
          </div>

        </div>
      </div>

      <div className="desktop desktop-fade-in" onClick={() => { setSelectedIcon(null); setStartMenuOpen(false) }}>
        {iconDefs.map(({ id, type }) => (
          <div
            key={id}
            className={`desktop-icon ${selectedIcon === id ? 'selected' : ''} ${draggingIcon === id ? 'dragging' : ''}`}
            style={{ left: `${iconPositions[id]?.x ?? 20}px`, top: `${iconPositions[id]?.y ?? 20}px` }}
            onMouseDown={(e) => { e.stopPropagation(); handleIconMouseDown(e, id) }}
            onTouchStart={(e) => handleIconTouchStart(e, id)}
            onClick={(e) => { e.stopPropagation(); handleIconClick(id) }}
            onMouseEnter={() => { if (!draggingIcon) setCursorStyle('pointer') }}
            onMouseLeave={() => { if (!draggingIcon) setCursorStyle('default') }}
            tabIndex={0} role="button" aria-label={t[id]}
            onKeyDown={(e) => { if (e.key === 'Enter') openWindow(id) }}
          >
            <div style={{ width: cs.icon, height: cs.icon }}>
              {renderIcon(type, cs.icon)}
            </div>
            <div className="icon-label">{t[id]}</div>
          </div>
        ))}
      </div>

      {/* Drag shadow */}
      {iconDragShadow && draggingIcon && iconDragHasMoved && (
        <div className="drag-shadow" style={{ left: `${iconDragShadow.x}px`, top: `${iconDragShadow.y}px` }} />
      )}

      {/* Windows */}
      {(Object.keys(windows) as WindowId[]).map((id) => {
        const win = windows[id]
        if (!win.isOpen) return null
        return (
          <div
            key={id} className="window"
            style={{ left: `${win.position.x}px`, top: `${win.position.y}px`, zIndex: win.zIndex }}
            onClick={() => bringToFront(id)}
          >
            {/* Tab bar — horizontal navigation */}
            <div className="window-tabs">
              {(Object.keys(windows) as WindowId[]).filter(w => windows[w].isOpen || minimisedWindows.includes(w)).map(wid => (
                <button
                  key={wid}
                  className={`window-tab ${wid === id ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); if (wid !== id) { bringToFront(wid); openWindow(wid) } }}
                >
                  {t[wid]}
                </button>
              ))}
            </div>
            <div className="window-titlebar" onMouseDown={(e) => handleWindowTitlebarMouseDown(e, id)}>
              <div className="window-title">{windowTitles[lang][id]}</div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button className="window-minimise" onClick={(e) => { e.stopPropagation(); minimiseWindow(id) }} aria-label="Minimise">−</button>
                <button className="window-close" onClick={(e) => { e.stopPropagation(); closeWindow(id) }} aria-label={t.close}>×</button>
              </div>
            </div>
            <div className="window-content">{renderWindowContent(id)}</div>
          </div>
        )
      })}

      {/* Menubar */}
      <div className="menubar">
        <div className="menubar-left">
          <button className={`menu-btn ${startMenuOpen ? 'open' : ''}`} onClick={(e) => { e.stopPropagation(); setStartMenuOpen(!startMenuOpen) }} aria-label="Menu" aria-expanded={startMenuOpen}>
            {t.menu}
          </button>
          {/* Minimised window slots */}
          {minimisedWindows.map(id => (
            <button
              key={id}
              className="minimised-slot"
              onClick={() => restoreWindow(id)}
              title={windowTitles[lang][id]}
            >
              {t[id]}
            </button>
          ))}
        </div>
        <div className="menubar-right">
          <span style={{ fontSize: '11px', color: subtle, marginRight: '4px' }}>{t.iconsLabel}</span>
          {(['small', 'medium', 'large'] as const).map((s) => (
            <button key={s} className={`size-btn ${iconSize === s ? 'active' : ''}`} onClick={() => changeIconSize(s)} aria-label={`${s} icons`}>
              {s[0].toUpperCase()}
            </button>
          ))}
          <div className="clock">{clock}</div>
        </div>
      </div>

      {/* Start menu */}
      {startMenuOpen && (
        <div className="apple-menu" onClick={(e) => e.stopPropagation()}>
          <button className="apple-menu-item" onClick={() => { toggleTheme(); setStartMenuOpen(false) }}>
            {isDark ? t.lightMode : t.darkMode}
          </button>
          <button className="apple-menu-item" onClick={() => { setLang(lang === 'en' ? 'cy' : 'en'); setStartMenuOpen(false) }}>
            {t.langSwitch}
          </button>
          <div className="apple-menu-sep" />
          <button className="apple-menu-item" onClick={() => { toggleCursorTrail(); setStartMenuOpen(false) }}>
            {cursorTrailEnabled ? t.trailOn : t.trailOff}
          </button>
        </div>
      )}

      {/* Cursor trail */}
      {trailDots.map(dot => (
        <div key={dot.id} className="cursor-dot" style={{ left: `${dot.x}px`, top: `${dot.y}px` }} />
      ))}
    </>
  )
}
