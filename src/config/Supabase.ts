// import { createClient } from "@supabase/supabase-js";

import { createBrowserClient } from "@supabase/ssr";

// export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  )
}

export const supabase = createClient();