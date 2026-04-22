import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EVMLab from './EVMLab';

// Mock the global store
const mockUseAppStore = vi.fn();
vi.mock('../store/appStore', () => ({
  useAppStore: () => mockUseAppStore()
}));

describe('EVMLab Protocol Testing', () => {
  beforeEach(() => {
    mockUseAppStore.mockReturnValue({
      constituencies: [
        { id: 'dl', name: 'CHANDNI_CHOWK', code: 'DL-01', voters: 1.6, turnout: 62.4, status: 'ACTIVE' }
      ],
      registerVote: vi.fn(),
      setIsAiExpanded: vi.fn()
    });
  });

  it('renders constituency selection initially', () => {
    const { container } = render(<EVMLab />);
    expect(screen.getByText('CONSTITUENCY_SELECT')).toBeDefined();
    // Use role or text to verify structure
    expect(screen.getByText('CHANDNI_CHOWK')).toBeDefined();
  });

  it('handles FAILURE PATH: Invalid EPIC ID lockout mechanism', async () => {
    render(<EVMLab />);
    
    // Select constituency to move to Stage 1
    fireEvent.click(screen.getByText('CHANDNI_CHOWK'));
    fireEvent.click(screen.getByText('INITIALIZE_STATION'));

    // Wait for Stage 1 to mount
    await waitFor(() => {
      expect(screen.getByPlaceholderText('ENTER EPIC ID (e.g. EPIC-MH-2024)')).toBeDefined();
    });

    // Enter invalid credential
    const input = screen.getByPlaceholderText('ENTER EPIC ID (e.g. EPIC-MH-2024)');
    fireEvent.change(input, { target: { value: 'INVALID-ID' } });
    
    const verifyBtn = screen.getByText('VERIFY_CREDENTIALS');
    fireEvent.click(verifyBtn);

    // After first failure, it should show warning
    await waitFor(() => {
      expect(screen.getByText('SECURITY_WARNING: INVALID CREDENTIALS')).toBeDefined();
    });

    // Enter second invalid credential to test failure path (Two-Strike Lockout)
    fireEvent.change(input, { target: { value: 'HACK-ATTEMPT' } });
    fireEvent.click(verifyBtn);

    // Verify hard lockout triggered
    await waitFor(() => {
      expect(screen.getByText('SYSTEM_LOCKED')).toBeDefined();
    });
  });

  it('handles SUCCESS PATH: Valid EPIC ID routing', async () => {
    render(<EVMLab />);
    
    // Select constituency
    fireEvent.click(screen.getByText('CHANDNI_CHOWK'));
    fireEvent.click(screen.getByText('INITIALIZE_STATION'));

    // Enter valid Demo ID
    const input = screen.getByPlaceholderText('ENTER EPIC ID (e.g. EPIC-MH-2024)');
    fireEvent.change(input, { target: { value: 'EPIC-DL-001' } });
    fireEvent.click(screen.getByText('VERIFY_CREDENTIALS'));

    // Verify proceeds to signature stage
    await waitFor(() => {
      expect(screen.getByText('PROCEED_TO_INKING')).toBeDefined();
    });
  });
});
