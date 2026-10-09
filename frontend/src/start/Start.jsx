import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './Start.css'

function Counter({ target, duration = 1800 }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      const start = performance.now()
      const tick = (now) => {
        const pct = Math.min((now - start) / duration, 1)
        const ease = 1 - Math.pow(1 - pct, 3)
        setVal(Math.round(ease * target))
        if (pct < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return <span ref={ref}>{val.toLocaleString()}</span>
}

function BuildingSVG({ height = 100, width = 40, color = '#3A5CE8', opacity = 1 }) {
  const scale = height / 120;
  return (
    <svg width={width} height={120} viewBox={`0 0 ${width} 120`} fill="none" xmlns="http://www.w3.org/2000/svg" className="svg-figure">
      <rect x="0" y={120 - height} width={width} height={height} rx="4" fill={color} opacity={opacity} />
      {height > 40 && (
        <>
          <rect x={width * 0.2} y={120 - height + 15} width={width * 0.2} height="12" rx="2" fill="#ffffff" opacity="0.3" />
          <rect x={width * 0.6} y={120 - height + 15} width={width * 0.2} height="12" rx="2" fill="#ffffff" opacity="0.3" />
          <rect x={width * 0.2} y={120 - height + 35} width={width * 0.2} height="12" rx="2" fill="#ffffff" opacity="0.3" />
          <rect x={width * 0.6} y={120 - height + 35} width={width * 0.2} height="12" rx="2" fill="#ffffff" opacity="0.3" />
        </>
      )}
    </svg>
  )
}

const features = [
  { icon: '🛰️', color: '#DFE8FF', label: 'Data Source', title: 'SpaceNet-6 Dataset', desc: 'Leveraging pre-aligned SAR and optical image chips to build a robust baseline for urban infrastructure analysis.' },
  { icon: '📡', color: '#FFE8DF', label: 'Sensor 1', title: 'SAR Distortions', desc: 'Utilizing Synthetic Aperture Radar geometric distortions (layover, shadow) to extract reliable height-related cues.' },
  { icon: '📸', color: '#DFFAEA', label: 'Sensor 2', title: 'Optical Spatial Context', desc: 'Fusing high-resolution optical imagery to provide clear spatial context and improve building footprint isolation.' },
  { icon: '⚙️', color: '#F5EDD6', label: 'MVP Goal', title: 'Coarse Estimation', desc: 'Successfully generating approximate height estimates and rankings for 5–10 buildings per scene.' },
  { icon: '📉', color: '#DFE8FF', label: 'Evaluation', title: 'MAE & RMSE Metrics', desc: 'Computing standard error metrics to validate predicted heights against the provided reference samples.' },
  { icon: '🔍', color: '#FFE8DF', label: 'Enhancement', title: 'Visual Comparisons', desc: 'Providing side-by-side visual validations of our model\'s predicted heights versus the ground truth data.' },
]

const steps = [
  { n: '01', title: 'Load Imagery', desc: 'Import pre-aligned SAR and optical image pairs from the SpaceNet-6 Kaggle dataset.' },
  { n: '02', title: 'Fuse Modalities', desc: 'Apply our custom fusion approach to combine radar geometry with optical spatial context.' },
  { n: '03', title: 'Infer Heights', desc: 'Run the image processing model to generate height estimates for 5-10 target buildings.' },
  { n: '04', title: 'Evaluate Errors', desc: 'Calculate MAE/RMSE and export final visualizations for the project summary.' },
]

const bars = [
  { h: 30, val: '12m', age: 'B1' },
  { h: 45, val: '24m', age: 'B2' },
  { h: 65, val: '38m', age: 'B3' },
  { h: 50, val: '28m', age: 'B4' },
  { h: 80, val: '45m', age: 'B5', accent: true },
]

function LandingPage() {
  return (
    <div className="start-page">


      {/* NAV */}
      <nav>
        <div className="nav-logo">
          <span className="nav-logo-dot" />
          GeoFusion AI
        </div>
        <ul className="nav-links">
          <li><a href="#features"></a></li>
          <li><a href="#how">Workflow</a></li>
        </ul>
        <Link to="/dashboard" className="nav-cta">View Results →</Link>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <div className="badge">
            <span className="badge-pulse" />
             Multi-Sensor Fusion
          </div>

          <h1 className="hero-title">
            Estimate building<br />
            <em>heights</em> with<br />
            sensor fusion
          </h1>

          <p className="hero-sub">
            Fusing Synthetic Aperture Radar (SAR) and optical imagery using the SpaceNet-6 dataset to infer urban infrastructure heights with minimal error.
          </p>

          <div className="hero-actions">
            <Link to="/dashboard" className="btn-primary">
              View MVP Results
              <span className="btn-arrow">
                <svg width="12" height="12" fill="none" viewBox="0 0 12 12">
                  <path d="M2 6h8M7 3l3 3-3 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </Link>
            <button className="btn-secondary">
              Read Methodology
              <svg width="14" height="14" fill="none" viewBox="0 0 14 14">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              
            </div>
            <div className="stat-item">
              
            </div>
            <div className="stat-item">
              
              
            </div>
          </div>
        </div>

        {/* Visualization Panel */}
        <div className="hero-right">
          <div className="float-tag float-tag-1">
            <span className="tag-dot" style={{background:'var(--green)'}} />
            MAE / RMSE Validated
          </div>
          <div className="float-tag float-tag-2">
            <span className="tag-dot" style={{background:'var(--orange)'}} />
            SAR + Optical
          </div>

          <div className="viz-card">
            <div className="viz-header">
              <span className="viz-title">Inference Output: Scene 42</span>
              <span className="viz-live"><span className="live-dot"/>Live Fusion</span>
            </div>

            {/* Figures */}
            <div className="human-figure-wrap">
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'0.5rem'}}>
                <BuildingSVG height={65} color="var(--line)" />
                <span style={{fontSize:'0.65rem',fontWeight:600,color:'var(--ink-soft)',textTransform:'uppercase',letterSpacing:'0.06em'}}>Ground Truth</span>
                <span style={{fontFamily:'Clash Display,sans-serif',fontWeight:700,fontSize:'0.9rem',color:'var(--ink-soft)'}}>42.0 m</span>
              </div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'0.5rem'}}>
                <BuildingSVG height={72} color="var(--accent)" />
                <span style={{fontSize:'0.65rem',fontWeight:600,color:'var(--accent)',textTransform:'uppercase',letterSpacing:'0.06em'}}>Predicted</span>
                <span style={{fontFamily:'Clash Display,sans-serif',fontWeight:700,fontSize:'0.9rem',color:'var(--accent)'}}>45.3 m</span>
              </div>
            </div>

            {/* Bar chart representing MVP buildings */}
            <div className="bar-chart">
              {bars.map((b, i) => (
                <div className="bar-item" key={i}>
                  <div className="bar-val">{b.val}</div>
                  <div
                    className="bar"
                    style={{
                      height: b.h,
                      background: b.accent ? 'var(--accent)' : 'var(--line)',
                      animationDelay: `${i * 0.1 + 0.6}s`
                    }}
                  />
                  <div className="bar-age">{b.age}</div>
                </div>
              ))}
            </div>

            <div className="result-strip">
              <div>
                <div className="result-text">Target Building (B5)</div>
                <div className="result-value">45.3 m</div>
              </div>
              <span className="result-conf">RMSE: 3.3m</span>
            </div>

            <div className="input-row">
              <div className="fake-input">
                <span style={{color: 'var(--accent)'}}>{`{`}</span> SAR + Opt <span style={{color: 'var(--accent)'}}>{`}`}</span> → Fusion
              </div>
              <button className="fake-btn">Run Model</button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" id="features">
        <div className="features-header">
          <div>
            <p className="section-label">Track 3 Requirements</p>
            <h2 className="section-title">Fusing modalities for<br />accurate mapping</h2>
          </div>
          <p className="section-desc">
            To estimate heights in urban regions, we leverage the distinct advantages of both sensor types, meeting all MVP requirements for the hackathon.
          </p>
        </div>

        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-cell" key={i}>
              <div className="feature-icon" style={{background:f.color}}>{f.icon}</div>
              <div style={{fontSize:'0.65rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--ink-soft)',marginBottom:'0.4rem'}}>{f.label}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how" id="how">
        <div className="how-header">
          <p className="section-label">Suggested Workflow</p>
          <h2 className="section-title" style={{marginBottom:'0.5rem'}}>Our approach to height inference</h2>
          <p style={{color:'var(--ink-soft)',fontWeight:300,fontSize:'0.95rem'}}>From raw SpaceNet-6 datasets to visualized summary slides.</p>
        </div>

        <div className="steps-row">
          {steps.map((s, i) => (
            <div className="step" key={i}>
              <div className="step-num" style={{color:i===0?'var(--accent)':'var(--ink)'}}>{s.n}</div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="cta-strip" id="start">
        <div>
          <h2 className="cta-title">Check out our final<br/>prediction tables</h2>
          <p className="cta-sub">Review our MVP results, error metrics, and visual comparisons against the ground truth.</p>
        </div>
        <Link to="/dashboard" className="cta-btn">
          View Summary Slide
          <svg width="14" height="14" fill="none" viewBox="0 0 14 14">
            <path d="M3 7h8M8 4l3 3-3 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>

      {/* FOOTER */}
      <footer>
        <span className="footer-copy">© 2026 GeoFusion AI ·</span>
        <div className="footer-links">
          <a href="#">Kaggle Dataset</a>
          <a href="#">Methodology</a>
          <a href="#">GitHub Repo</a>
        </div>
      </footer>
    </div>
  )
}


export default LandingPage;
