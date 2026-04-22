import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, BarChart2, CheckCircle, Hash } from 'lucide-react';
import { electionService } from '../../services/dataService';

export default function IntelEngine() {
  const [searchTerm, setSearchTerm] = useState('');
  const [constituencies, setConstituencies] = useState([]);
  const [selectedID, setSelectedID] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await electionService.getConstituencies();
      setConstituencies(data);
      setSelectedID(data[0].id);
      setIsLoading(false);
    }
    load();
  }, []);

  const searchResults = constituencies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeData = constituencies.find(c => c.id === selectedID);

  if (isLoading) return <div style={{ color: 'var(--primary)', letterSpacing: '4px', fontSize: '0.6rem' }}>SYNCHRONIZING_DATA_STREAM...</div>;

  return (
    <div className="space-y-8">
      <div className="glass-card" style={{ padding: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Search size={18} color="var(--primary)" />
            <input 
                type="text" 
                placeholder="PROBE_CONSTITUENCY_DB..." 
                style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', fontFamily: 'JetBrains Mono', outline: 'none', fontSize: '0.8rem', letterSpacing: '2px' }}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '40px', height: '600px' }}>
        <div className="glass-card" style={{ padding: '25px', overflowY: 'auto' }}>
          <div className="space-y-4">
            {searchResults.map(c => (
              <div 
                key={c.id} 
                onClick={() => setSelectedID(c.id)}
                style={{ 
                  padding: '20px', 
                  background: selectedID === c.id ? 'rgba(0, 242, 255, 0.05)' : 'rgba(255,255,255,0.01)', 
                  border: `1px solid ${selectedID === c.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)'}`, 
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontWeight: '900', fontSize: '0.9rem' }}>{c.name}</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--primary)' }}>{c.voterCount.toLocaleString()} TOTAL_ELECTORS</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '40px' }}>
            {activeData && (
                <AnimatePresence mode="wait">
                    <motion.div key={activeData.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div style={{ marginBottom: '50px' }}>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: '900' }}>{activeData.name}</h2>
                            <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                                <Badge label={`${activeData.coordinates.lat} N, ${activeData.coordinates.long} E`} />
                                <Badge label={`SECTOR_${activeData.state}`} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '50px' }}>
                            <MetricCard label="TOTAL_ELECTORS" val={activeData.voterCount.toLocaleString()} sub="Voters" />
                            <MetricCard label="POLLING_STATIONS" val={activeData.pollingStations} sub="Units" />
                            <MetricCard label="LAST_TURNOUT" val={activeData.lastTurnout} sub="2019" />
                        </div>

                        <div style={{ gridTemplateColumns: '1fr 1fr', display: 'grid', gap: '40px' }}>
                            <TelemetryBar label="YOUTH_DENSITY" val={activeData.metrics.youth_density} />
                            <TelemetryBar label="LITERACY_RATE" val={activeData.metrics.literacy_rate} />
                        </div>
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
      </div>
    </div>
  );
}

// Sub-components as per Feature Architecture
function Badge({ label }) {
    return <div style={{ background: 'rgba(255,255,255,0.03)', padding: '6px 12px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{label}</div>;
}

function MetricCard({ label, val, sub }) {
    return (
        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '25px' }}>
            <div style={{ fontSize: '0.45rem', color: 'var(--primary)', fontWeight: '900', letterSpacing: '2px', marginBottom: '10px' }}>{label}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '900' }}>{val}</div>
            <div style={{ fontSize: '0.4rem', opacity: 0.3 }}>UNIT: {sub}</div>
        </div>
    );
}

function TelemetryBar({ label, val }) {
    const width = parseFloat(val);
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.55rem', fontWeight: '800', opacity: 0.6 }}><span>{label}</span><span>{val}</span></div>
            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.03)' }}>
                <div style={{ height: '100%', background: 'var(--primary)', width: `${width}%` }} />
            </div>
        </div>
    );
}
