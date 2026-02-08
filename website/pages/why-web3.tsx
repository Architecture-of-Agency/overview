import Head from 'next/head'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function WhyWeb3() {
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
        <title>Why Web3? | Leol Lab</title>
        <meta name="description" content="Why Web3 technology is essential for anti-majoritarian governance systems" />
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
          margin-bottom: 40px;
          line-height: 1.2;
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

        .comparison-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin: 32px 0;
        }

        .comparison-box {
          padding: 24px;
          border: ${theme === 'light' ? '1px solid #ddd' : '1px solid rgba(255, 0, 100, 0.2)'};
          background: ${theme === 'light' ? '#fafafa' : 'rgba(0, 0, 0, 0.3)'};
        }

        .comparison-title {
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
          .comparison-grid {
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

          <h1>Why Web3?</h1>

          <p>
            Multi-stakeholder governance for the built environment requires technical infrastructure 
            that can encode anti-majoritarian principles, make power visible and contestable, and 
            redistribute authority without creating new centralization points.
          </p>

          <p>
            Web3 technologies—specifically blockchain, smart contracts, and decentralised systems—enable 
            this in ways traditional (Web2) technologies cannot.
          </p>

          <h2>The Problem with Web2</h2>

          <p>
            Traditional database systems require someone to own and control the infrastructure. 
            This creates inevitable power concentration:
          </p>

          <ul>
            <li><strong>Centralised control:</strong> One entity owns the database and can modify, delete, or restrict access to data</li>
            <li><strong>Opaque decision-making:</strong> Changes happen behind closed doors with no public audit trail</li>
            <li><strong>Trust requirement:</strong> Users must trust the platform operator to act fairly</li>
            <li><strong>Single point of failure:</strong> If the controlling entity fails or acts maliciously, the entire system fails</li>
            <li><strong>Capture risk:</strong> Institutional actors with resources can dominate or buy out the platform</li>
          </ul>

          <p>
            For urban governance, this means replacing Local Authority control with... another centralised 
            controller. The power structure doesn't change—it just moves.
          </p>

          <h2>What Web3 Enables</h2>

          <h3>1. Distributed Authority</h3>
          <p>
            Blockchain systems have no single owner or controller. Data is distributed across a network, 
            with consensus mechanisms determining validity. No single stakeholder can unilaterally modify 
            records or change rules.
          </p>

          <h3>2. Transparent, Auditable Records</h3>
          <p>
            All transactions and decisions are recorded on an immutable public ledger. Anyone can verify 
            what happened, when, and who authorized it. This makes power visible and contestable.
          </p>

          <h3>3. Programmable Governance Rules</h3>
          <p>
            Smart contracts encode governance mechanisms in code. Anti-majoritarian protections—quadratic 
            voting, conviction voting, identity-based weighting, veto rights—can be programmatically enforced, 
            not just culturally encouraged.
          </p>

          <h3>4. Trustless Coordination</h3>
          <p>
            Stakeholders with competing interests (developers, communities, local authority, housing associations) 
            can coordinate without requiring trust in a central arbiter. The technology enforces agreed-upon rules.
          </p>

          <h3>5. Community Data Sovereignty</h3>
          <p>
            Place-based data can be owned and governed collectively at the most local scale possible, 
            with transparent federation mechanisms when coordination is needed. Communities control their 
            own data without requiring institutional infrastructure.
          </p>

          <h2>Web2 vs Web3 Comparison</h2>

          <div className="comparison-grid">
            <div className="comparison-box">
              <div className="comparison-title">Web2 (Traditional)</div>
              <ul style={{ margin: 0 }}>
                <li>Centralised database</li>
                <li>Single controller</li>
                <li>Opaque changes</li>
                <li>Trust-based</li>
                <li>Institutional capture risk</li>
                <li>No community sovereignty</li>
              </ul>
            </div>
            <div className="comparison-box">
              <div className="comparison-title">Web3 (Blockchain)</div>
              <ul style={{ margin: 0 }}>
                <li>Distributed ledger</li>
                <li>No single controller</li>
                <li>Transparent audit trail</li>
                <li>Cryptographically verified</li>
                <li>Encoded protections</li>
                <li>Community ownership possible</li>
              </ul>
            </div>
          </div>

          <h2>Anti-Majoritarian Mechanisms</h2>

          <p>
            Web3 enables governance mechanisms that prevent majoritarian tyranny whilst maintaining 
            democratic legitimacy:
          </p>

          <h3>Quadratic Voting</h3>
          <p>
            Voting power is non-linear (cost increases quadratically). Prevents majority from dominating 
            decisions through sheer numbers. Those who care most can signal intensity of preference.
          </p>

          <h3>Conviction Voting</h3>
          <p>
            Time-weighted preferences. Passionate minorities can win over apathetic majorities by maintaining 
            conviction over time. Prevents mob rule on issues that don't affect the majority.
          </p>

          <h3>Identity-Based Weighting</h3>
          <p>
            Stakeholders most affected by a decision have higher voting weight. Examples: disabled people 
            have more power over accessibility decisions, renters over housing policy, communities over 
            place-based decisions. Encodes "nothing about us without us" in code.
          </p>

          <h3>Veto Rights for Marginalised Groups</h3>
          <p>
            Protected groups can veto decisions that harm them, even if the majority approves. Majority 
            cannot override marginalised voices on issues affecting them. Requires supermajority consensus 
            that includes affected groups.
          </p>

          <h3>Mandatory Inclusion Thresholds</h3>
          <p>
            Smart contracts can enforce minimum participation from marginalised groups before decisions 
            are valid. Decision cannot proceed without X% participation from disabled people, renters, 
            minorities, etc. Makes inclusion technically required, not optional.
          </p>

          <h2>Design Justice + Web3</h2>

          <p>
            Design Justice (Costanza-Chock, 2020) argues those most affected by design decisions should 
            lead the design process. Web3 provides technical infrastructure to enforce this principle:
          </p>

          <ul>
            <li><strong>Centres marginalised voices:</strong> Through identity-based weighting and veto rights</li>
            <li><strong>Makes power visible:</strong> Through transparent, auditable decision records</li>
            <li><strong>Prevents institutional capture:</strong> Through distributed authority and encoded protections</li>
            <li><strong>Enables community sovereignty:</strong> Through collective ownership and control of data infrastructure</li>
            <li><strong>Redistributes epistemic authority:</strong> By making lived experience count equally with professional expertise</li>
          </ul>

          <h2>Research Questions</h2>

          <p>
            This research investigates how to design and implement these systems in practice:
          </p>

          <ul>
            <li>Which blockchain platforms best suit multi-stakeholder urban governance?</li>
            <li>How do you design smart contracts that encode anti-majoritarian mechanisms fairly?</li>
            <li>What governance models work across diverse stakeholder groups with competing interests?</li>
            <li>How do you balance transparency with privacy for sensitive community data?</li>
            <li>What happens when stakeholders lack technical capacity to engage with blockchain systems?</li>
            <li>How do you prevent gaming of anti-majoritarian mechanisms by bad actors?</li>
            <li>What does community data sovereignty look like at different scales (street, ward, city)?</li>
          </ul>

          <h2>Cardiff as Case Study</h2>

          <p>
            Cardiff provides an ideal context for testing these systems:
          </p>

          <ul>
            <li>28 wards with varying levels of formal community structure</li>
            <li>Significant marginalised populations (disabled people, renters, minorities)</li>
            <li>Existing power imbalances in urban planning processes</li>
            <li>Multiple institutional stakeholders (Local Authority, housing associations, developers)</li>
            <li>Real need for inclusive governance mechanisms</li>
          </ul>

          <p>
            The research will test governance mechanisms with Cardiff communities, documenting what works, 
            what fails, and why. This isn't theoretical—it's building actual systems with real stakeholders.
          </p>

          <h2>Limitations & Critiques</h2>

          <p>
            Web3 is not a technological solution to social and political problems. The research acknowledges:
          </p>

          <ul>
            <li><strong>Technology doesn't fix power:</strong> Blockchain can encode rules, but rules must be designed through inclusive processes</li>
            <li><strong>Accessibility barriers:</strong> Blockchain systems can be complex and exclude non-technical users</li>
            <li><strong>Energy consumption:</strong> Some blockchain systems have significant environmental costs</li>
            <li><strong>Regulatory uncertainty:</strong> Legal frameworks for blockchain governance are underdeveloped</li>
            <li><strong>Digital divide:</strong> Not everyone has access to technology required to participate</li>
          </ul>

          <p>
            These limitations are part of what the research investigates. The goal is not to claim Web3 
            solves everything, but to explore how it can enable more inclusive governance whilst addressing 
            its limitations.
          </p>

          <h2>Why This Matters</h2>

          <p>
            Current governance systems for the built environment concentrate power in the hands of those 
            with capital, property rights, and institutional authority. Communities—and marginalised people 
            within communities—are systematically excluded.
          </p>

          <p>
            Web3 provides technical infrastructure to redistribute power and encode anti-oppressive principles 
            in governance systems. It's not perfect, but it's a tool that enables possibilities that didn't 
            exist before.
          </p>

          <p>
            This research investigates how to use that tool responsibly, inclusively, and effectively.
          </p>

          <p style={{ marginTop: '60px', paddingTop: '40px', borderTop: theme === 'light' ? '2px solid #ddd' : '2px solid rgba(255, 0, 100, 0.2)', fontSize: '12px', color: theme === 'dark' ? 'rgba(255, 0, 100, 0.6)' : '#666' }}>
            <Link href="/" style={{ textDecoration: 'underline' }}>← Back to Leol Lab</Link>
            {' · '}
            <Link href="/governance" style={{ textDecoration: 'underline' }}>Data Governance</Link>
            {' · '}
            <Link href="/privacy" style={{ textDecoration: 'underline' }}>Privacy</Link>
          </p>
        </div>
      </main>
    </>
  )
}
