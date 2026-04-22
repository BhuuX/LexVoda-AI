/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, User, MapPin, Database, BarChart3, Users, ShieldCheck, Activity } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export default function LexIntelligence() {
  const { constituencies } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState(constituencies[1]); // Default to Mumbai North

  const filteredNodes = constituencies.filter(node => 
    node.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    node.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in space-y-8" role="main" aria-label="LexIntelligence Core Dashboard">
      {/* ─── INTELLIGENCE SEARCH ─── */}
      <div className="glass-card" style={{ padding: '20px 40px', display: 'flex', alignItems: 'center', gap: '20px' }} role="search">
        <Search size={20} color="var(--primary)" aria-hidden="true" />
        <input 
          type="text" 
          placeholder="Search by Constituency, State, or ID (e.g. KERALA, VARANASI, KL-04)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search constituencies"
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: 'white', 
            width: '100%', 
            fontSize: '1rem', 
            outline: 'none',
            fontFamily: 'inherit'
          }}
        />
        <div style={{ fontSize: '0.7rem', fontWeight: '800', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '4px', letterSpacing: '1px' }}>
          {filteredNodes.length} NODES FOUND
        </div>
      </div>

      <div className="intel-layout">
        
        {/* ─── NODE DIRECTORY ─── */}
        <div className="glass-card" style={{ padding: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '25px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <span style={{ fontSize: '0.8rem', fontWeight: '800', letterSpacing: '1px' }}>INTEL_DIRECTORY</span>
             <Activity size={14} color="var(--primary)" />
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }} className="space-y-4">
            {filteredNodes.map(node => (
              <button 
                key={node.id}
                onClick={() => setSelectedNode(node)}
                style={{
                  width: '100%',
                  padding: '20px',
                  background: selectedNode?.id === node.id ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${selectedNode?.id === node.id ? 'var(--primary)' : 'transparent'}`,
                  borderRadius: '10px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'white', marginBottom: '4px' }}>{node.name}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    {node.id} • <span style={{ color: 'var(--primary)' }}>{node.state}</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.6rem', fontWeight: '800', opacity: 0.5 }}>{node.turnout}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ─── INTELLIGENCE VIEWPORT ─── */}
        {selectedNode && (
          <div className="space-y-8 intel-viewport" style={{ overflowY: 'auto', paddingRight: '10px' }}>
            <div className="glass-card" style={{ padding: '40px', position: 'relative' }}>
              <div className="booth-stability" style={{ position: 'absolute', top: '30px', right: '40px', textAlign: 'right' }}>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: '800', marginBottom: '5px' }}>BOOTH_STABILITY</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--primary)' }}>98.8%</div>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '2px', marginBottom: '10px' }}>CONSTITUENCY_PROFILE</div>
                <h3 style={{ fontSize: '3.5rem', fontWeight: '900', color: 'white', letterSpacing: '-1px' }} className="const-title">{selectedNode.name}</h3>
              </div>

              <div className="badge-cluster" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                    <MapPin size={14} color="var(--primary)" />
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>{selectedNode.coords}</span>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                    <Database size={14} color="var(--primary)" />
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>SECTOR: {selectedNode.state}</span>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(16,185,129,0.05)', padding: '8px 16px', borderRadius: '6px', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <ShieldCheck size={14} color="var(--primary)" />
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)' }}>STATION_READY</span>
                 </div>
              </div>

              <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', marginTop: '50px' }}>
                <div>
                   <div style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      TOTAL_ELECTORS <Users size={12} />
                   </div>
                   <div style={{ fontSize: '2.2rem', fontWeight: '900' }}>{selectedNode.electors}</div>
                </div>
                <div>
                   <div style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      POLLING_UNITS <Database size={12} />
                   </div>
                   <div style={{ fontSize: '2.2rem', fontWeight: '900' }}>{selectedNode.units}</div>
                </div>
                <div>
                   <div style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      HISTORICAL_TURNOUT <BarChart3 size={12} />
                   </div>
                   <div style={{ fontSize: '2.2rem', fontWeight: '900' }}>{selectedNode.turnout}</div>
                </div>
              </div>
            </div>

            <div className="intel-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <div className="glass-card" style={{ padding: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
                  <Activity size={16} color="var(--primary)" />
                  <span style={{ fontSize: '0.8rem', fontWeight: '800' }}>DEMOGRAPHIC_INTELLIGENCE</span>
                </div>
                <div className="space-y-6">
                  {[
                    { label: 'YOUTH_DENSITY (18-25)', val: '28%', p: 28 },
                    { label: 'LITERACY_INDEX', val: '89.2%', p: 89.2 },
                    { label: 'GENDER_RATIO (PER_1000)', val: '894', p: 89.4 }
                  ].map((item, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: '700', marginBottom: '10px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                        <span>{item.val}</span>
                      </div>
                      <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${item.p}%` }} style={{ height: '100%', background: 'var(--primary)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card" style={{ padding: '30px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
                  <User size={16} color="var(--primary)" />
                  <span style={{ fontSize: '0.8rem', fontWeight: '800' }}>CANDIDATE_FIELD</span>
                </div>
                <div className="space-y-4">
                  {[
                    { name: 'CANDIDATE_SEC_X', info: 'CASES: 2 • ENGINEER', alliance: 'REGIONAL_ALLIANCE' },
                    { name: 'CANDIDATE_SEC_Y', info: 'CASES: 0 • MBA', alliance: 'NATIONAL_CONSENSUS' }
                  ].map((c, i) => (
                    <div key={i} style={{ padding: '15px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div>
                         <div style={{ fontSize: '0.85rem', fontWeight: '800' }}>{c.name}</div>
                         <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: '700', marginTop: '4px' }}>{c.info}</div>
                       </div>
                       <div style={{ fontSize: '0.6rem', color: 'var(--primary)', fontWeight: '800' }}>{c.alliance}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
