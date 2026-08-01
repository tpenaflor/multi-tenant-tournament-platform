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
  const hostname = req.headers.get('host') || '';

  // Standard main platform hostnames (local & production)
  const mainDomains = ['localhost:3000', '127.0.0.1:3000', 'bracketsports.com', 'www.bracketsports.com'];

  // Check if current hostname is a custom domain or subdomain
  const isMainDomain = mainDomains.some((domain) => hostname === domain);

  if (!isMainDomain) {
    // Extract tenant identifier (e.g. "atlanta" from "atlanta.localhost:3000" or custom domain "atlantapickleball.com")
    let tenantSlug = hostname.split('.')[0];
    
    // If it's a full custom domain without subdomain matching main domain
    if (!hostname.includes('localhost') && !hostname.includes('bracketsports.com')) {
      tenantSlug = hostname; // Custom domain mapping identifier
    }

    // Rewrite request URL to /[tenantSlug]/[path] internally without changing browser URL bar
    const searchParams = url.searchParams.toString();
    const path = `${url.pathname}${searchParams ? `?${searchParams}` : ''}`;
    
    return NextResponse.rewrite(new URL(`/tenant/${tenantSlug}${path}`, req.url));
  }

  return NextResponse.next();
}
