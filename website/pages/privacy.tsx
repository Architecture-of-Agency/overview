import Head from 'next/head'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Privacy() {
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

  return (
    <>
      <Head>
        <title>Privacy Policy | Leol Lab</title>
        <meta name="description" content="Privacy policy for Leol Lab research website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
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

        .theme-btn {
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
        
        .theme-btn:hover {
          background: ${theme === 'light' ? '#f0f0f0' : '#2a2a2a'};
          border-color: ${theme === 'light' ? '#444' : '#bbb'};
        }

        a {
          color: ${theme === 'light' ? '#1a1a1a' : '#e0e0e0'};
          text-decoration: underline;
        }

        h2 {
          font-size: 24px;
          margin: 40px 0 16px 0;
          font-weight: 700;
        }

        h3 {
          font-size: 18px;
          margin: 24px 0 12px 0;
          font-weight: 700;
        }

        p {
          margin-bottom: 16px;
        }

        ul {
          margin-left: 24px;
          margin-bottom: 16px;
        }

        li {
          margin-bottom: 8px;
        }
      `}</style>

      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 2000 }}>
        <button 
          className="theme-btn"
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? '[0x00]' : '[0xFF]'}
        </button>
      </div>

      <main style={{ minHeight: '100vh', padding: '60px 40px 40px', maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/" style={{ fontSize: '11px', letterSpacing: '1px', marginBottom: '40px', display: 'inline-block' }}>
          ← Back to Leol Lab
        </Link>

        <article style={{ 
          background: theme === 'light' ? '#ffffff' : '#1a1a1a', 
          border: `2px solid ${theme === 'light' ? '#666' : '#999'}`, 
          padding: '40px',
          marginTop: '20px',
          transition: 'background 0.3s ease, border 0.3s ease'
        }}>
          <h1 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '24px' }}>Privacy Policy</h1>

          <p style={{ fontSize: '12px', color: theme === 'light' ? '#666' : '#999', marginBottom: '32px' }}>
            Last updated: February 2025
          </p>

          <h2>What This Site Collects</h2>
          <p>This research website uses Vercel Analytics to collect minimal anonymised usage data:</p>
          <ul>
            <li>Which pages you visit</li>
            <li>How you navigate the site</li>
            <li>Device type (mobile/desktop)</li>
            <li>Geographic region (country only)</li>
          </ul>
          <p><strong>No personal information is collected.</strong> No tracking cookies, no cross-site tracking, no identifiable data.</p>

          <h2>Why We Collect This</h2>
          <p>To improve the accessibility and usability of this research website about community data sovereignty. The data helps us understand:</p>
          <ul>
            <li>Whether visualisations are clear and accessible</li>
            <li>How communities engage with data sovereignty concepts</li>
            <li>What improvements would serve users better</li>
          </ul>

          <h2>Where It's Stored</h2>
          <p>Data is processed by Vercel Inc. under their privacy policy: <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener">vercel.com/legal/privacy-policy</a></p>
          <p>Vercel Analytics is designed to be privacy-friendly and GDPR compliant.</p>

          <h2>Future Governance</h2>
          <p>This data is temporarily stewarded by Cardiff University during PhD research but belongs to visitors and communities. Upon research completion (expected 2028), governance will transition to community-determined structures.</p>
          <p>See our full <Link href="/governance">Data Governance document</Link> for details about this transition model.</p>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Understand what data is collected (documented here)</li>
            <li>Opt-out using browser "Do Not Track" settings</li>
            <li>Use privacy-focused browsers that block analytics</li>
            <li>Contact us with questions or concerns</li>
          </ul>

          <h2>Research Ethics</h2>
          <p>This website is part of PhD research at Cardiff University investigating Web3-enabled inclusive governance systems for sovereign neighbourhood data. Data collection follows Cardiff University research ethics guidelines.</p>

          <h2>Contact</h2>
          <p>
            Lucy Dunhill<br />
            <a href="mailto:dunhilll@cardiff.ac.uk">dunhilll@cardiff.ac.uk</a><br />
            Welsh School of Architecture, Cardiff University
          </p>

          <hr style={{ margin: '40px 0', border: 'none', borderTop: `1px solid ${theme === 'light' ? '#666' : '#999'}` }} />

          <p style={{ fontSize: '12px', color: theme === 'light' ? '#666' : '#999', fontStyle: 'italic' }}>
            This website models the data sovereignty transitions it researches.
          </p>
        </article>
      </main>
    </>
  )
}