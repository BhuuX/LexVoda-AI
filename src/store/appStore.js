import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export const useAppStore = create(
  devtools((set) => ({
    lang: 'en',
    activeTab: 0,
    systemStatus: 'OPTIMAL',
    logs: ['[SYS] INITIALIZING_CORE...', '[SYS] HANDSHAKE_SUCCESS', '[SEC] ENCRYPTION_ACTIVE'],
    
    setLang: (lang) => set({ lang }),
    setActiveTab: (idx) => set((state) => ({ 
        activeTab: idx,
        logs: [`[USR] NAVIGATING_TO_NODE_${idx}`, ...state.logs].slice(0, 5)
    })),
    addLog: (log) => set((state) => ({ 
        logs: [`[SYS] ${log}`, ...state.logs].slice(0, 5) 
    })),
  }))
)
