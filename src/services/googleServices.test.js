import { describe, it, expect, vi } from 'vitest';
import { GCloud } from './googleServices';

// Mock Firebase & Gemini
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(),
  getApps: () => [],
  getApp: vi.fn()
}));
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn()
}));
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn()
}));
vi.mock('firebase/storage', () => ({
  getStorage: vi.fn()
}));
vi.mock('firebase/functions', () => ({
  getFunctions: vi.fn()
}));
vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(),
  logEvent: vi.fn()
}));
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
      getGenerativeModel: vi.fn().mockReturnValue({
        generateContent: vi.fn().mockResolvedValue({
          response: { text: () => 'Mock AI Insight' }
        })
      })
    }))
  };
});

describe('Google Services Integration Architecture', () => {
  it('initializes the GCloud Singleton correctly', () => {
    expect(GCloud).toBeDefined();
    expect(GCloud.db).toBeDefined();
    expect(GCloud.auth).toBeDefined();
    expect(GCloud.gemini).toBeDefined();
  });

  it('exposes the neural engine via generateLegalInsight', async () => {
    expect(typeof GCloud.generateLegalInsight).toBe('function');
    
    // Test the mock AI engine response to ensure pipeline integrity
    const response = await GCloud.generateLegalInsight('Test Query');
    expect(response).toBe('Mock AI Insight');
  });

  it('has telemetry logging built-in', () => {
    expect(typeof GCloud.logTelemetry).toBe('function');
  });
});
