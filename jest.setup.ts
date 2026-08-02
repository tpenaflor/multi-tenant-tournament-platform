import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

// Polyfill for encoding and web APIs which aren't present in jsdom
Object.assign(global, {
  TextDecoder,
  TextEncoder,
  Request: globalThis.Request || global.Request,
  Response: globalThis.Response || global.Response,
  Headers: globalThis.Headers || global.Headers,
})

// Mock next/headers
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
    getAll: jest.fn(() => []),
  })),
  headers: jest.fn(() => Promise.resolve(new Map([['host', 'localhost:3000']]))),
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
