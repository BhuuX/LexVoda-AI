/**
 * @file intelligence.test.js
 * @description Unit tests for LexIntelligence core logic.
 */

import { describe, it, expect } from 'vitest';

// Simulating the logic from LexIntelligence for testing
const filterConstituencies = (data, search) => {
    return data.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase()) || 
        c.id.toLowerCase().includes(search.toLowerCase())
    );
};

describe('Constituency Intelligence Logic', () => {
    const mockData = [
        { id: 'DL-01', name: 'DELHI_CENTRAL' },
        { id: 'MH-02', name: 'MUMBAI_SOUTH' }
    ];

    it('should correctly filter constituencies by name', () => {
        const result = filterConstituencies(mockData, 'delhi');
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('DL-01');
    });

    it('should correctly filter constituencies by ID', () => {
        const result = filterConstituencies(mockData, 'MH');
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('MUMBAI_SOUTH');
    });

    it('should return empty array for non-existent queries', () => {
        const result = filterConstituencies(mockData, 'XYZ');
        expect(result).toHaveLength(0);
    });
});
