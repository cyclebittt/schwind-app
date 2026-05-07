import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase auth callback — handles:
 *  - Email confirmation links (signup / password reset)
 *  - OAuth redirects
 *
 * Supabase redirects here with ?code=… after the user clicks a link.
 * We exchange the one-time code for a session, then send the user home.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (!code) {
    // No code — just redirect home
    return NextResponse.redirect(new URL("/", request.url));
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Auth callback error:", error.message);
    // Redirect to login with an error hint
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent("Bestätigungslink ungültig oder abgelaufen.")}`, request.url)
    );
  }

  // Session established – go to the requested page (default: home)
  return NextResponse.redirect(new URL(next, request.url));
}
