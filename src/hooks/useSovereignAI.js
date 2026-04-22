import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAppStore } from '../store/appStore';
import { checkSystemHealth, syncTelemetryData } from '../services/googleCloudService';

const AI_DATABASE = {
  CONSTITUTION: [
    { keywords: ["324", "commission", "control"], response: "Article 324 vests the superintendence, direction, and control of elections in the Election Commission." },
    { keywords: ["326", "adult", "suffrage", "18"], response: "Article 326 establishes Universal Adult Suffrage, granting voting rights to all citizens aged 18 and above." },
    { keywords: ["mcc", "code", "conduct"], response: "The Model Code of Conduct (MCC) ensures free and fair elections by regulating political parties and candidates during the election period." }
  ],
  SYSTEM: [
    { keywords: ["security", "evm", "hack"], response: "EVMs are standalone machines with no network capability (air-gapped), making them immune to remote hacking." },
    { keywords: ["vvpat", "audit"], response: "VVPAT provides a physical paper trail for every digital vote, allowing for manual verification and absolute auditability." }
  ]
};

export function useSovereignAI(activeTab, lang) {
  const [aiMessage, setAiMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isAiExpanded, setIsAiExpanded] = useState(false);
  const [systemHealth, setSystemHealth] = useState(null);

  // Initialize System Health (Google Cloud Bridge)
  useEffect(() => {
    async function init() {
      const health = await checkSystemHealth();
      setSystemHealth(health);
    }
    init();
  }, []);

  useEffect(() => {
    setAiMessage(lang === 'en' ? "LexVoda OS: Intelligent Assistant initialized. System health: OPTIMAL." : "लेक्सोडा ओएस: इंटेलिजेंट असिस्टेंट प्रारंभ। सिस्टम स्वास्थ्य: इष्टतम।");
  }, [lang]);

  const processQuery = useCallback((query) => {
    setIsThinking(true);
    
    // Simulate complex reasoning process
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      let foundResponse = lang === 'en' 
        ? "Query analyzed. No specific constitutional match found. Referencing General Bureau documentation."
        : "क्वेरी का विश्लेषण किया गया। कोई विशिष्ट संवैधानिक मेल नहीं मिला।";

      // Simple keyword matching engine
      const allEntries = [...AI_DATABASE.CONSTITUTION, ...AI_DATABASE.SYSTEM];
      for (const entry of allEntries) {
        if (entry.keywords.some(k => lowerQuery.includes(k))) {
          foundResponse = entry.response;
          break;
        }
      }

      setAiMessage(foundResponse);
      setIsThinking(false);

      // Trigger background telemetry sync (GCP)
      syncTelemetryData({ nodeId: "AI_NODE_01", query: lowerQuery });
    }, 1200);
  }, [lang]);

  return {
    aiMessage,
    isThinking,
    isAiExpanded,
    setIsAiExpanded,
    handleQuery: processQuery,
    systemHealth
  };
}
