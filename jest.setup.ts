import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

// Polyfill for encoding which isn't present in jsdom
Object.assign(global, { TextDecoder, TextEncoder })

// Mock next/headers
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
    getAll: jest.fn(() => []),
  })),
}))


// Mock ResizeObserver
if (typeof window !== 'undefined') {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver

  // Mock PointerEvent
  if (!global.PointerEvent) {
    class PointerEvent extends MouseEvent {
      public pointerId: number;
      public pointerType: string;
      public isPrimary: boolean;

      constructor(type: string, params: PointerEventInit = {}) {
        super(type, params);
        this.pointerId = params.pointerId || 0;
        this.pointerType = params.pointerType || '';
        this.isPrimary = params.isPrimary || false;
      }
    }
    global.PointerEvent = PointerEvent as any;
  }
}
