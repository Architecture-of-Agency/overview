import Head from 'next/head'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Governance() {
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
        <title>Data Governance | Leol Lab</title>
        <meta name="description" content="Data governance model for Leol Lab research" />
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

        h3 {
          font-size: 16px;
          font-weight: 700;
          margin: 32px 0 16px 0;
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

        .data-types {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin: 32px 0;
        }

        .data-box {
          padding: 24px;
          border: ${theme === 'light' ? '1px solid #ddd' : '1px solid rgba(255, 0, 100, 0.2)'};
          background: ${theme === 'light' ? '#fafafa' : 'rgba(0, 0, 0, 0.3)'};
        }

        .data-box-title {
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 16px;
          color: ${theme === 'dark' ? 'rgba(255, 0, 100, 0.9)' : '#1a1a1a'};
        }

        @media (max-width: 768px) {
          .content-box {
            padding: 40px 24px;
            margin: 20px 16px;
          }
          .data-types {
            grid-template-columns: 1fr;
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

          <h1>Data Governance</h1>
          <p className="updated">Last updated: February 2025</p>

          <p>
            This research investigates what governance should look like for place-based data. We don't have 
            the answers yet—that's what the PhD will discover. This document explains our current approach 
            and commitments.
          </p>

          <h2>Two Types of Data</h2>

          <p>
            This website handles two distinct types of data with different governance considerations:
          </p>

          <div className="data-types">
            <div className="data-box">
              <div className="data-box-title">1. Website Visitor Data</div>
              <p style={{ fontSize: '13px', lineHeight: '1.7' }}>
                Anonymised usage data from people visiting leol.cc. Minimal analytics to understand 
                site accessibility and engagement. No personal information collected.
              </p>
            </div>
            <div className="data-box">
              <div className="data-box-title">2. Research/Stakeholder Data</div>
              <p style={{ fontSize: '13px', lineHeight: '1.7' }}>
                Data from interviews with communities, planners, developers, architects, housing associations, 
                and other stakeholders. Multi-party co-created research data. Complex governance considerations.
              </p>
            </div>
          </div>

          <h2>Website Visitor Data</h2>

          <h3>Current Status</h3>
          <p>
            Cardiff University temporarily holds website data as custodian during PhD research (2025-2028). 
            This is stewardship, not ownership. Data belongs to visitors who generate it.
          </p>

          <h3>What We Collect</h3>
          <ul>
            <li>Which pages you visit</li>
            <li>How you navigate the site</li>
            <li>Device type (mobile/desktop)</li>
            <li>Geographic region (country only)</li>
          </ul>
          <p><strong>No personal information is collected.</strong> No tracking cookies, no cross-site tracking, no identifiable data.</p>

          <h3>Why We Collect This</h3>
          <p>
            To improve accessibility and usability of this research website. The data helps us understand 
            whether visualisations are clear, how communities engage with concepts, and what improvements 
            would serve users better.
          </p>

          <h3>Future Governance</h3>
          <p>
            Upon research completion (expected 2028), governance will transition to community-determined 
            structures. The exact model will emerge from research—not be predetermined. This website itself 
            models the data sovereignty transitions being studied.
          </p>

          <h2>Research/Stakeholder Data</h2>

          <h3>Multi-Stakeholder Considerations</h3>
          <p>
            Research data involves multiple parties with legitimate but sometimes competing interests:
          </p>
          <ul>
            <li>Communities have rights to data about their places</li>
            <li>Individual participants have privacy rights</li>
            <li>Institutional stakeholders may have commercial sensitivity concerns</li>
            <li>Cardiff University has research ethics responsibilities</li>
            <li>Some data may be confidential or legally protected</li>
          </ul>

          <h3>What This Research Investigates</h3>
          <p><strong>We are researching what governance should look like, not implementing predetermined solutions.</strong></p>
          
          <p>Key questions include:</p>
          <ul>
            <li>How should multi-party research data be governed?</li>
            <li>What rights do different stakeholders have?</li>
            <li>How do you balance transparency with privacy?</li>
            <li>What does community data sovereignty mean when "community" isn't monolithic?</li>
            <li>How do you prevent both institutional capture and majoritarian tyranny in data governance?</li>
            <li>What technical systems (blockchain, federated storage, etc.) best support inclusive governance?</li>
          </ul>

          <h2>Design Justice Approach</h2>

          <p>
            This research uses Design Justice methodology (Costanza-Chock, 2020), which means:
          </p>

          <ul>
            <li><strong>Centering marginalised voices:</strong> Those most affected by decisions lead the process</li>
            <li><strong>No predetermined outcomes:</strong> Communities co-design governance structures</li>
            <li><strong>Transparent documentation:</strong> All decisions about data are publicly documented</li>
            <li><strong>Accountability mechanisms:</strong> Power must be visible and contestable</li>
            <li><strong>Iterative learning:</strong> Governance evolves based on what works in practice</li>
          </ul>

          <h2>Current Commitments</h2>

          <h3>For Website Data:</h3>
          <ul>
            <li>Minimal collection (only what's necessary for accessibility improvements)</li>
            <li>Full transparency about what's collected and why</li>
            <li>Commitment to transition governance to communities post-PhD</li>
            <li>Users can opt-out via browser "Do Not Track" settings</li>
          </ul>

          <h3>For Research Data:</h3>
          <ul>
            <li>Cardiff University research ethics approval for all data collection</li>
            <li>Informed consent from all participants</li>
            <li>Privacy protection for sensitive information</li>
            <li>Transparent documentation of governance decisions</li>
            <li>Community involvement in determining data use and access</li>
          </ul>

          <h2>What We're Learning</h2>

          <p>
            Year 1 of the PhD is focused on mapping the landscape:
          </p>

          <ul>
            <li>What community governance structures exist in Cardiff?</li>
            <li>Who has legitimacy and capacity for data governance?</li>
            <li>What do different stakeholders want and need from data systems?</li>
            <li>How do power dynamics shape current data practices?</li>
            <li>What technical systems could support inclusive governance?</li>
          </ul>

          <p>
            Findings will inform governance models developed in Years 2-3, tested with Cardiff communities, 
            and refined based on what actually works in practice.
          </p>

          <h2>Theoretical Framework</h2>

          <p>
            This approach draws on:
          </p>

          <ul>
            <li><strong>Design Justice</strong> (Costanza-Chock) — centering marginalised voices in design processes</li>
            <li><strong>Indigenous Data Sovereignty</strong> (OCAP, CARE principles) — community ownership and control of data</li>
            <li><strong>Epistemic Justice</strong> (Fricker) — whose knowledge counts as legitimate</li>
            <li><strong>Power Analysis</strong> (Lukes) — three dimensions of power in governance systems</li>
            <li><strong>Feminist Technology Critique</strong> — examining how technology reproduces or challenges power structures</li>
          </ul>

          <h2>Contact & Questions</h2>

          <p>
            <strong>Lucy Dunhill</strong><br />
            PhD Researcher<br />
            Welsh School of Architecture, Cardiff University<br />
            <a href="mailto:dunhilll@cardiff.ac.uk" style={{ textDecoration: 'underline', color: 'inherit' }}>dunhilll@cardiff.ac.uk</a>
          </p>

          <p>
            Questions, concerns, or suggestions about data governance are welcome. This is research in 
            progress—your input helps shape what we're building.
          </p>

          <p style={{ marginTop: '60px', paddingTop: '40px', borderTop: theme === 'light' ? '2px solid #ddd' : '2px solid rgba(255, 0, 100, 0.2)', fontSize: '11px', color: theme === 'dark' ? 'rgba(255, 0, 100, 0.6)' : '#666', fontStyle: 'italic' }}>
            This website models the data sovereignty transitions it researches. We're practising what we study.
          </p>

          <p style={{ marginTop: '24px', fontSize: '12px', color: theme === 'dark' ? 'rgba(255, 0, 100, 0.6)' : '#666' }}>
            <Link href="/" style={{ textDecoration: 'underline' }}>← Back to Leol Lab</Link>
            {' · '}
            <Link href="/why-web3" style={{ textDecoration: 'underline' }}>Why Web3?</Link>
            {' · '}
            <Link href="/privacy" style={{ textDecoration: 'underline' }}>Privacy</Link>
          </p>
        </div>
      </main>
    </>
  )
}
