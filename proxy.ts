import {NextRequest, NextResponse} from "next/server";
import {decodeJwt} from "jose";

const PUBLIC_ROUTES = ["/login", "/register", "/"];
const ADMIN_ROUTES = ["/admin"]; // Add any route starting with /admin here

export async function proxy(req: NextRequest) {
  const {pathname} = req.nextUrl;

  const token = req.cookies.get("accessToken")?.value;
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route));

  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token) {
    try {
      // Decode explicitly to check Role (No verify needed here, backend does the hard security)
      const payload = decodeJwt(token);
      const isExpired = payload.exp ? payload.exp * 1000 < Date.now() : true;
      const userRole = payload.role as string; // 'USER' | 'ADMIN'

      // A. Token is expired? -> Force Login
      if (isExpired) {
        const response = NextResponse.redirect(new URL("/login", req.url));
        response.cookies.delete("accessToken"); // Clean up
        return response;
      }
      // B. User trying to access Login/Register? -> Send Home
      if (isPublicRoute && pathname !== "/") {
        return NextResponse.redirect(new URL("/", req.url));
      }

      // C. User trying to access Admin Route?
      if (isAdminRoute && userRole !== "ADMIN") {
        // Redirect unauthorized users to a 403 page or Dashboard
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch (error) {
      console.error(error);
      // If token is malformed, force login
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
  // Allow request to proceed
  return NextResponse.next();
}

// This ensures we skip _next/static files, public files, etc.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
