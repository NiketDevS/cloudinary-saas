import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const { pathname } = req.nextUrl;

  // Public pages
  const isPublicRoute =
  pathname === "/" ||
  pathname === "/social-share" ||
  pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up");

  // Public APIs
  const isPublicApiRoute = pathname.startsWith("/api/videos");

  // Redirect authenticated users away from auth pages
  if (
    userId &&
    (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up"))
  ) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // Protect all non-public pages and APIs
  if (!userId && !isPublicRoute && !isPublicApiRoute) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

    // Always run for API routes
    "/(api|trpc)(.*)",

    // Always run for Clerk frontend API routes
    "/__clerk/(.*)",
  ],
};
