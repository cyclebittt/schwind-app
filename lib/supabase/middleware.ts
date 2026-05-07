import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next({ request });
  }

  // Create response ONCE before the Supabase client.
  // The setAll callback must NEVER recreate this object — doing so drops
  // all Set-Cookie headers written by earlier cookies, which breaks session
  // refresh (the browser never gets the updated token).
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Write to request so subsequent server code in this cycle can read them
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Write to response so the browser receives updated Set-Cookie headers
          // DO NOT reassign supabaseResponse here — that would lose prior cookies
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getUser() validates the JWT with Supabase and refreshes it if expired.
  // The refreshed token is written back via setAll above.
  const { data: { user } } = await supabase.auth.getUser();

  const protectedPaths = ["/dashboard", "/loyalty", "/profile", "/reserve"];
  const isProtected = protectedPaths.some(
    (p) => request.nextUrl.pathname === p || request.nextUrl.pathname.startsWith(p + "/")
  );

  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}
