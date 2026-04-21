import React, { useState } from 'react';
import data from '../data/electionData.json';

export default function LexIntelligence() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConstituency, setSelectedConstituency] = useState(null);

  const searchResults = data.constituencies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px 0' }}>
      <div className="glass-container" style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px', color: 'var(--primary)' }}>INTELLIGENCE ENGINE</h2>
        <div style={{ display: 'flex', gap: '20px' }}>
          <input 
            type="text" 
            placeholder="Explore Constituencies (e.g. Mumbai, Delhi)..." 
            className="glass-container"
            style={{ flex: 1, padding: '15px', background: 'rgba(255,255,255,0.02)', outline: 'none', border: '1px solid var(--glass-border)', color: 'white' }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Left: List */}
        <div className="glass-container" style={{ maxHeight: '600px', overflowY: 'auto' }}>
          <h4 style={{ marginBottom: '20px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>SEARCH RESULTS</h4>
          {searchResults.map(c => (
            <div 
              key={c.id} 
              onClick={() => setSelectedConstituency(c)}
              style={{ 
                padding: '15px', 
                borderBottom: '1px solid var(--glass-border)', 
                cursor: 'pointer',
                background: selectedConstituency?.id === c.id ? 'rgba(0, 242, 255, 0.05)' : 'transparent',
                borderRadius: '8px'
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{c.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--primary)' }}>ID: {c.id} • Voters: {c.voterCount.toLocaleString()}</div>
            </div>
          ))}
        </div>

        {/* Right: Detail View */}
        <div className="glass-container">
          {selectedConstituency ? (
            <div className="fade-in">
               <h3 style={{ marginBottom: '10px' }}>{selectedConstituency.name} Profile</h3>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>TURNOUT</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{selectedConstituency.lastTurnout}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>CANDIDATES</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{selectedConstituency.candidates.length}</div>
                  </div>
               </div>

               <h4 style={{ marginBottom: '15px', fontSize: '0.9rem' }}>CANDIDATE ANALYSIS</h4>
               {selectedConstituency.candidates.map(cand => (
                 <div key={cand.name} style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '12px', border: '1px solid var(--glass-border)', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 'bold' }}>{cand.name}</span>
                        <span style={{ color: 'var(--primary)', fontSize: '0.8rem' }}>{cand.party}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', marginTop: '8px', color: 'var(--text-dim)' }}>
                        Education: {cand.education} • Criminal Cases: {cand.cases}
                    </div>
                 </div>
               ))}
            </div>
          ) : (
            <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-dim)' }}>
               Select a constituency to view deep-analytics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
