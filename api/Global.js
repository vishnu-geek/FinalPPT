// middleware.js or middleware.ts (depending on your setup)

import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();

  // Add CORS headers globally
  response.headers.set('Access-Control-Allow-Origin', 'https://stocks-generates.vercel.app'); // Allow your frontend domain
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');

  // Handling preflight requests (OPTIONS)
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204, // No Content
    });
  }

  return response;
}

// Optionally, you can define which paths you want this middleware to apply to
export const config = {
  matcher: '/api/*',  // Apply middleware only to API routes
};
