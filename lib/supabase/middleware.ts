import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

export async function updateSession(request: NextRequest) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  // Get user from auth token in cookies
  const token = request.cookies.get("sb-auth-token")?.value

  let user = null
  if (token) {
    try {
      const { data } = await supabase.auth.getUser(token)
      user = data?.user
    } catch {
      // Token invalid, user is null
    }
  }

  // This prevents redirect loops and lets Supabase client manage session state
  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  })
}
