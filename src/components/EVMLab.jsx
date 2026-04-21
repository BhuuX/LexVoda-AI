import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, PenTool, ClipboardCheck, PlayCircle, Printer, RefreshCcw } from 'lucide-react';
import { cn } from '../utils/cn';

const STAGES = [
  { id: 0, title: 'IDENTITY CHECK', officer: 'OFFICER_P1', icon: UserCheck },
  { id: 1, title: 'INKING & REGISTER', officer: 'OFFICER_P2', icon: PenTool },
  { id: 2, title: 'SLIP ISSUANCE', officer: 'OFFICER_P3', icon: ClipboardCheck },
  { id: 3, title: 'BALLOT EXECUTION', officer: 'HARDWARE_BU', icon: PlayCircle },
  { id: 4, title: 'VVPAT AUDIT', officer: 'HARDWARE_VVPAT', icon: Printer }
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

  const simulateStep = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStage(s => s + 1);
    }, 1000);
  };

  const handleVote = (candidate) => {
    setVotedFor(candidate);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStage(4);
    }, 1500);
  };

  const resetSimulation = () => {
    setStage(0);
    setVotedFor(null);
    setIsProcessing(false);
  };

  const currentCandidate = votedFor || CANDIDATES[0];

  return (
    <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '60px', padding: '60px', minHeight: '600px' }}>
      
      {/* Protocol Sidebar */}
      <div style={{ borderRight: '1px solid rgba(255,255,255,0.05)', paddingRight: '40px' }}>
        <h3 style={{ fontSize: '0.7rem', color: 'var(--primary)', letterSpacing: '4px', marginBottom: '40px', fontWeight: '900' }}>PROTOCOL_ENGINE</h3>
        <div className="space-y-4">
          {STAGES.map((s, idx) => {
            const Icon = s.icon;
            const isActive = stage === idx;
            const isCompleted = stage > idx;
            return (
              <div key={s.id} style={{ 
                padding: '20px', 
                background: isActive ? 'rgba(0, 242, 255, 0.05)' : 'transparent',
                border: `1px solid ${isActive ? 'var(--primary)' : isCompleted ? 'rgba(0,255,136,0.2)' : 'transparent'}`,
                marginBottom: '15px',
                opacity: stage >= idx ? 1 : 0.2,
                transition: 'all 0.4s',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <Icon size={16} color={isCompleted ? '#00ff88' : isActive ? 'var(--primary)' : '#fff'} />
                <div>
                   <div style={{ fontSize: '0.45rem', opacity: 0.4, fontWeight: 'bold' }}>{s.officer}</div>
                   <div style={{ fontSize: '0.7rem', fontWeight: '800', letterSpacing: '1px', color: isCompleted ? '#00ff88' : '#fff' }}>{s.title}</div>
                </div>
              </div>
            );
          })}
        </div>
        <button 
            onClick={resetSimulation}
            style={{ width: '100%', marginTop: '30px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '15px', fontSize: '0.6rem', fontWeight: '900', letterSpacing: '2px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
        >
            <RefreshCcw size={12} /> RE-INITIALIZE_CORE
        </button>
      </div>

      {/* Interactive Execution Zone */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          <AnimatePresence mode="wait">
            {isProcessing ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="loader" style={{ textAlign: 'center' }}>
                    <div className="animate-spin" style={{ width: '40px', height: '40px', border: '2px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 20px' }} />
                    <div style={{ fontSize: '0.6rem', color: 'var(--primary)', fontWeight: '900', letterSpacing: '5px' }}>SYNCING_HARDWARE...</div>
                </motion.div>
            ) : stage < 3 ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} key="verify" style={{ textAlign: 'center' }}>
                   <div style={{ width: '120px', height: '120px', background: 'rgba(255,255,255,0.02)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '40px', border: '1px solid var(--primary)', boxShadow: '0 0 30px rgba(0,242,255,0.1)' }}>
                      <PlayCircle size={40} color="var(--primary)" />
                   </div>
                   <button className="btn-initialize" onClick={simulateStep}>
                     EXECUTE_{STAGES[stage].title}
                   </button>
                </motion.div>
            ) : stage === 3 ? (
                <motion.div initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} key="ballot" style={{ width: '100%', maxWidth: '450px' }}>
                    <div style={{ background: '#000', padding: '20px', border: '1px solid #222', borderRadius: '4px', marginBottom: '20px' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '15px' }}>
                            <div style={{ fontSize: '0.7rem', color: '#00ff88', fontWeight: '900', letterSpacing: '2px' }}>BALLOT_UNIT [STATUS:READY]</div>
                            <div style={{ width: '10px', height: '10px', background: '#00ff88', borderRadius: '50%', boxShadow: '0 0 10px #00ff88' }} />
                         </div>
                         {CANDIDATES.map(c => (
                            <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '20px', border: '1px solid #333', marginBottom: '12px', borderRadius: '2px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <span style={{ fontSize: '1.2rem' }}>{c.symbol}</span>
                                    <div style={{ fontWeight: '800', fontSize: '0.9rem', letterSpacing: '1px' }}>{c.name}</div>
                                </div>
                                <motion.div 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleVote(c)}
                                    style={{ width: '60px', height: '40px', background: '#4d4dff', borderRadius: '4px', cursor: 'pointer', borderBottom: '4px solid #000066', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                >
                                    <div style={{ width: '8px', height: '8px', background: 'rgba(255,255,255,0.3)', borderRadius: '50%' }} />
                                </motion.div>
                            </div>
                         ))}
                    </div>
                </motion.div>
            ) : (
                <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} key="vvpat" style={{ textAlign: 'center' }}>
                    <motion.div 
                        initial={{ height: 0 }} animate={{ height: 320 }}
                        style={{ width: '220px', background: '#fff', padding: '30px', margin: '0 auto', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}
                    >
                        <div style={{ color: '#000', fontFamily: 'monospace', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.5rem', borderBottom: '1px dashed #ddd', paddingBottom: '10px', marginBottom: '20px' }}>ECI_VVPAT_SECURE_SLIP</div>
                            <div style={{ fontSize: '0.65rem', fontWeight: 'bold', marginBottom: '5px' }}>SELECTED_ID: {currentCandidate.id.toString().padStart(2, '0')}</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '900', marginBottom: '15px' }}>{currentCandidate.name}</div>
                            <div style={{ fontSize: '3rem', margin: '15px 0' }}>{currentCandidate.symbol}</div>
                            <div style={{ marginTop: '25px', fontSize: '0.45rem', opacity: 0.5 }}>NODE_SYNC_SUCCESS // VALID_VOTE</div>
                        </div>
                    </motion.div>
                    <div style={{ marginTop: '40px', color: '#00ff88', fontWeight: '900', letterSpacing: '8px', fontSize: '0.9rem' }}>BEEP! SUCCESS</div>
                    <div style={{ fontSize: '0.6rem', opacity: 0.4, marginTop: '10px' }}>ELECTION_DATABASE_UPDATED</div>
                </motion.div>
            )}
          </AnimatePresence>
      </div>
    </div>
  );
}
