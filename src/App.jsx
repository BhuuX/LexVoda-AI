import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Database, Cpu as CpuIcon, Book, MessageSquare, Terminal } from 'lucide-react';
import { useAppStore } from './store/appStore';
import { cn } from './utils/cn';
import EVMLab from './components/EVMLab';
import LexIntelligence from './components/LexIntelligence';
import './index.css';

const TABS = [
  { id: 0, label: "JOURNEY", icon: Globe },
  { id: 1, label: "INTEL_ENGINE", icon: Database },
  { id: 2, label: "PROTOCOL_LAB", icon: CpuIcon },
  { id: 3, label: "MATRIX", icon: Book }
];

const QA_MAP = {
  0: [
    { q: "WHAT_IS_LEXVODA?", a: "LexVoda is a Sovereign OS designed to bridge the gap between complex constitutional data and citizen participation through high-precision simulation." },
    { q: "HOW_TO_START?", a: "Navigate to the PROTOCOL_LAB to undergo a full simulation of the Indian voting process, from ID verification to VVPAT audit." }
  ],
  1: [
    { q: "DATA_SOURCE?", a: "Data is indexed from official ECI repositories and constituency GIS maps to ensure 99.9% telemetry accuracy." },
    { q: "ANALYSIS_TYPE?", a: "We perform demographic density analysis and constitutional boundary auditing in real-time." }
  ],
  2: [
    { q: "IS_EVM_SECURE?", a: "Strictly. EVMs function as isolated state machines with no network connectivity. Our simulation mirrors this air-gapped protocol." },
    { q: "VVPAT_ROLE?", a: "The Voter Verifiable Paper Audit Trail provides a physical record of the digital vote, ensuring absolute auditability." }
  ],
  3: [
    { q: "ARTICLE_324?", a: "This article grants the Election Commission authority over the conduct of all elections to Parliament and State Legislatures." },
    { q: "MODEL_CODE?", a: "MCC is a set of guidelines issued by the ECI to ensure free and fair elections, active from the date of election announcement." }
  ]
};

export default function App() {
  const { lang, setLang, activeTab, setActiveTab, systemStatus } = useAppStore();
  const [aiMessage, setAiMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    setAiMessage(lang === 'en' ? "LexVoda AI ready. How can I assist your sovereign inquiry today?" : "लेक्सोडा एआई तैयार है। मैं आपकी सहायता कैसे कर सकता हूँ?");
  }, [activeTab, lang]);

  const handleQuery = (answer) => {
    setIsThinking(true);
    setTimeout(() => {
      setAiMessage(answer);
      setIsThinking(false);
    }, 800);
  };

  return (
    <div className="app-shell">
      <div className="bg-mesh" />
      <div className="data-layer" />
      
      <motion.div 
        animate={{ y: ["0vh", "100vh"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="fixed top-0 left-0 w-full h-[1px] bg-cyan-400 opacity-10 z-[100]"
      />

      <header className="hud-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '40px', height: '40px', border: '1px solid rgba(0,242,255,0.1)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%', boxShadow: '0 0 10px var(--primary)' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '900', letterSpacing: '4px', lineHeight: '1' }}>
                LEXVODA <span style={{ color: 'var(--primary)', fontSize: '0.5rem', verticalAlign: 'top', opacity: 0.5 }}>INTELLIGENCE</span>
            </h2>
            <p style={{ fontSize: '0.45rem', letterSpacing: '2px', color: 'rgba(255,255,255,0.2)', marginTop: '4px' }}>PROTOCOL_NODE_X09</p>
          </div>
        </div>

        <nav className="nav-cluster">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("nav-item", activeTab === tab.id && "active")}>
              {tab.label}
            </button>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'right', fontFamily: 'JetBrains Mono' }}>
                <div style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '800' }}>{new Date().toLocaleTimeString()}</div>
                <div style={{ fontSize: '0.4rem', opacity: 0.2 }}>NODE: 0X_AS_S1</div>
            </div>
            <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '6px 12px', fontSize: '0.6rem', fontWeight: 'bold' }}>
                {lang === 'en' ? 'HI' : 'EN'}
            </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '40px 10%', position: 'relative', zIndex: 10 }}>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            {activeTab === 0 && <HeroView onEnter={() => setActiveTab(2)} />}
            <div style={{ display: activeTab === 0 ? 'none' : 'block' }}>
                {activeTab === 1 && <LexIntelligence />}
                {activeTab === 2 && <EVMLab />}
                {activeTab === 3 && <ConstitutionView />}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 🤖 Interactive Assistant Tooling */}
      <div style={{ position: 'fixed', bottom: '80px', right: '40px', width: '380px', background: 'rgba(0,10,20,0.85)', backdropFilter: 'blur(30px)', border: '1px solid rgba(0,242,255,0.15)', borderRadius: '4px', overflow: 'hidden', zIndex: 500 }}>
          <div style={{ background: 'rgba(0,242,255,0.1)', padding: '10px 15px', borderBottom: '1px solid rgba(0,242,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Terminal size={12} color="var(--primary)" />
                <span style={{ fontSize: '0.55rem', fontWeight: '900', color: 'var(--primary)', letterSpacing: '2px' }}>AI_SOVEREIGN_ASSISTANT</span>
              </div>
              <div style={{ width: '8px', height: '8px', background: '#00ff88', borderRadius: '50%' }} />
          </div>
          
          <div style={{ padding: '20px' }}>
              <p style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono', color: isThinking ? 'var(--primary)' : 'rgba(255,255,255,0.9)', lineHeight: '1.6', marginBottom: '20px', minHeight: '60px' }}>
                {isThinking ? "[ACCESSING_ENCRYPTED_DB...]" : aiMessage}
              </p>
              
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {QA_MAP[activeTab].map((qa, i) => (
                    <button 
                        key={i} 
                        onClick={() => handleQuery(qa.a)}
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(0,242,255,0.8)', fontSize: '0.55rem', padding: '6px 12px', cursor: 'pointer', fontWeight: '800', transition: 'all 0.2s' }}
                        onMouseOver={e => e.target.style.background = 'rgba(0,242,255,0.1)'}
                        onMouseOut={e => e.target.style.background = 'rgba(255,255,255,0.03)'}
                    >
                        {qa.q}
                    </button>
                  ))}
              </div>
          </div>
      </div>

      <footer className="hud-footer">
        <div style={{ display: 'flex', gap: '40px', color: 'var(--primary)', fontWeight: '900' }}>
            <span>SYSTEM_STABILITY: 100%</span>
            <span style={{ color: '#00ff88' }}>DATABASE_SYNC: SUCCESS</span>
        </div>
        <div style={{ display: 'flex', gap: '40px', opacity: 0.2 }}>
            <span>OS_V.3.9</span>
            <span style={{ color: 'var(--primary)', opacity: 1 }}>LEXVODA_SECURE_ENCLAVE</span>
        </div>
      </footer>
    </div>
  );
}

