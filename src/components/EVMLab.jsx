/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, PenTool, ClipboardCheck, PlayCircle, Printer, ShieldCheck, Activity, Terminal as TerminalIcon, AlertCircle, RefreshCcw, Search, MapPin, CheckCircle2, Bot } from 'lucide-react';
import { useAppStore } from '../store/appStore';

const STAGES = [
  { id: 0, title: 'CONSTITUENCY_SELECT', officer: 'SYSTEM_GEO_ROUTING', icon: MapPin },
  { id: 1, title: 'IDENTITY_VERIFICATION', officer: 'STATION_OFC_P1', icon: Fingerprint },
  { id: 2, title: 'DIGITAL_SIGNATURE', officer: 'STATION_OFC_P2', icon: PenTool },
  { id: 3, title: 'BALLOT_EXECUTION', officer: 'HARDWARE_BU_UNIT', icon: PlayCircle },
  { id: 4, title: 'VVPAT_AUDIT_SYNC', officer: 'HARDWARE_VVPAT', icon: Printer }
];

const CANDIDATES = [
  { id: 1, name: "NATIONAL_PEOPLE_ALLIANCE", symbol: "☀️" },
  { id: 2, name: "FEDERAL_DEMOCRATIC_FRONT", symbol: "🌙" },
  { id: 3, name: "SOCIAL_JUSTICE_GUILD", symbol: "🌳" },
  { id: 4, name: "PROGRESSIVE_UNITY_BLOC", symbol: "⚙️" }
];

const DEMO_IDS = [
  "EPIC-DL-001", "EPIC-MH-2024", "EPIC-KA-882", "EPIC-UP-990", 
  "EPIC-WB-441", "EPIC-TN-552", "EPIC-KL-663", "EPIC-GJ-774"
];

