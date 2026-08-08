/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import middleware from '../middleware';

describe('Middleware Multi-Tenant Domain Routing', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('allows main root domain on Vercel (multi-tenant-tournament-platform.vercel.app)', () => {
    const req = new NextRequest('https://multi-tenant-tournament-platform.vercel.app/', {
      headers: { host: 'multi-tenant-tournament-platform.vercel.app' },
    });

    const res = middleware(req);
    // NextResponse.next() returns null or undefined rewrite header
    expect(res.headers.get('x-middleware-rewrite')).toBeNull();
  });

  it('allows main root domain on localhost:3000', () => {
    const req = new NextRequest('http://localhost:3000/', {
      headers: { host: 'localhost:3000' },
    });

    const res = middleware(req);
    expect(res.headers.get('x-middleware-rewrite')).toBeNull();
  });

  it('rewrites custom tenant domains (tron-solutions.cc and tron-solution.cc)', () => {
    const testCases = [
      { host: 'tron-solutions.cc', expected: '/tenant/tron-solutions' },
      { host: 'www.tron-solutions.cc', expected: '/tenant/tron-solutions' },
      { host: 'tron-solution.cc', expected: '/tenant/tron-solution' },
      { host: 'www.tron-solution.cc', expected: '/tenant/tron-solution' }
    ];

    for (const { host, expected } of testCases) {
      const req = new NextRequest(`https://${host}/`, {
        headers: { host },
      });
      const res = middleware(req);
      const rewriteHeader = res.headers.get('x-middleware-rewrite');
      expect(rewriteHeader).toContain(expected);
    }
  });

  it('rewrites Vercel tenant subdomain (demo-tenant.multi-tenant-tournament-platform.vercel.app)', () => {
    const req = new NextRequest('https://demo-tenant.multi-tenant-tournament-platform.vercel.app/', {
      headers: { host: 'demo-tenant.multi-tenant-tournament-platform.vercel.app' },
    });

    const res = middleware(req);
    const rewriteHeader = res.headers.get('x-middleware-rewrite');
    expect(rewriteHeader).toContain('/tenant/demo-tenant');
  });

  it('rewrites localhost tenant subdomain (demo-tenant.localhost:3000)', () => {
    const req = new NextRequest('http://demo-tenant.localhost:3000/', {
      headers: { host: 'demo-tenant.localhost:3000' },
    });

    const res = middleware(req);
    const rewriteHeader = res.headers.get('x-middleware-rewrite');
    expect(rewriteHeader).toContain('/tenant/demo-tenant');
  });

  it('rewrites full custom domain (atlantapickleball.com)', () => {
    const req = new NextRequest('https://atlantapickleball.com/', {
      headers: { host: 'atlantapickleball.com' },
    });

    const res = middleware(req);
    const rewriteHeader = res.headers.get('x-middleware-rewrite');
    expect(rewriteHeader).toContain('/tenant/atlantapickleball.com');
  });

  it('respects custom NEXT_PUBLIC_ROOT_DOMAIN environment variable', () => {
    process.env.NEXT_PUBLIC_ROOT_DOMAIN = 'mycustomplatform.com';

    const reqMain = new NextRequest('https://mycustomplatform.com/', {
      headers: { host: 'mycustomplatform.com' },
    });
    const resMain = middleware(reqMain);
    expect(resMain.headers.get('x-middleware-rewrite')).toBeNull();

    const reqTenant = new NextRequest('https://atlanta.mycustomplatform.com/', {
      headers: { host: 'atlanta.mycustomplatform.com' },
    });
    const resTenant = middleware(reqTenant);
    expect(resTenant.headers.get('x-middleware-rewrite')).toContain('/tenant/atlanta');
  });

  it('redirects /platform-admin on custom domains to the root domain', () => {
    const req = new NextRequest('https://atlantapickleball.com/platform-admin', {
      headers: { host: 'atlantapickleball.com' },
    });

    const res = middleware(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('/platform-admin');
  });
});
