import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { supabase } from "./config/Supabase"

export async function middleware(req: NextRequest) {
  let response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value
        },
        set(name, value, options) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          response.cookies.set({ name, value: "", ...options })
        }
      }
    }
  )

  const {
    data: { session }
  } = await supabase.auth.getSession()

  const pathname = req.nextUrl.pathname

  // const isLoginPage = pathname.startsWith("/login")
  // const isPublicFile = pathname.startsWith("/_next") || pathname.includes(".")

  // if (!session && !isLoginPage && !isPublicFile) {
  //   const redirectUrl = req.nextUrl.clone()
  //   redirectUrl.pathname = "/login"
  //   return NextResponse.redirect(redirectUrl)
  // }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
}

export async function logout(router: any) {
  await supabase.auth.signOut()

  router.replace("/login")
}