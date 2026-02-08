import Head from 'next/head'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Governance() {
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
        <title>Data Governance | Leol Lab</title>
        <meta name="description" content="Data governance model for Leol Lab research website" />
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
          <h1 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '24px' }}>Data Governance</h1>

          <p style={{ fontSize: '12px', color: theme === 'light' ? '#666' : '#999', marginBottom: '32px' }}>
            Last updated: February 2025
          </p>

          <h2>Current Phase: Institutional Stewardship</h2>
          <p><strong>Data Steward:</strong> Cardiff University (Welsh School of Architecture)<br />
          <strong>Researcher:</strong> Lucy Dunhill<br />
          <strong>Status:</strong> Temporary custodianship during PhD research (2025-2028)</p>

          <h2>Purpose</h2>
          <p>This website collects minimal user interaction data to:</p>
          <ul>
            <li>Improve accessibility for all users</li>
            <li>Understand engagement with data sovereignty concepts</li>
            <li>Inform research on community-led governance systems</li>
          </ul>

          <h2>Governance Principles</h2>
          
          <h3>1. Temporary Stewardship</h3>
          <p>Cardiff University holds data on behalf of site visitors and communities, not as permanent owner. This is custodianship, not ownership.</p>

          <h3>2. Community Sovereignty</h3>
          <p>Data belongs to visitors and communities who generate it, not to the institution or researcher.</p>

          <h3>3. Transition Commitment</h3>
          <p>Upon research completion, governance will transfer to community-determined structures. The exact model will emerge from research with Cardiff communities.</p>

          <h3>4. Emergent Design</h3>
          <p>We do not prescribe the future governance structure. It will be co-designed with communities based on:</p>
          <ul>
            <li>Existing community governance structures</li>
            <li>Community capacity and legitimacy</li>
            <li>What communities actually want and need</li>
            <li>Technical feasibility and sustainability</li>
          </ul>

          <h3>5. Transparent Documentation</h3>
          <p>All decisions about data collection, use, and retention are documented publicly. This transparency is a core research principle.</p>

          <h2>Research Phase (2025-2028)</h2>
          
          <h3>Currently Investigating:</h3>
          <ul>
            <li>What community governance structures exist in Cardiff?</li>
            <li>Who has legitimacy and capacity for data governance?</li>
            <li>What do communities want and need from data systems?</li>
            <li>How could data be governed collectively?</li>
            <li>What technical systems support community control?</li>
          </ul>

          <h3>Possible Future Governance Models:</h3>
          <ul>
            <li>Federated network of community councils and anchor organisations</li>
            <li>Community cooperative or commons structure</li>
            <li>Distributed autonomous organisation (DAO) with multi-stakeholder membership</li>
            <li>Hybrid model combining existing structures with new mechanisms</li>
            <li>Structure yet to be imagined through community co-design</li>
          </ul>
          <p><strong>The decision will be made in consultation with Cardiff communities, not predetermined.</strong></p>

          <h2>Community Rights (Current Phase)</h2>
          <p>Even during institutional stewardship, communities and visitors have the right to:</p>
          <ul>
            <li>View what data is collected (full transparency)</li>
            <li>Understand how data is used</li>
            <li>Opt-out of data collection</li>
            <li>Contact researcher with concerns</li>
            <li>Audit data practices</li>
            <li>Request changes to governance model</li>
          </ul>

          <h2>Transition Timeline</h2>
          <p><strong>2025-2026:</strong> Map community landscape, understand existing governance structures, document capacity and needs</p>
          <p><strong>2026-2027:</strong> Co-design governance model with Cardiff communities, test transition mechanisms</p>
          <p><strong>2027-2028:</strong> Refine and document transition process, prepare infrastructure handover</p>
          <p><strong>2028+:</strong> Transfer to community-determined governance structure with ongoing support</p>

          <h2>Technical Infrastructure</h2>
          
          <h3>Current:</h3>
          <p>Vercel Analytics (privacy-friendly, minimal data collection)</p>
          <ul>
            <li>No personal information collected</li>
            <li>No tracking cookies</li>
            <li>GDPR compliant</li>
          </ul>

          <h3>Future Possibilities:</h3>
          <p>Technical approach will be determined by community needs and capacity:</p>
          <ul>
            <li>Self-hosted analytics on community-controlled servers</li>
            <li>Distributed storage across network infrastructure</li>
            <li>Blockchain/Web3 systems for transparent governance</li>
            <li>Federated systems respecting local autonomy</li>
            <li>Or no analytics at all, if communities prefer</li>
          </ul>

          <h2>Methodological Note</h2>
          <p>This governance model is itself a research output. We are documenting how institutional data stewardship can transition to community sovereignty — modelling the governance transitions we study.</p>
          <p>This approach draws on Indigenous Data Sovereignty principles (OCAP, CARE) and decolonial methodologies, applying them to urban governance contexts.</p>

          <h2>Contact</h2>
          <p>
            Lucy Dunhill<br />
            <a href="mailto:dunhilll@cardiff.ac.uk">dunhilll@cardiff.ac.uk</a><br />
            Welsh School of Architecture, Cardiff University
          </p>

          <hr style={{ margin: '40px 0', border: 'none', borderTop: `1px solid ${theme === 'light' ? '#666' : '#999'}` }} />

          <p style={{ fontSize: '12px', color: theme === 'light' ? '#666' : '#999', fontStyle: 'italic' }}>
            This website practises the data sovereignty transitions it researches.
          </p>
        </article>
      </main>
    </>
  )
}