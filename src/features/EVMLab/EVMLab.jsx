import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, PenTool, ClipboardCheck, PlayCircle, Printer, Activity, Terminal as TerminalIcon, ShieldCheck } from 'lucide-react';

const STAGES = [
  { id: 0, title: 'BIOMETRIC_CHECK', officer: 'OFFICER_P1', icon: Fingerprint },
  { id: 1, title: 'INKING_PROTOCOL', officer: 'OFFICER_P2', icon: PenTool },
  { id: 2, title: 'SLIP_GENERATION', officer: 'OFFICER_P3', icon: ClipboardCheck },
  { id: 3, title: 'BALLOT_EXECUTION', officer: 'HARDWARE_BU', icon: PlayCircle },
  { id: 4, title: 'VVPAT_INTEGRITY', officer: 'HARDWARE_VVPAT', icon: Printer }
];

const CANDIDATES = [
  { id: 1, name: "CITIZEN_ALPHA", symbol: "☀️" },
  { id: 2, name: "CITIZEN_BETA", symbol: "🌙" },
  { id: 3, name: "CITIZEN_GAMMA", symbol: "🌳" }
];

export default function EVMLab() {
  const [stage, setStage] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [votedFor, setVotedFor] = useState(null);
  const [logs, setLogs] = useState(["SYSTEM_INITIALIZED", "HARDWARE_CHECK_SUCCESS"]);

  const addLog = (msg) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 5));

  const simulateStep = () => {
    setIsProcessing(true);
    addLog(`INITIALIZING_${STAGES[stage].title}...`);
    setTimeout(() => {
      addLog(`${STAGES[stage].title}_COMPLETE`);
      setIsProcessing(false);
      setStage(s => s + 1);
    }, 1500);
  };

  const currentCandidate = votedFor || CANDIDATES[0];

  return (
    <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 3fr', gap: '40px', padding: '40px', height: '650px' }}>
      <div style={{ borderRight: '1px solid rgba(255,255,255,0.05)', paddingRight: '30px' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}><Activity size={16} color="var(--primary)" /><h3 style={{ fontSize: '0.6rem', color: 'var(--primary)', letterSpacing: '3px', fontWeight: '900' }}>PROTOCOL_DIAGNOSTIC</h3></div>
         <div className="space-y-4">
            {STAGES.map((s, idx) => (
                <div key={s.id} style={{ opacity: stage >= idx ? 1 : 0.2, display: 'flex', gap: '15px', padding: '10px', border: stage === idx ? '1px solid var(--primary)' : 'none' }}>
                    <s.icon size={14} color={stage > idx ? '#00ff88' : 'white'} />
                    <span style={{ fontSize: '0.6rem', fontWeight: '800' }}>{s.title}</span>
                </div>
            ))}
         </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
          <AnimatePresence mode="wait">
            {stage === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
                    <Fingerprint size={100} color="var(--primary)" />
                    <button className="btn-initialize" style={{ marginTop: '30px' }} onClick={simulateStep}>AUTHENTICATE_BIOMETRIC</button>
                </motion.div>
            ) : (
                <div style={{ color: 'white' }}>STAGE_{stage}_ACTIVE</div>
            )}
          </AnimatePresence>
      </div>
    </div>
  );
}