function HeroView({ onEnter }) {
  return (
    <div className="hero-container">
        <h1 className="hero-title" style={{ fontSize: '11rem' }}>VODA</h1>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '1.2rem', letterSpacing: '10px', marginBottom: '60px' }}>NATIONAL INTELLIGENCE SUITE</p>
        <button className="btn-initialize" onClick={onEnter}>BOOT_SYSTEM</button>
        <div style={{ marginTop: '100px', display: 'flex', gap: '100px' }}>
            <StatItem label="SOVEREIGN_VOTERS" val="968.8M" />
            <StatItem label="SYNC_BOOTHS" val="1.2M" />
            <StatItem label="HW_SYSTEMS" val="2.3M" />
        </div>
    </div>
  );
}

function StatItem({ label, val }) {
    return (
        <div style={{ textAlign: 'left', borderLeft: '1px solid rgba(255,255,255,0.05)', paddingLeft: '20px' }}>
            <div style={{ fontSize: '2rem', fontWeight: '900' }}>{val}</div>
            <div style={{ fontSize: '0.45rem', color: 'var(--primary)', fontWeight: '800', letterSpacing: '2px' }}>{label}</div>
        </div>
    )
}

function ConstitutionView() {
    return (
        <div className="glass-card">
            <h2 style={{ fontSize: '4.5rem', fontWeight: '900', letterSpacing: '-3px', marginBottom: '40px' }}>SOVEREIGN_MATRIX</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
                <div style={{ background: 'rgba(255,255,255,0.01)', padding: '35px', border: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: '900', marginBottom: '15px' }}>[ART_324] SYSTEM_CONTROL</div>
                    <p style={{ color: 'rgba(255,255,255,0.4)', lineHeight: '1.8' }}>Responsibility for the superintendence, direction, and control of electoral rolls is vested in the Commission protocol.</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.01)', padding: '35px', border: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: '900', marginBottom: '15px' }}>[ART_326] SUFFRAGE_LOGIC</div>
                    <p style={{ color: 'rgba(255,255,255,0.4)', lineHeight: '1.8' }}>Universal Adult Suffrage ensures every citizen over 18 possesses the statutory right to interact with the database.</p>
                </div>
            </div>
        </div>
    )
}
