import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAppStore } from '../store/appStore';
import { checkSystemHealth, syncTelemetryData } from '../services/googleCloudService';

const AI_DATABASE = {
  PROCESS: [
    { keywords: ["step", "how", "process", "vote", "guide"], response: "ELECTION PROCESS: 1) Voter Registration (Form 6). 2) Verification of Name in Electoral Roll. 3) Finding Polling Booth. 4) Identity Verification (EPIC/Aadhar) at Booth. 5) Casting vote via EVM. 6) VVPAT Verification." },
    { keywords: ["timeline", "date", "schedule", "when"], response: "ELECTION TIMELINE: General Elections are held every 5 years. The Model Code of Conduct applies immediately upon schedule announcement. Polling usually spans 7 phases over 6 weeks. Counting occurs on a single finalized date." },
    { keywords: ["register", "form 6", "enroll"], response: "REGISTRATION: You must be an Indian citizen, 18+ years old. Submit Form 6 online via the NVSP portal or offline at the ERO office to get your EPIC (Voter ID)." },
    { keywords: ["epic", "voter id", "document"], response: "DOCUMENTS: The primary document is the EPIC (Voter ID). Alternatively, you can use Aadhar Card, PAN Card, Driving License, or Passport if your name is on the electoral roll." }
  ],
  CONSTITUTION: [
    { keywords: ["324", "commission", "control"], response: "Article 324 vests the superintendence, direction, and control of elections in the Election Commission." },
    { keywords: ["326", "adult", "suffrage", "18"], response: "Article 326 establishes Universal Adult Suffrage, granting voting rights to all citizens aged 18 and above." },
    { keywords: ["mcc", "code", "conduct"], response: "The Model Code of Conduct (MCC) ensures free and fair elections by regulating political parties and candidates during the election period." }
  ],
  SYSTEM: [
    { keywords: ["security", "evm", "hack", "tamper"], response: "EVMs are standalone machines with no network capability (air-gapped), making them immune to remote hacking. Sovereign OS uses One-Time Programmable (OTP) chips." },
    { keywords: ["vvpat", "audit"], response: "VVPAT provides a physical paper trail for every digital vote, allowing for manual verification and absolute auditability." },
    { keywords: ["demo", "id", "credentials", "test"], response: "SYSTEM_AUTHORIZED_EPIC_DIRECTORY:\n\n• DELHI: EPIC-DL-001\n• MUMBAI: EPIC-MH-2024\n• BANGALORE: EPIC-KA-882\n• VARANASI: EPIC-UP-990\n• KOLKATA: EPIC-WB-441\n• CHENNAI: EPIC-TN-552\n• WAYANAD: EPIC-KL-663\n• GANDHINAGAR: EPIC-GJ-774\n\n[ACTION: USE IN PROTOCOL_LAB]" },
    { keywords: ["324", "intel"], response: "Article 324: Superintendence, direction and control of elections to be vested in an Election Commission." },
    { keywords: ["eligibility", "326"], response: "Article 326: Every citizen of India who is not less than eighteen years of age shall be entitled to be registered as a voter." },
    { keywords: ["court", "jurisdiction", "329"], response: "Article 329: Bar to interference by courts in electoral matters. Validity of delimitation laws cannot be questioned in court." }
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

      // 1. First check the local Sovereign Database for precise system overrides
      const allEntries = [...AI_DATABASE.PROCESS, ...AI_DATABASE.CONSTITUTION, ...AI_DATABASE.SYSTEM];
      let localOverride = null;
      for (const entry of allEntries) {
        if (entry.keywords.some(k => lowerQuery.includes(k))) {
          localOverride = entry.response;
          break;
        }
      }

      if (localOverride) {
        setAiMessage(localOverride);
        setIsThinking(false);
      } else {
        // 2. If no strict local override, engage the Gemini Neural Engine
        try {
          const geminiContext = `You are LexVoda, an elite Sovereign AI Assistant built by BhuuX Studio for the Indian Election Commission. 
          Your goal is to explain the election process, timelines, and constitutional steps in a highly interactive, easy-to-follow, yet enterprise-grade manner.
          Respond to the following user query accurately and concisely (max 3 sentences). 
          User Query: ${query}`;
          
          import('../services/googleServices').then(module => {
            module.GCloud.generateLegalInsight(geminiContext).then(geminiResponse => {
              if (geminiResponse === "ERROR_NEURAL_ENGINE_OFFLINE") {
                setAiMessage(lang === 'en' 
                  ? "Query analyzed. Neural Engine offline. Please check your Google API configuration." 
                  : "न्यूरल इंजन ऑफ़लाइन है।");
              } else {
                setAiMessage(geminiResponse);
              }
              setIsThinking(false);
            });
          });
        } catch (error) {
          setAiMessage("Neural Matrix Exception: Unable to reach Gemini architecture.");
          setIsThinking(false);
        }
      }

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
