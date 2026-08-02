import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const rawHost = req.headers.get('host') || url.host || '';
  const host = rawHost.toLowerCase();
  const hostWithoutPort = host.split(':')[0];

  // Environment configured root domain or Vercel default domain
  const rootDomain = (
    process.env.NEXT_PUBLIC_ROOT_DOMAIN ||
    process.env.VERCEL_URL ||
    'multi-tenant-tournament-platform.vercel.app'
  ).toLowerCase().split(':')[0];

  // Standard main platform hostnames (local & production)
  const mainDomains = new Set([
    'localhost',
    'localhost:3000',
    '127.0.0.1',
    '127.0.0.1:3000',
    'bracketsports.com',
    'www.bracketsports.com',
    rootDomain,
    `www.${rootDomain}`,
  ]);

  // Check if current hostname is a main platform domain
  const isMainDomain = mainDomains.has(host) || mainDomains.has(hostWithoutPort);

  if (isMainDomain) {
    return NextResponse.next();
  }

  // If path already starts with /tenant, don't rewrite again
  if (url.pathname.startsWith('/tenant')) {
    return NextResponse.next();
  }

  // Extract tenant identifier (e.g. "atlanta" from "atlanta.localhost:3000" or custom domain "atlantapickleball.com")
  let tenantSlug = hostWithoutPort;

  if (rootDomain && hostWithoutPort.endsWith(`.${rootDomain}`)) {
    tenantSlug = hostWithoutPort.substring(0, hostWithoutPort.length - rootDomain.length - 1);
  } else if (hostWithoutPort.endsWith('.localhost')) {
    tenantSlug = hostWithoutPort.substring(0, hostWithoutPort.length - '.localhost'.length);
  } else if (hostWithoutPort.includes('.')) {
    // If it's a subdomain of something else, take first part
    tenantSlug = hostWithoutPort.split('.')[0];
  }

  // Rewrite request URL to /tenant/[tenantSlug]/[path] internally without changing browser URL bar
  const searchParams = url.searchParams.toString();
  const path = `${url.pathname}${searchParams ? `?${searchParams}` : ''}`;

  return NextResponse.rewrite(new URL(`/tenant/${tenantSlug}${path}`, req.url));
}