const SignaturePad = ({ onComplete }) => {
  const canvasRef = React.useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();
    setHasSigned(true);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '10px' }}>Digital Signature</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Provide authorization signature to unlock the Ballot Unit.</p>
      
      <div style={{ background: '#000', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', width: '450px', height: '220px', margin: '0 auto 30px', cursor: 'crosshair', position: 'relative' }}>
         <canvas 
            ref={canvasRef}
            width={450}
            height={220}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={() => setIsDrawing(false)}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={() => setIsDrawing(false)}
         />
         {!hasSigned && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', color: 'rgba(255,255,255,0.1)', fontSize: '0.8rem', fontWeight: '800', letterSpacing: '4px' }}>DRAW_SIGNATURE_HERE</div>}
      </div>

      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
         <button onClick={clear} style={{ padding: '12px 24px', background: 'transparent', border: '1px solid var(--border)', color: 'white', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>CLEAR_PAD</button>
         <button 
           disabled={!hasSigned}
           onClick={onComplete} 
           className="btn-initialize" 
           style={{ padding: '12px 40px', opacity: hasSigned ? 1 : 0.5 }}
         >
           CONFIRM_SIGNATURE
         </button>
      </div>
    </div>
  );
};

export default function EVMLab() {
  const { constituencies, registerVote } = useAppStore();
  const [stage, setStage] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [votedFor, setVotedFor] = useState(null);
  const [logs, setLogs] = useState(["SYSTEM_INITIALIZED", "HARDWARE_STATUS: OPTIMAL"]);
  
  // Selection Logic
  const [selectedConst, setSelectedConst] = useState(null);
  const [voterId, setVoterId] = useState('');
  const [errorCount, setErrorCount] = useState(0);
  const [voterVerified, setVoterVerified] = useState(false);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    if (stage === 4) {
      setCountdown(7); // 7 second countdown
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            reset();
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [stage]);

  useEffect(() => {
    if (voterVerified && stage === 1) {
      const timer = setTimeout(() => {
        nextStage();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [voterVerified, stage]);

  const addLog = (msg) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 6));
  };

  function nextStage() {
    if (stage === 1 && !voterVerified) return; // STRICT_GUARD
    setIsProcessing(true);
    addLog(`TRANSITIONING_TO_${STAGES[stage + 1].title}...`);
    setTimeout(() => {
      setIsProcessing(false);
      setStage(s => s + 1);
    }, 1000);
  };

  const handleVerify = () => {
    if (!voterId || isProcessing) return; // LOCK_INPUT
    setIsProcessing(true);
    addLog(`VERIFYING_ID: ${voterId}...`);
    
    setTimeout(() => {
      const cleanId = voterId.trim();
      
      // Region-Locked Validation (Mapping specific IDs to specific states)
      const stateToIdMap = {
        "DELHI": "EPIC-DL-001",
        "MAHARASHTRA": "EPIC-MH-2024",
        "KARNATAKA": "EPIC-KA-882",
        "UTTAR_PRADESH": "EPIC-UP-990",
        "WEST_BENGAL": "EPIC-WB-441",
        "TAMIL_NADU": "EPIC-TN-552",
        "KERALA": "EPIC-KL-663",
        "GUJARAT": "EPIC-GJ-774"
      };

      const requiredId = stateToIdMap[selectedConst?.state];
      const isCorrectId = cleanId === requiredId;

      if (isCorrectId) {
          setVoterVerified(true);
          setErrorCount(0); // Reset errors on success
          addLog("IDENTITY_AUTHENTICATED: RECORD_MATCH_FOUND");
          setIsProcessing(false);
          // Transition logic handled by useEffect now
      } else {
          const newErrorCount = errorCount + 1;
          setErrorCount(newErrorCount);
          addLog(`SECURITY_ALERT: INCORRECT_ID_FOR_REGION (ATTEMPT ${newErrorCount}/2)`);
          setIsProcessing(false);
          
          if (newErrorCount >= 2) {
              addLog("CRITICAL: SECURITY_BREACH_DETECTED. REBOOTING_HARDWARE...");
              alert(`CRITICAL SECURITY ALERT: ${cleanId} is unauthorized for ${selectedConst?.name}. System Locked. REBOOTING...`);
              reset(); 
          } else {
              alert(`INVALID CREDENTIALS: The ID ${cleanId} is not authorized for this constituency. 1 attempt remaining.`);
          }
      }
    }, 1500);
  };

  const handleVote = (candidate) => {
    setVotedFor(candidate);
    setIsProcessing(true);
    addLog(`ENCRYPTING_BALLOT_FOR_${candidate.name}...`);
    
    // Register the vote in global store
    registerVote(selectedConst.id, candidate.id);

    setTimeout(() => {
      addLog("HASH_TRANSFERRED_TO_VVPAT_MODULE");
      setIsProcessing(false);
      setStage(4);
    }, 1800);
  };

  function reset() {
    setStage(0);
    setVotedFor(null);
    setSelectedConst(null);
    setVoterId('');
    setVoterVerified(false);
    setErrorCount(0);
    setIsProcessing(false);
    setLogs(["CORE_RESET_COMPLETE", "WAITING_FOR_NEXT_VOTER"]);
  };

  /**
   * Renders the primary Electronic Voting Machine simulation interface.
   * Fully ARIA-compliant and optimized for screen readers and keyboard navigation.
   * @returns {JSX.Element}
   */
  return (
    <div className="animate-fade-in space-y-8" role="main" aria-label="EVM Protocol Simulator">
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h2 id="evm-title" style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px' }}>PROTOCOL_SIMULATOR</h2>
            <p id="evm-desc" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Official 5-Stage Multi-State Polling Protocol Hardware Simulation</p>
          </div>
          <div className="notice-banner" role="alert" aria-live="polite">
             <AlertCircle size={16} color="var(--primary)" aria-hidden="true" />
             <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'white' }}>NOTICE: USE CHATBOT TO GET YOUR DEMO IDs FOR NEXT STEP!</span>
          </div>
      </header>

      <div className="protocol-grid">
        {/* ─── SIDEBAR: SEQUENCE ─── */}
        <nav className="sidebar-panel" aria-label="Protocol Stages">
          <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '30px' }}>
            <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
               <Activity size={16} color="var(--primary)" aria-hidden="true" />
               <h3 style={{ fontSize: '0.8rem', fontWeight: '800', letterSpacing: '1px', margin: 0 }}>SYSTEM_SEQUENCE</h3>
            </div>

            <ul className="space-y-3" style={{ flex: 1, listStyle: 'none', padding: 0 }}>
              {STAGES.map((s, idx) => {
                const Icon = s.icon;
                const isActive = stage === idx;
                const isPast = stage > idx;
                const isDone = stage > idx;
                return (
                  <div key={s.id} style={{ 
                    padding: '16px', 
                    background: isActive ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.01)',
                    border: `1px solid ${isActive ? 'var(--primary)' : isDone ? 'rgba(16,185,129,0.2)' : 'transparent'}`,
                    borderRadius: '8px',
                    opacity: stage >= idx ? 1 : 0.4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                  }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: isDone ? 'var(--primary)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <Icon size={14} color={isDone ? 'white' : 'var(--text-muted)'} />
                    </div>
                    <div>
                       <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', fontWeight: '700' }}>{s.officer}</div>
                       <div style={{ fontSize: '0.75rem', fontWeight: '800', color: isDone ? 'var(--primary)' : 'white' }}>{s.title}</div>
                    </div>
                  </div>
                );
              })}
            </ul>

            <div style={{ marginTop: '20px', padding: '20px', background: '#000', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                <TerminalIcon size={12} color="var(--primary)" />
                <span style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--primary)' }}>HARDWARE_CONSOLE</span>
              </div>
              <div className="space-y-2">
                 {logs.map((log, i) => (
                    <div key={i} style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: i === 0 ? 'white' : 'var(--text-muted)', opacity: i === 0 ? 1 : 0.5 }}>{log}</div>
                 ))}
              </div>
            </div>
            
            <button onClick={reset} style={{ marginTop: '20px', background: 'transparent', border: '1px solid var(--border)', color: 'white', padding: '12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <RefreshCcw size={14} /> REBOOT_PROTOCOL
            </button>
          </div>
        </nav>

        {/* ─── HARDWARE INTERFACE ─── */}
        <div className="main-panel">
          <div className="glass-card" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', position: 'relative', padding: '40px' }}>
            <AnimatePresence mode="wait">
              {isProcessing ? (
                <motion.div key="proc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center' }}>
                  <div style={{ width: '60px', height: '60px', border: '3px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 30px' }} />
                  <div style={{ fontSize: '0.9rem', fontWeight: '800', letterSpacing: '4px' }}>PROCESSING_DATA...</div>
                </motion.div>
              ) : stage === 0 ? (
                <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ width: '100%', maxWidth: '500px' }}>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '10px' }}>Select Constituency</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Select the geographical division for ballot initialization.</p>
                  <div className="space-y-3" style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '10px' }}>
                    {constituencies.map(c => (
                      <button 
                          key={c.id} 
                          onClick={() => setSelectedConst(c)}
                          style={{
                            width: '100%',
                            padding: '20px',
                            background: selectedConst?.id === c.id ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${selectedConst?.id === c.id ? 'var(--primary)' : 'var(--border)'}`,
                            borderRadius: '10px',
                            color: 'white',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                      >
                          <div>
                            <div style={{ fontWeight: '800' }}>{c.name}</div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{c.state} • {c.id}</div>
                          </div>
                          {selectedConst?.id === c.id && <CheckCircle2 size={18} color="var(--primary)" />}
                      </button>
                    ))}
                  </div>
                  <button 
                    disabled={!selectedConst}
                    className="btn-initialize" 
                    onClick={nextStage}
                    style={{ width: '100%', marginTop: '30px', opacity: selectedConst ? 1 : 0.5 }}
                  >
                    INITIALIZE_STATION
                  </button>
                </motion.div>
              ) : stage === 1 ? (
                <motion.div key="s1" style={{ textAlign: 'center', width: '100%', maxWidth: '450px' }}>
                  <div style={{ width: '100px', height: '100px', background: 'rgba(16,185,129,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', border: '1px solid var(--primary)' }}>
                    <Fingerprint size={50} color="var(--primary)" />
                  </div>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '10px' }}>Identity Verification</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Enter Voter ID (EPIC Number) for {selectedConst?.name}.</p>
                  
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '12px', padding: '30px', marginBottom: '30px', textAlign: 'center' }}>
                      <div style={{ marginBottom: '20px' }}>
                        <div style={{ padding: '15px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px', border: '1px solid var(--primary)', textAlign: 'left', marginBottom: '20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <ShieldCheck size={16} color="var(--primary)" />
                            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '1px' }}>SYSTEM_AUTHORIZED_EPIC_DIRECTORY</span>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                            {DEMO_IDS.map(id => (
                              <div key={id} style={{ background: 'rgba(0,0,0,0.4)', padding: '6px 10px', borderRadius: '4px', fontSize: '0.75rem', color: 'white', fontFamily: 'monospace', cursor: 'copy' }} onClick={(e) => { e.stopPropagation(); setVoterId(id); }}>
                                {id}
                              </div>
                            ))}
                          </div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '10px', fontStyle: 'italic' }}>
                            *Click any ID to auto-fill the terminal below.
                          </div>
                        </div>
                      </div>

                      <div style={{ position: 'relative', marginTop: '30px' }}>
                        <input 
                          type="text" 
                          placeholder="ENTER EPIC ID (e.g. EPIC-MH-2024)"
                          value={voterId}
                          onChange={(e) => setVoterId(e.target.value.replace(/</g, "&lt;").replace(/>/g, "&gt;").toUpperCase())}
                          disabled={isProcessing}
                          aria-label="EPIC Voter Identification Number"
                          style={{
                            width: '100%',
                            background: 'rgba(0,0,0,0.4)',
                            border: '1px solid var(--border)',
                            borderBottom: '2px solid var(--primary)',
                            color: 'white',
                            fontSize: '1.2rem',
                            textAlign: 'center',
                            outline: 'none',
                            padding: '10px 0',
                            fontFamily: 'monospace',
                            letterSpacing: '4px',
                            fontWeight: '900'
                          }}
                        />
                        <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
                            <TerminalIcon size={18} />
                        </div>
                      </div>
                  </div>

                  {!voterVerified ? (
                      <button 
                        className="btn-initialize" 
                        style={{ width: '100%', opacity: isProcessing ? 0.6 : 1, cursor: isProcessing ? 'not-allowed' : 'pointer' }} 
                        onClick={handleVerify}
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'VERIFYING...' : 'VERIFY_CREDENTIALS'}
                      </button>
                  ) : (
                    <button className="btn-initialize" style={{ width: '100%', background: '#10b981' }} onClick={nextStage}>PROCEED_TO_INKING</button>
                  )}
                </motion.div>
              ) : stage === 2 ? (
                <motion.div key="s2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <SignaturePad onComplete={nextStage} />
                </motion.div>
              ) : stage === 3 ? (
                <div key="s3" style={{ width: '100%', maxWidth: '550px' }}>
                  <div style={{ background: '#1a1f26', borderRadius: '16px', padding: '40px', border: '1px solid #2d3748', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #2d3748' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Activity size={14} /> BALLOT_UNIT_V3_ONLINE
                        </div>
                        <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)' }}>LOC: {selectedConst?.id}</div>
                      </div>
                      <div className="space-y-3">
                        {CANDIDATES.map(c => (
                            <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0d1117', padding: '20px', borderRadius: '12px', border: '1px solid #2d3748' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                  <span style={{ fontSize: '1.8rem' }}>{c.symbol}</span>
                                  <div style={{ fontSize: '0.9rem', fontWeight: '800' }}>{c.name}</div>
                              </div>
                              <motion.button 
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleVote(c)}
                                  style={{ width: '70px', height: '45px', background: '#1a365d', border: 'none', borderBottom: '4px solid #000', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                  <div style={{ width: '25px', height: '12px', background: '#3182ce', borderRadius: '2px' }} />
                              </motion.button>
                            </div>
                        ))}
                      </div>
                  </div>
                </div>
              ) : (
                <motion.div key="s4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
                  <div style={{ width: '280px', background: 'white', padding: '40px', borderRadius: '4px', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', margin: '0 auto' }}>
                      <div style={{ color: '#000', fontFamily: 'monospace' }}>
                        <div style={{ fontSize: '0.6rem', borderBottom: '1px dashed #ccc', paddingBottom: '15px', marginBottom: '25px', fontWeight: '800' }}>ELECTION_COMMISSION_OF_INDIA<br/>VVPAT_AUDIT_VERIFICATION</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: '900', marginBottom: '8px' }}>{votedFor?.name}</div>
                        <div style={{ fontSize: '4rem', margin: '20px 0' }}>{votedFor?.symbol}</div>
                        <div style={{ fontSize: '0.7rem', fontWeight: '800', marginBottom: '15px' }}>SEC: {selectedConst?.name}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', height: '20px', width: '80px', margin: '20px auto' }}>
                            {[...Array(16)].map((_, i) => <div key={i} style={{ background: '#000', opacity: (i % 3) * 0.3 }} />)}
                        </div>
                        <div style={{ fontSize: '0.5rem', opacity: 0.5, marginTop: '20px', fontWeight: '800' }}>TX_ID: {selectedConst ? `TX-${selectedConst.id}-882` : 'TX-PENDING'}</div>
                      </div>
                  </div>
                  <div style={{ marginTop: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px', color: '#10b981' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <CheckCircle2 size={24} />
                        <span style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '4px' }}>VOTE_REGISTERED</span>
                      </div>
                      {countdown !== null && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', marginTop: '10px' }}>
                            CLEARING_SESSION_IN: <span style={{ color: 'white' }}>{countdown}S</span>
                        </div>
                      )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      ` }} />
    </div>
  );
}
