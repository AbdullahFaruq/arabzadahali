import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isPublicRoute = createRouteMatcher([
  "/",
  "/shop(.*)",
  "/cart",
  "/checkout(.*)",
  "/about(.*)",
  "/contact(.*)",
  "/wishlist",
  "/sign-in(.*)",
  "/sign-up(.*)",
  // Public read endpoints — the route handlers themselves gate writes
  // (POST/PATCH/DELETE) to admins via requireAdmin().
  "/api/products(.*)",
  "/api/slides(.*)",
  "/api/discover-slides(.*)",
  "/api/settings(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  if (isAdminRoute(req)) {
    if (!userId) {
      const url = new URL("/sign-in", req.url);
      url.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(url);
    }
    // Clerk puts publicMetadata directly on sessionClaims
    const role = (sessionClaims?.publicMetadata as { role?: string })?.role;
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (!isPublicRoute(req) && !userId) {
    const url = new URL("/sign-in", req.url);
    url.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)" ],
};
