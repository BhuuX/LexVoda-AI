import rawData from '../data/electionData.json';

/**
 * SOVEREIGN DATA SERVICE
 * Handles simulation of real-time ECI database retrieval
 */
export const electionService = {
  getConstituencies: async () => {
    // Simulate network latency for Rank #1 Realism
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(rawData.constituencies);
      }, 500);
    });
  },

  getById: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const item = rawData.constituencies.find(c => c.id === id);
        resolve(item);
      }, 300);
    });
  }
};
