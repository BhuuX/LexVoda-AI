import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Database, Cpu as CpuIcon, Book, Shield, Zap, Activity, LayoutDashboard, Terminal, Bot, ChevronUp, ChevronDown, ChevronRight, Monitor, Clock } from 'lucide-react';
import { useAppStore } from './store/appStore';
import { useSovereignAI } from './hooks/useSovereignAI';
import { cn } from './utils/cn';
import EVMLab from './components/EVMLab';
import LexIntelligence from './components/LexIntelligence';
import SystemHealth from './components/SystemHealth';
import './index.css';

const TABS = [
  { id: 0, label: "OVERVIEW", icon: LayoutDashboard },
  { id: 1, label: "INTEL_ENGINE", icon: Database },
  { id: 2, label: "PROTOCOL_LAB", icon: CpuIcon },
  { id: 3, label: "CONSTITUTION", icon: Book }
];

export default function App() {
  const { lang, setLang, activeTab, setActiveTab, isAiExpanded, setIsAiExpanded } = useAppStore();
  const { aiMessage, isThinking, handleQuery, systemHealth } = useSovereignAI(activeTab, lang);

  const [isBooting, setIsBooting] = useState(true);
  const [bootLog, setBootLog] = useState("CORE_INIT...");
  const [currentQuery, setCurrentQuery] = useState("");
  const [localAiMessage, setLocalAiMessage] = useState("");

  useEffect(() => {
    const logs = ["SYSTEM_READY"];
    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) setBootLog(logs[i++]);
      else {
        clearInterval(interval);
        setTimeout(() => setIsBooting(false), 400);
      }
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const onQuerySubmit = (e) => {
    if (e.key === 'Enter' && currentQuery.trim()) {
      handleQuery(currentQuery);
      setCurrentQuery("");
    }
  };

  return (
    <div className="app-shell">
      <div className="data-layer" />

      {/* ─── SYSTEM HEADER ─── */}
      <header className="hud-header">
        <div className="brand-section">
          <div className="brand-logo">
            <Shield size={20} color="white" />
          </div>
          <div>
            <h1 className="notranslate" contentEditable="false" style={{ fontSize: '1.1rem', fontWeight: '800', letterSpacing: '1px', color: 'white', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>LEXVODA AI</h1>
            <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '2px' }}>COMMAND_CORE_V5.0</p>
          </div>
        </div>

        <nav className="nav-cluster">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn("nav-item", activeTab === tab.id && "active")}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div id="google_translate_element" className="translator-container"></div>
          <div className="system-ping" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: systemHealth?.isOnline ? '#10b981' : '#ef4444' }} />
            <span style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-muted)' }}>{systemHealth?.latency || "OFFLINE"}</span>
          </div>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <main className="main-content" style={{ flex: 1, overflowY: 'auto', position: 'relative', padding: '40px 60px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === 0 && <HeroView onEnter={() => setActiveTab(1)} />}
            <div style={{ display: activeTab === 0 ? 'none' : 'block' }}>
              {activeTab === 1 && <LexIntelligence />}
              {activeTab === 2 && <EVMLab />}
              {activeTab === 3 && <ConstitutionView />}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ─── AI COMMAND TERMINAL ─── */}
      <motion.div
        layout
        animate={{
          width: isAiExpanded ? '450px' : '56px',
          height: isAiExpanded ? 'auto' : '56px',
          borderRadius: isAiExpanded ? '12px' : '28px'
        }}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
          overflow: 'hidden',
          zIndex: 500,
          cursor: isAiExpanded ? 'default' : 'pointer'
        }}
        onClick={() => !isAiExpanded && setIsAiExpanded(true)}
      >
        {isAiExpanded ? (
          <div className="animate-fade-in">
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bot size={16} color="var(--primary)" />
                <span style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px' }}>SOVEREIGN_AI_ASSISTANT</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setIsAiExpanded(false); }} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <ChevronDown size={20} />
              </button>
            </div>
            <div style={{ padding: '25px' }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '8px', borderLeft: '3px solid var(--primary)', marginBottom: '20px', minHeight: '120px', display: 'flex', alignItems: 'center' }}>
                <p key={localAiMessage || aiMessage} className="animate-fade-in" style={{ fontSize: '0.8rem', color: 'white', lineHeight: '1.6', width: '100%', whiteSpace: 'pre-line' }}>
                  {localAiMessage || aiMessage}
                </p>
              </div>
              
              <div style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '12px', letterSpacing: '1px' }}>SYSTEM_COMMAND_DIRECTORY</div>
              <div className="space-y-2" style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '5px' }}>
                {[
                  { q: "GET_DEMO_CREDENTIALS", a: "SYSTEM_AUTHORIZED_EPIC_DIRECTORY:\n\n• DELHI: EPIC-DL-001\n• MUMBAI: EPIC-MH-2024\n• BANGALORE: EPIC-KA-882\n• VARANASI: EPIC-UP-990\n• KOLKATA: EPIC-WB-441\n• CHENNAI: EPIC-TN-552\n• WAYANAD: EPIC-KL-663\n• GANDHINAGAR: EPIC-GJ-774\n\n[ACTION: USE IN PROTOCOL_LAB]" },
                  { q: "ARTICLE_324_INTEL", a: "Article 324: Superintendence, direction and control of elections to be vested in an Election Commission." },
                  { q: "VOTER_ELIGIBILITY", a: "Article 326: Every citizen of India who is not less than eighteen years of age shall be entitled to be registered as a voter." },
                  { q: "EVM_TAMPER_PROOFING", a: "Sovereign OS uses One-Time Programmable (OTP) chips and physical security seals. All ballot data is air-gapped from external networks." },
                  { q: "COURT_JURISDICTION", a: "Article 329: Bar to interference by courts in electoral matters. Validity of delimitation laws cannot be questioned in court." },
                  { q: "CONSTITUENCY_COUNT", a: "Current System Active in 8 Regional Nodes including Wayanad, Varanasi, and Gandhinagar." }
                ].map((item, i) => (
                  <button 
                    key={i}
                    onClick={() => {
                      setLocalAiMessage(item.a);
                      // Add a small haptic-like flash
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      background: localAiMessage === item.a ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${localAiMessage === item.a ? 'var(--primary)' : 'var(--border)'}`,
                      borderRadius: '6px',
                      color: localAiMessage === item.a ? 'white' : 'var(--primary)',
                      fontSize: '0.7rem',
                      fontWeight: '800',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{item.q}</span>
                    <ChevronRight size={12} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Bot size={24} color="var(--primary)" />
          </div>
        )}
      </motion.div>

      <footer style={{ height: '40px', borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.4)', padding: '0 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '600' }}>
        <div style={{ display: 'flex', gap: '30px' }}>
          <SystemHealth />
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span>CORE_V5.0.4</span>
          <span style={{ color: 'var(--primary)' }}>● SECURE_CHANNEL_ACTIVE</span>
        </div>
      </footer>
    </div>
  );
}

function HeroView({ onEnter }) {
  return (
    <div className="hero-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="hero-title notranslate" contentEditable="false" style={{ userSelect: 'none', pointerEvents: 'none' }}>LEXVODA</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', letterSpacing: '4px', marginBottom: '60px', fontWeight: '500' }}>SOVEREIGN ELECTORAL INTELLIGENCE CORE</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <button className="btn-initialize" onClick={onEnter}>
          <Monitor size={18} />
          <span>ACCESS_COMMAND_CENTER</span>
        </button>
      </motion.div>

      <div style={{ marginTop: '100px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', width: '100%', maxWidth: '1000px' }}>
        <StatItem label="SOVEREIGN_CITIZENS" val="968.8M" />
        <StatItem label="POLLING_STATIONS" val="1.25M" />
        <StatItem label="SYSTEM_SECURITY" val="99.9%" />
      </div>
    </div>
  );
}

function StatItem({ label, val }) {
  return (
    <div className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
      <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white', marginBottom: '8px' }}>{val}</div>
      <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '700', letterSpacing: '2px' }}>{label}</div>
    </div>
  )
}

const CONSTITUTION_DATA = [
  { 
    id: "324", 
    title: "ARTICLE_324: SUPERINTENDENCE", 
    content: "The superintendence, direction and control of the preparation of the electoral rolls for, and the conduct of, all elections to Parliament and to the Legislature of every State shall be vested in an Election Commission.",
    details: "This article forms the bedrock of electoral independence. It empowers the EC to issue directives that have the force of law during elections, ensuring a 'Level Playing Field' through the Model Code of Conduct (MCC).",
    tags: ["VERIFIED", "IMMUTABLE", "HIGH_AUTHORITY"]
  },
  { 
    id: "325", 
    title: "ARTICLE_325: NON_DISCRIMINATION", 
    content: "No person to be ineligible for inclusion in, or to claim to be included in a special, electoral roll on grounds of religion, race, caste or sex.",
    details: "Ensures absolute secularism in the democratic process. No separate electorate is permitted based on religious or communal identity, enforcing a single, unified national identity for all voters.",
    tags: ["VERIFIED", "IMMUTABLE", "EQUALITY_CORE"]
  },
  { 
    id: "326", 
    title: "ARTICLE_326: ADULT_SUFFRAGE", 
    content: "Elections to the House of the People and to the Legislative Assemblies of States to be on the basis of universal adult suffrage.",
    details: "The 61st Amendment (1988) reduced the voting age from 21 to 18. This article guarantees that every citizen meeting the age requirement, and not otherwise disqualified, has an inherent right to participate in the Sovereign mandate.",
    tags: ["VERIFIED", "IMMUTABLE", "DEMOCRATIC_ROOT"]
  },
  { 
    id: "327", 
    title: "ARTICLE_327: LEGISLATIVE_POWER", 
    content: "Power of Parliament to make provision with respect to elections to Legislatures.",
    details: "Enables the creation of the Representation of the People Acts (1950 & 1951), which define the technical and procedural mechanics of how elections are fought and won in the Indian Union.",
    tags: ["VERIFIED", "IMMUTABLE", "LEGAL_FRAMEWORK"]
  },
  { 
    id: "328", 
    title: "ARTICLE_328: STATE_PROVISION", 
    content: "Power of Legislature of a State to make provision with respect to elections to such Legislature.",
    details: "Grants residual power to State Legislatures to refine electoral laws for their specific regional context, provided they do not contradict the overarching laws passed by the National Parliament.",
    tags: ["VERIFIED", "IMMUTABLE", "REGIONAL_LAW"]
  },
  { 
    id: "329", 
    title: "ARTICLE_329: COURT_BAR", 
    content: "Bar to interference by courts in electoral matters; validity of any law relating to the delimitation of constituencies shall not be called in question.",
    details: "Ensures that the electoral schedule and delimitation process are not stalled by litigation. Election disputes must only be handled via Election Petitions after the results are declared, maintaining the sanctity of the timeline.",
    tags: ["VERIFIED", "IMMUTABLE", "JUDICIAL_RESTRAINT"]
  },
  { 
    id: "RP51", 
    title: "SEC_61A: EVM_RECOGNITION", 
    content: "Recognition of Electronic Voting Machines (EVMs) in the Representation of the People Act, 1951.",
    details: "Inserted in 1989, this section legally validates the use of electronic machines for recording and counting votes. It serves as the primary legal authority for the technology showcased in the PROTOCOL_LAB.",
    tags: ["VERIFIED", "RP_ACT_1951", "TECH_LEGALITY"]
  },
  { 
    id: "VVPAT", 
    title: "CONDUCT_RULES_1961: VVPAT", 
    content: "Rule 49A to 49X of the Conduct of Elections Rules, 1961 - VVPAT Protocol.",
    details: "Mandates the use of Voter Verifiable Paper Audit Trails (VVPAT). This rule ensures that for every electronic vote, a physical slip is printed for 7 seconds, allowing the voter to verify their choice visually.",
    tags: ["VERIFIED", "AUDIT_READY", "TRANSPARENCY"]
  }
];

function ConstitutionView() {
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px' }}>CONSTITUTIONAL_MATRIX</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Official Regulatory Frameworks and Electoral Statutes</p>
      </div>

      <div className="constitution-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '25px' }}>
        {CONSTITUTION_DATA.map(art => (
          <div key={art.id} className="glass-card" style={{ position: 'relative', overflow: 'hidden', padding: '30px' }}>
            <div style={{ position: 'absolute', top: '-10px', right: '10px', fontSize: '4rem', fontWeight: '900', opacity: 0.05, color: 'var(--primary)' }}>{art.id}</div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '32px', height: '32px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Book size={16} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'white', letterSpacing: '0.5px' }}>{art.title}</h3>
            </div>

            <div style={{ marginBottom: '20px' }}>
               <p style={{ color: 'white', lineHeight: '1.6', fontSize: '0.9rem', fontWeight: '500', marginBottom: '15px' }}>
                 {art.content}
               </p>
               <div style={{ padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', borderLeft: '2px solid var(--primary)' }}>
                 <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: '1.6', fontStyle: 'italic' }}>
                   {art.details}
                 </p>
               </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {art.tags.map(tag => (
                <span key={tag} style={{ fontSize: '0.6rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '4px', fontWeight: '800', letterSpacing: '1px' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
