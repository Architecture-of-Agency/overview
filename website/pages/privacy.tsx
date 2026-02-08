import Head from 'next/head'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Privacy() {
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
          background: ${theme === 'light' ? '#f5f5f5' : '#000000'};
          color: ${theme === 'light' ? '#1a1a1a' : '#e0e0e0'};
          line-height: 1.6;
          font-size: 16px;
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

        .content-box {
          background: ${theme === 'light' ? '#ffffff' : 'rgba(10, 0, 20, 0.8)'};
          border: ${theme === 'light' ? '2px solid #666' : '1px solid rgba(255, 0, 100, 0.3)'};
          padding: 60px 40px;
          margin: 40px auto;
          max-width: 900px;
        }

        .theme-btn {
          background: ${theme === 'light' ? '#ffffff' : 'rgba(0, 0, 0, 0.8)'};
          border: 1px solid ${theme === 'light' ? '#666' : 'rgba(255, 0, 100, 0.4)'};
          color: ${theme === 'light' ? '#1a1a1a' : '#e0e0e0'};
          padding: 8px 16px;
          font-size: 11px;
          cursor: pointer;
          font-family: 'Space Mono', monospace;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .back-link {
          font-size: 11px;
          letter-spacing: 1px;
          color: ${theme === 'dark' ? 'rgba(255, 0, 100, 0.8)' : '#666'};
          text-decoration: none;
          display: inline-block;
          margin-bottom: 40px;
        }

        .back-link:hover {
          color: ${theme === 'dark' ? '#ffffff' : '#000000'};
        }

        h1 {
          font-size: clamp(32px, 6vw, 56px);
          font-weight: 700;
          margin-bottom: 16px;
          line-height: 1.2;
        }

        .updated {
          font-size: 12px;
          color: ${theme === 'dark' ? 'rgba(255, 0, 100, 0.6)' : '#666'};
          margin-bottom: 40px;
        }

        h2 {
          font-size: 20px;
          font-weight: 700;
          margin: 48px 0 24px 0;
          color: ${theme === 'dark' ? 'rgba(255, 0, 100, 0.9)' : '#1a1a1a'};
        }

        p {
          margin-bottom: 20px;
          font-size: 14px;
          line-height: 1.8;
        }

        ul {
          margin: 20px 0 20px 24px;
          font-size: 14px;
          line-height: 1.8;
        }

        li {
          margin-bottom: 12px;
        }

        strong {
          color: ${theme === 'dark' ? 'rgba(255, 0, 100, 0.9)' : '#1a1a1a'};
        }

        @media (max-width: 768px) {
          .content-box {
            padding: 40px 24px;
            margin: 20px 16px;
          }
        }
      `}</style>

      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 2000 }}>
        <button 
          className="theme-btn"
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? '[DARK]' : '[LIGHT]'}
        </button>
      </div>

      <main style={{ minHeight: '100vh', padding: '80px 20px 40px' }}>
        <div className="content-box">
          <Link href="/" className="back-link">
            ← Back to Leol Lab
          </Link>

          <h1>Privacy Policy</h1>
          <p className="updated">Last updated: February 2025</p>

          <h2>What This Site Collects</h2>
          <p>
            This research website uses Vercel Analytics to collect minimal anonymised usage data:
          </p>
          <ul>
            <li>Which pages you visit</li>
            <li>How you navigate the site</li>
            <li>Device type (mobile/desktop)</li>
            <li>Geographic region (country only)</li>
          </ul>
          <p><strong>No personal information is collected.</strong> No tracking cookies, no cross-site tracking, no identifiable data.</p>

          <h2>Why We Collect This</h2>
          <p>
            To improve the accessibility and usability of this research website about community data sovereignty. 
            The data helps us understand:
          </p>
          <ul>
            <li>Whether visualisations are clear and accessible</li>
            <li>How communities engage with data sovereignty concepts</li>
            <li>What improvements would serve users better</li>
          </ul>

          <h2>Where It's Stored</h2>
          <p>
            Data is processed by Vercel Inc. under their privacy policy:{' '}
            <a 
              href="https://vercel.com/legal/privacy-policy" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ textDecoration: 'underline', color: 'inherit' }}
            >
              vercel.com/legal/privacy-policy
            </a>
          </p>
          <p>Vercel Analytics is designed to be privacy-friendly and GDPR compliant.</p>

          <h2>Future Governance</h2>
          <p>
            This data is temporarily stewarded by Cardiff University during PhD research but belongs to 
            visitors and communities. Upon research completion (expected 2028), governance will transition 
            to community-determined structures.
          </p>
          <p>
            See our full{' '}
            <Link href="/governance" style={{ textDecoration: 'underline', color: 'inherit' }}>
              Data Governance document
            </Link>
            {' '}for details about this transition model.
          </p>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Understand what data is collected (documented here)</li>
            <li>Opt-out using browser "Do Not Track" settings</li>
            <li>Use privacy-focused browsers that block analytics</li>
            <li>Contact us with questions or concerns</li>
          </ul>

          <h2>Research Ethics</h2>
          <p>
            This website is part of PhD research at Cardiff University investigating Web3-enabled inclusive 
            governance systems for sovereign neighbourhood data. Data collection follows Cardiff University 
            research ethics guidelines.
          </p>

          <h2>Contact</h2>
          <p>
            <strong>Lucy Dunhill</strong><br />
            <a href="mailto:dunhilll@cardiff.ac.uk" style={{ textDecoration: 'underline', color: 'inherit' }}>
              dunhilll@cardiff.ac.uk
            </a><br />
            Welsh School of Architecture, Cardiff University
          </p>

          <p style={{ marginTop: '60px', paddingTop: '40px', borderTop: theme === 'light' ? '2px solid #ddd' : '2px solid rgba(255, 0, 100, 0.2)', fontSize: '11px', color: theme === 'dark' ? 'rgba(255, 0, 100, 0.6)' : '#666', fontStyle: 'italic' }}>
            This website models the data sovereignty transitions it researches.
          </p>

          <p style={{ marginTop: '24px', fontSize: '12px', color: theme === 'dark' ? 'rgba(255, 0, 100, 0.6)' : '#666' }}>
            <Link href="/" style={{ textDecoration: 'underline' }}>← Back to Leol Lab</Link>
            {' · '}
            <Link href="/why-web3" style={{ textDecoration: 'underline' }}>Why Web3?</Link>
            {' · '}
            <Link href="/governance" style={{ textDecoration: 'underline' }}>Data Governance</Link>
          </p>
        </div>
      </main>
    </>
  )
}
