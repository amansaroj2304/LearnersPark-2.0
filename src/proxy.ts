import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isKnownSsbTestId } from "@/lib/ssb/ids";

const protectedRoutes = ["/csss/test", "/progress"];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([key, value]) =>
            response.headers.set(key, value),
          );
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  const { pathname } = request.nextUrl;
  // Unknown SSB test ids: rewrite to a path that does not exist so Next answers
  // with a real 404 (the page itself cannot set the status once it streams).
  const ssbIdMatch = /^\/ssb\/([^/]+)\/?$/.exec(pathname);
  if (ssbIdMatch) {
    let id = ssbIdMatch[1];
    try {
      id = decodeURIComponent(id);
    } catch {
      /* keep the raw segment */
    }
    if (!isKnownSsbTestId(id)) {
      const notFoundUrl = request.nextUrl.clone();
      notFoundUrl.pathname = "/404-page-not-found";
      notFoundUrl.search = "";
      return NextResponse.rewrite(notFoundUrl);
    }
  }

  const publicAdminRoutes = ["/admin/login", "/admin/reset-password"];
  if (
    pathname.startsWith("/admin") &&
    !publicAdminRoutes.includes(pathname) &&
    !claims
  ) {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = "/admin/login";
    adminUrl.search = "";
    return NextResponse.redirect(adminUrl);
  }

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isProtected && !claims) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)",
  ],
};
