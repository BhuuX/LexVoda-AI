/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Activity, Cloud, Globe, ShieldCheck } from 'lucide-react';
import { checkSystemHealth } from '../services/googleCloudService';

export default function SystemHealth() {
    const [health, setHealth] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHealth = async () => {
            const data = await checkSystemHealth();
            setHealth(data);
            setLoading(false);
        };
        fetchHealth();
        const interval = setInterval(fetchHealth, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div style={{ fontSize: '0.5rem', opacity: 0.5 }}>POLLING_GCP_SERVICES...</div>;

    return (
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <HealthIndicator label="REGION" val={health.region} icon={Globe} />
            <HealthIndicator label="LATENCY" val={health.latency} icon={Activity} />
            <HealthIndicator label="SERVICE" val="CLOUD_RUN" icon={Cloud} color="#4285F4" />
            <HealthIndicator label="AUTH" val="HSM_SECURE" icon={ShieldCheck} color="#00ff88" />
        </div>
    );
}

function HealthIndicator({ label, val, icon: Icon, color = "var(--primary)" }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.02)', padding: '5px 12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Icon size={12} color={color} />
            <div>
                <div style={{ fontSize: '0.4rem', opacity: 0.4, fontWeight: '900' }}>{label}</div>
                <div style={{ fontSize: '0.55rem', fontWeight: '900', color: color === "var(--primary)" ? "white" : color }}>{val}</div>
            </div>
        </div>
    );
}
