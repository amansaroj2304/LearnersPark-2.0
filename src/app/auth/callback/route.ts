import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/csss";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Best effort: the log table only exists once the admin SQL has run.
      await supabase.rpc("log_login_event", {
        p_event_type: "sign_in",
        p_ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
        p_user_agent: request.headers.get("user-agent"),
      });
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
