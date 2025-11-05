
import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Automatically clean up after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia which is required for some component tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Provide a safe default mock for property viewing tracker to avoid AuthProvider dependency in generic tests
// Tests that need real behavior can vi.unmock this module within their own file.
vi.mock('@/hooks/usePropertyViewingTracker', () => ({
  usePropertyViewingTracker: () => ({
    trackImageView: vi.fn(),
    trackStoryView: vi.fn(),
    trackPropertyView: vi.fn(),
    canViewImage: () => true,
    canViewStory: () => true,
    checkViewingRestriction: () => ({ restrictionType: 'images', remainingViews: 0, totalLimit: 0, message: '' }),
    isAnonymous: true,
  }),
}));


// Add additional setup here as needed
