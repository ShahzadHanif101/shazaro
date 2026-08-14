import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log(`[Middleware] Processing: ${pathname}`);
  
  // =====================================================
  // HANDLE /live/username/password/streamId.m3u8
  // =====================================================
  
  const liveMatch = pathname.match(/^\/live\/([^\/]+)\/([^\/]+)\/([^\/]+)\.(m3u8|ts)$/);
  
  if (liveMatch) {
    const [, username, password, streamId, format] = liveMatch;
    
    console.log(`[Middleware] ✅ Rewriting live: ${pathname} → /api/get?username=${username}&password=${password}&stream=${streamId}`);
    
    const url = request.nextUrl.clone();
    url.pathname = '/api/get';
    url.search = '';
    url.searchParams.set('username', username);
    url.searchParams.set('password', password);
    url.searchParams.set('stream', streamId);
    
    return NextResponse.rewrite(url);
  }
  
  // =====================================================
  // ✅ Handle /username/password/streamId (ANY username/password)
  // =====================================================
  
 const directMatch = pathname.match(/^\/([^\/]+)\/([^\/]+)\/([^\/]+)(?:\.(m3u8|ts))?$/);

if (directMatch) {
  const [, username, password, streamId] = directMatch;
  // Redirect to /live/username/password/streamId.m3u8
  const newUrl = `/live/${username}/${password}/${streamId}.m3u8`;
  return NextResponse.redirect(new URL(newUrl, request.url));
}
  
  // =====================================================
  // ✅ HANDLE /xmltv.php (Root Level)
  // =====================================================
  
  if (pathname === '/xmltv.php') {
    console.log(`[Middleware] ✅ Rewriting xmltv.php → /api/xmltv.php`);
    
    const url = request.nextUrl.clone();
    url.pathname = '/api/xmltv.php';
    // Preserve query parameters
    
    return NextResponse.rewrite(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/live/:path*',
    '/:path*',
    '/xmltv.php',
  ],
};