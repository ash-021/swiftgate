import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  
  // Get hostname of request (e.g., 'app.localhost:3000', 'app.swiftgate.in')
  const hostname = req.headers.get('host') || '';

  // Only rewrite for the 'app' subdomain
  if (hostname.startsWith('app.')) {
    // Prevent redirect loop by checking if we're already serving the internal route
    if (!url.pathname.startsWith('/app')) {
      url.pathname = `/app${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // Otherwise proceed as normal
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|models|icon-).*)',
  ],
};
