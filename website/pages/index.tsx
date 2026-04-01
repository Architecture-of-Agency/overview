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
  }
  const closeWindow = (id: WindowId) => {
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], isOpen: false } }))
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
    if (audioRef.current) audioRef.current.play().catch(() => {})
    setTimeout(() => { setHasEntered(true); setIsLoading(false) }, 3500)
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

  // Pixel-art SVG icons. shapeRendering="crispEdges" keeps everything sharp.
  // All shapes use rect, polygon, or simple path — no transforms, no blur, no radius.
  const renderIcon = (type: IconType, s: number) => {
    const K = isDark

    switch (type) {

      // ── Document ──────────────────────────────────────────────────────────────
      case 'document':
        return (
          <svg width={s} height={s} viewBox="0 0 48 48" shapeRendering="crispEdges">
            {/* Page — folded top-right corner */}
            <polygon points="4,0 32,0 44,12 44,48 4,48" fill={K ? '#dddddd' : '#ffffff'} />
            <polygon points="4,0 32,0 44,12 44,48 4,48" fill="none" stroke={K ? '#cccccc' : '#000000'} strokeWidth="2" />
            {/* Fold corner triangle */}
            <polygon points="32,0 44,12 32,12" fill={K ? '#aaaaaa' : '#cccccc'} stroke={K ? '#cccccc' : '#000000'} strokeWidth="2" />
            {/* Text lines */}
            {[18, 24, 30, 36].map(y => (
              <rect key={y} x="10" y={y} width="26" height="3" fill={K ? '#888888' : '#aaaaaa'} />
            ))}
            {/* Drop shadow */}
            <rect x="6" y="50" width="40" height="3" fill={K ? '#111111' : '#999999'} />
            <rect x="46" y="2" width="3" height="48" fill={K ? '#111111' : '#999999'} />
          </svg>
        )

      // ── Globe with 3 ─────────────────────────────────────────────────────────
      case 'globe3':
        return (
          <svg width={s} height={s} viewBox="0 0 48 48" shapeRendering="crispEdges">
            {/* Globe body — circle approximated as octagon for pixel feel */}
            <polygon
              points="16,2 32,2 46,16 46,32 32,46 16,46 2,32 2,16"
              fill={K ? '#1144aa' : '#2255cc'}
              stroke={K ? '#cccccc' : '#000000'}
              strokeWidth="2"
            />
            {/* Latitude lines */}
            <rect x="2"  y="16" width="44" height="3" fill={K ? '#3366cc' : '#4477dd'} />
            <rect x="2"  y="28" width="44" height="3" fill={K ? '#3366cc' : '#4477dd'} />
            {/* Longitude lines */}
            <rect x="16" y="2"  width="3"  height="44" fill={K ? '#3366cc' : '#4477dd'} />
            <rect x="28" y="2"  width="3"  height="44" fill={K ? '#3366cc' : '#4477dd'} />
            {/* Bold "3" — pixel font style */}
            {/* Top bar */}
            <rect x="17" y="13" width="14" height="4" fill="#ffffff" />
            {/* Upper right stem */}
            <rect x="27" y="17" width="4"  height="5"  fill="#ffffff" />
            {/* Middle bar */}
            <rect x="19" y="22" width="12" height="4" fill="#ffffff" />
            {/* Lower right stem */}
            <rect x="27" y="26" width="4"  height="5"  fill="#ffffff" />
            {/* Bottom bar */}
            <rect x="17" y="31" width="14" height="4" fill="#ffffff" />
            {/* Drop shadow */}
            <rect x="4"  y="48" width="44" height="3" fill={K ? '#111111' : '#999999'} />
            <rect x="48" y="4"  width="3"  height="44" fill={K ? '#111111' : '#999999'} />
          </svg>
        )

      // ── Filing cabinet ────────────────────────────────────────────────────────
      case 'cabinet':
        return (
          <svg width={s} height={s} viewBox="0 0 48 48" shapeRendering="crispEdges">
            {/* Cabinet body */}
            <rect x="2" y="2" width="42" height="44" fill={K ? '#777777' : '#aaaaaa'} stroke={K ? '#cccccc' : '#000000'} strokeWidth="2" />
            {/* Drawer 1 */}
            <rect x="6"  y="5"  width="34" height="11" fill={K ? '#999999' : '#cccccc'} stroke={K ? '#cccccc' : '#000000'} strokeWidth="1.5" />
            <rect x="17" y="9"  width="12" height="3"  fill={K ? '#bbbbbb' : '#888888'} />
            {/* Drawer 2 */}
            <rect x="6"  y="19" width="34" height="11" fill={K ? '#999999' : '#cccccc'} stroke={K ? '#cccccc' : '#000000'} strokeWidth="1.5" />
            <rect x="17" y="23" width="12" height="3"  fill={K ? '#bbbbbb' : '#888888'} />
            {/* Drawer 3 */}
            <rect x="6"  y="33" width="34" height="11" fill={K ? '#999999' : '#cccccc'} stroke={K ? '#cccccc' : '#000000'} strokeWidth="1.5" />
            <rect x="17" y="37" width="12" height="3"  fill={K ? '#bbbbbb' : '#888888'} />
            {/* Drop shadow */}
            <rect x="4"  y="48" width="42" height="3" fill={K ? '#111111' : '#999999'} />
            <rect x="46" y="4"  width="3"  height="44" fill={K ? '#111111' : '#999999'} />
          </svg>
        )

      // ── Lock ──────────────────────────────────────────────────────────────────
      case 'lock':
        return (
          <svg width={s} height={s} viewBox="0 0 48 48" shapeRendering="crispEdges">
            {/* Shackle — left post */}
            <rect x="10" y="4"  width="8" height="22" fill={K ? '#aaaaaa' : '#888888'} stroke={K ? '#cccccc' : '#000000'} strokeWidth="2" />
            {/* Shackle — right post */}
            <rect x="30" y="4"  width="8" height="22" fill={K ? '#aaaaaa' : '#888888'} stroke={K ? '#cccccc' : '#000000'} strokeWidth="2" />
            {/* Shackle — top bar */}
            <rect x="10" y="4"  width="28" height="8" fill={K ? '#aaaaaa' : '#888888'} stroke={K ? '#cccccc' : '#000000'} strokeWidth="2" />
            {/* Lock body */}
            <rect x="4"  y="24" width="40" height="22" fill={K ? '#cc9900' : '#ffcc00'} stroke={K ? '#cccccc' : '#000000'} strokeWidth="2" />
            {/* Keyhole circle */}
            <rect x="20" y="30" width="8" height="6" fill={K ? '#111111' : '#000000'} />
            {/* Keyhole slot */}
            <rect x="22" y="36" width="4" height="5" fill={K ? '#111111' : '#000000'} />
            {/* Drop shadow */}
            <rect x="6"  y="48" width="40" height="3" fill={K ? '#111111' : '#999999'} />
            <rect x="46" y="26" width="3"  height="22" fill={K ? '#111111' : '#999999'} />
          </svg>
        )

      // ── Envelope ──────────────────────────────────────────────────────────────
      case 'envelope':
        return (
          <svg width={s} height={s} viewBox="0 0 48 48" shapeRendering="crispEdges">
            {/* Body */}
            <rect x="2" y="12" width="44" height="32" fill={K ? '#dddddd' : '#ffffff'} stroke={K ? '#cccccc' : '#000000'} strokeWidth="2" />
            {/* V flap — two diagonal lines meeting at centre bottom */}
            <polygon points="2,12 24,30 46,12" fill={K ? '#cc4444' : '#dd3333'} stroke={K ? '#cccccc' : '#000000'} strokeWidth="2" />
            {/* Bottom fold seam lines */}
            <rect x="2"  y="38" width="18" height="2" fill={K ? '#aaaaaa' : '#cccccc'} />
            <rect x="28" y="38" width="18" height="2" fill={K ? '#aaaaaa' : '#cccccc'} />
            {/* Drop shadow */}
            <rect x="4"  y="46" width="44" height="3" fill={K ? '#111111' : '#999999'} />
            <rect x="48" y="14" width="3"  height="32" fill={K ? '#111111' : '#999999'} />
          </svg>
        )

      // ── Pencil ────────────────────────────────────────────────────────────────
      // Vertical pencil — all axis-aligned, no rotation
      case 'pencil':
        return (
          <svg width={s} height={s} viewBox="0 0 48 48" shapeRendering="crispEdges">
            {/* Eraser top */}
            <rect x="14" y="2"  width="20" height="7"  fill={K ? '#dd8888' : '#ff9999'} stroke={K ? '#cccccc' : '#000000'} strokeWidth="2" />
            {/* Metal band */}
            <rect x="14" y="9"  width="20" height="5"  fill={K ? '#aaaaaa' : '#bbbbbb'} stroke={K ? '#cccccc' : '#000000'} strokeWidth="1" />
            {/* Body */}
            <rect x="14" y="14" width="20" height="22" fill={K ? '#ddaa00' : '#ffdd00'} stroke={K ? '#cccccc' : '#000000'} strokeWidth="2" />
            {/* Highlight stripe */}
            <rect x="28" y="14" width="4"  height="22" fill={K ? '#eebb22' : '#ffee44'} />
            {/* Wood taper — trapezoid using polygon */}
            <polygon points="14,36 34,36 30,44 18,44" fill={K ? '#cc8844' : '#ddaa66'} stroke={K ? '#cccccc' : '#000000'} strokeWidth="2" />
            {/* Nib */}
            <polygon points="18,44 30,44 24,48" fill={K ? '#555555' : '#333333'} />
            {/* Drop shadow */}
            <rect x="16" y="48" width="20" height="2" fill={K ? '#111111' : '#999999'} />
            <rect x="36" y="4"  width="3"  height="44" fill={K ? '#111111' : '#999999'} />
          </svg>
        )

      // ── Books ─────────────────────────────────────────────────────────────────
      // Three books stacked, viewed from slight angle — different colours
      case 'books':
        return (
          <svg width={s} height={s} viewBox="0 0 48 48" shapeRendering="crispEdges">
            {/* Book 3 — bottom */}
            <rect x="4"  y="34" width="40" height="12" fill={K ? '#4466aa' : '#5577cc'} stroke={K ? '#cccccc' : '#000000'} strokeWidth="2" />
            <rect x="4"  y="34" width="6"  height="12" fill={K ? '#2244aa' : '#3355bb'} />
            <rect x="38" y="34" width="6"  height="12" fill={K ? '#8899ee' : '#aabbff'} />
            {/* Book 2 — middle */}
            <rect x="4"  y="20" width="40" height="12" fill={K ? '#aa4444' : '#cc5555'} stroke={K ? '#cccccc' : '#000000'} strokeWidth="2" />
            <rect x="4"  y="20" width="6"  height="12" fill={K ? '#882222' : '#aa3333'} />
            <rect x="38" y="20" width="6"  height="12" fill={K ? '#ee8888' : '#ffaaaa'} />
            {/* Book 1 — top */}
            <rect x="4"  y="6"  width="40" height="12" fill={K ? '#448844' : '#559955'} stroke={K ? '#cccccc' : '#000000'} strokeWidth="2" />
            <rect x="4"  y="6"  width="6"  height="12" fill={K ? '#226622' : '#337733'} />
            <rect x="38" y="6"  width="6"  height="12" fill={K ? '#88ee88' : '#aaffaa'} />
            {/* Drop shadow */}
            <rect x="6"  y="48" width="40" height="2" fill={K ? '#111111' : '#999999'} />
          </svg>
        )

      // ── Map pin ───────────────────────────────────────────────────────────────
      // Round head, triangular point, thin stem — all clean shapes
      case 'mappin':
        return (
          <svg width={s} height={s} viewBox="0 0 48 48" shapeRendering="crispEdges">
            {/* Pin head — circle as octagon for pixel feel */}
            <polygon
              points="16,2 32,2 42,10 42,26 32,34 16,34 6,26 6,10"
              fill={K ? '#cc2222' : '#ee3333'}
              stroke={K ? '#cccccc' : '#000000'}
              strokeWidth="2"
            />
            {/* Highlight */}
            <rect x="12" y="8" width="10" height="6" fill={K ? '#ee6666' : '#ff8888'} />
            {/* White dot */}
            <rect x="14" y="10" width="6" height="4" fill={K ? '#ffaaaa' : '#ffffff'} />
            {/* Triangular point below head */}
            <polygon points="16,34 32,34 24,46" fill={K ? '#cc2222' : '#ee3333'} stroke={K ? '#cccccc' : '#000000'} strokeWidth="2" />
            {/* Drop shadow */}
            <rect x="16" y="46" width="16" height="3" fill={K ? '#111111' : '#999999'} />
          </svg>
        )
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
          body { font-family: 'Space Mono', monospace; background: ${bg}; overflow: hidden; }
          .loading-screen {
            position: fixed; inset: 0; background: ${bg};
            display: flex; flex-direction: column; align-items: center; justify-content: center;
          }
          .loading-text { font-size: 14px; color: ${text}; opacity: 0.6; margin-bottom: 20px; }
          .loading-bar-container {
            width: 240px; height: 20px; background: ${surface};
            border: 2px solid ${border};
            box-shadow: inset 2px 2px 0 ${isDark ? '#000' : '#999'}, 2px 2px 0 rgba(0,0,0,0.3);
            overflow: hidden;
          }
          .loading-bar-fill {
            height: 100%; background: ${isDark ? '#0066ff' : '#0000aa'};
            width: 0%; animation: loadingFill 3.5s linear forwards;
          }
          @keyframes loadingFill { 0% { width: 0% } 100% { width: 100% } }
        `}</style>
        <audio ref={audioRef} preload="auto"><source src="/audio/startup.mp3" type="audio/mpeg" /></audio>
        <div className="loading-screen">
          <div className="loading-text">Starting up...</div>
          <div className="loading-bar-container"><div className="loading-bar-fill" /></div>
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

  const cursorCSS = { default: 'default', pointer: 'pointer', grab: 'grab', grabbing: 'grabbing' }

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
          height: 100vh; padding: 20px; padding-bottom: 42px;
          position: relative; user-select: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }
        .desktop::after {
          content: '';
          position: fixed; inset: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, ${isDark ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.04)'} 2px, ${isDark ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.04)'} 4px);
          pointer-events: none; z-index: 9998;
        }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        .desktop-fade-in { animation: fadeIn 0.8s ease-in; }

        .desktop-icon {
          position: absolute; display: flex; flex-direction: column;
          align-items: center; gap: 6px; cursor: pointer;
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
          border-bottom: 2px solid ${border}; cursor: grab; user-select: none;
        }
        .window-titlebar:active { cursor: grabbing; }
        .window-title { font-size: 13px; font-weight: 700; }
        .window-close {
          background: #ff4444; border: 1px solid #000; width: 16px; height: 16px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          font-size: 11px; color: #000; font-family: 'Space Mono', monospace; flex-shrink: 0;
        }
        .window-close:hover { background: #ff6666; }
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
            <div className="window-titlebar" onMouseDown={(e) => handleWindowTitlebarMouseDown(e, id)}>
              <div className="window-title">{windowTitles[lang][id]}</div>
              <button className="window-close" onClick={(e) => { e.stopPropagation(); closeWindow(id) }} aria-label={t.close}>×</button>
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
