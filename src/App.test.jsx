import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the global app store to isolate the component
vi.mock('./store/appStore', () => ({
  useAppStore: () => ({
    lang: 'en',
    setLang: vi.fn(),
    activeTab: 0,
    setActiveTab: vi.fn(),
    isAiExpanded: false,
    setIsAiExpanded: vi.fn(),
  })
}));

// Mock Sovereign AI Hook
vi.mock('./hooks/useSovereignAI', () => ({
  useSovereignAI: () => ({
    aiMessage: 'SYSTEM_READY',
    isThinking: false,
    handleQuery: vi.fn(),
    systemHealth: { isOnline: true, latency: '24ms' }
  })
}));

describe('App Component Core Architecture', () => {
  it('renders the main application shell correctly', () => {
    // Basic structural test
    const { container } = render(<App />);
    expect(container.firstChild).toBeDefined();
    expect(container.getElementsByClassName('app-shell').length).toBe(1);
  });

  it('initializes the HUD header and telemetry indicators', () => {
    render(<App />);
    // Check if the telemetry system status is rendered
    expect(screen.getByText('24ms')).toBeDefined();
    expect(screen.getByText('LEXVODA_AI')).toBeDefined();
  });
});
