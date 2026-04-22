import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export const useAppStore = create(
  devtools((set) => ({
    lang: 'en',
    activeTab: 0,
    systemStatus: 'OPTIMAL',
    isAiExpanded: false,
    setIsAiExpanded: (val) => set({ isAiExpanded: val }),
    logs: ['[SYS] INITIALIZING_CORE...', '[SYS] HANDSHAKE_SUCCESS', '[SEC] ENCRYPTION_ACTIVE'],
    
    // --- Electoral Data ---
    constituencies: [
      { id: 'DL-01', name: 'CHANDNI_CHOWK', state: 'DELHI', electors: '1,562,817', units: 1540, turnout: '62.7%', coords: '28.66° N / 77.22° E' },
      { id: 'MH-26', name: 'MUMBAI_NORTH', state: 'MAHARASHTRA', electors: '1,627,000', units: 1680, turnout: '60.1%', coords: '19.22° N / 72.85° E' },
      { id: 'KA-25', name: 'BANGALORE_CENTRAL', state: 'KARNATAKA', electors: '2,100,000', units: 2150, turnout: '54.3%', coords: '12.97° N / 77.59° E' },
      { id: 'UP-37', name: 'VARANASI', state: 'UTTAR_PRADESH', electors: '1,890,200', units: 1920, turnout: '68.2%', coords: '25.31° N / 82.97° E' },
      { id: 'WB-21', name: 'KOLKATA_UTTAR', state: 'WEST_BENGAL', electors: '1,450,000', units: 1480, turnout: '71.5%', coords: '22.57° N / 88.36° E' },
      { id: 'TN-02', name: 'CHENNAI_CENTRAL', state: 'TAMIL_NADU', electors: '1,320,000', units: 1350, turnout: '58.9%', coords: '13.08° N / 80.27° E' },
      { id: 'KL-04', name: 'WAYANAD', state: 'KERALA', electors: '1,350,000', units: 1380, turnout: '80.3%', coords: '11.68° N / 76.13° E' },
      { id: 'GJ-07', name: 'GANDHINAGAR', state: 'GUJARAT', electors: '1,920,000', units: 1980, turnout: '65.4%', coords: '23.21° N / 72.63° E' }
    ],
    voteCounts: {}, // Format: { constituencyId: { candidateId: count } }

    setLang: (lang) => set({ lang }),
    setActiveTab: (idx) => set((state) => ({ 
        activeTab: idx,
        logs: [`[USR] NAVIGATING_TO_NODE_${idx}`, ...state.logs].slice(0, 5)
    })),
    addLog: (log) => set((state) => ({ 
        logs: [`[SYS] ${log}`, ...state.logs].slice(0, 5) 
    })),
    registerVote: (constituencyId, candidateId) => set((state) => {
        const currentConstVotes = state.voteCounts[constituencyId] || {};
        return {
            voteCounts: {
                ...state.voteCounts,
                [constituencyId]: {
                    ...currentConstVotes,
                    [candidateId]: (currentConstVotes[candidateId] || 0) + 1
                }
            },
            logs: [`[VOTE] BALLOT_CAST_IN_${constituencyId}`, ...state.logs].slice(0, 5)
        };
    })
  }))
)
