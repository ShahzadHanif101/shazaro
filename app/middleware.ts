import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // ✅ Convert /live/username/password/streamId.m3u8 to /api/get?username=...&stream=...
  const liveMatch = pathname.match(/^\/live\/([^\/]+)\/([^\/]+)\/([^\/]+)\.(m3u8|ts)$/);
  
  if (liveMatch) {
    const [, username, password, streamId, format] = liveMatch;
    
    console.log(`[Middleware] Rewriting: ${pathname} → /api/get?username=${username}&password=${password}&stream=${streamId}`);
    
    const url = request.nextUrl.clone();
    url.pathname = '/api/get';
    url.search = ''; // Clear existing search params
    url.searchParams.set('username', username);
    url.searchParams.set('password', password);
    url.searchParams.set('stream', streamId);
    
    // ✅ Rewrite (internal redirect) - keeps the pretty URL in browser
    return NextResponse.rewrite(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/live/:path*',
};