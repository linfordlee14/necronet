/**
 * Vitest Test Setup
 * Global test configuration and mocks
 */

import { vi } from 'vitest';

// Mock fetch globally
global.fetch = vi.fn();

// Mock XMLHttpRequest for upload tests
global.XMLHttpRequest = vi.fn().mockImplementation(() => ({
  open: vi.fn(),
  send: vi.fn(),
  setRequestHeader: vi.fn(),
  upload: {
    addEventListener: vi.fn(),
  },
  addEventListener: vi.fn(),
  timeout: 0,
})) as unknown as typeof XMLHttpRequest;

// Reset mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
});
