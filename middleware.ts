import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define routes that require authentication and admin access
const protectedRoutes = ['/reader', '/books'];
const adminRoutes = ['/register'];

export async function middleware(req: NextRequest) {
  // Get the token (if any) from the request
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const url = req.nextUrl.clone();
  const path = req.nextUrl.pathname;

  // Check if the user is trying to access an admin route
  const isAdminRoute = adminRoutes.some(route => path.startsWith(route));

  if (isAdminRoute) {
    if (!token || !token.admin) {
      // Redirect non-admin users to the login page
      url.pathname = '/login';
      url.search = `?error=AccessDenied&from=${encodeURIComponent(path)}`;
      return NextResponse.redirect(url);
    }
  } else {
    // Check if the user is trying to access a protected route
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));

    if (isProtectedRoute && !token) {
      // Redirect unauthenticated users to the login page
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Apply middleware to the necessary routes
export const config = {
  matcher: ['/reader', '/books', '/register'],
};
