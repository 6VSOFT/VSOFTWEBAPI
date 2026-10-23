import type { Config } from "@netlify/functions"

// Forwards /api/* to the VSOFT gateway so the browser never calls it cross-origin.
// Only the VSOFT host is allowed, so this cannot be used as an open proxy.
const ALLOWED_HOST = "vsoftapi.vsoft2u.my"
const FORWARDED = ["content-type", "authorization", "x-api-key", "appid"]

export default async (req: Request) => {
  let target: URL
  try {
    target = new URL(req.headers.get("x-target-base") ?? "")
  } catch {
    return new Response("X-Target-Base must be a " + ALLOWED_HOST + " URL", { status: 400 })
  }
  if (target.hostname !== ALLOWED_HOST) {
    return new Response("X-Target-Base must be a " + ALLOWED_HOST + " URL", { status: 400 })
  }

  const headers = new Headers()
  for (const h of FORWARDED) {
    const v = req.headers.get(h)
    if (v) headers.set(h, v)
  }

  const incoming = new URL(req.url)
  try {
    const upstream = await fetch(target.origin + incoming.pathname + incoming.search, {
      method: req.method,
      headers,
      body: req.method === "GET" || req.method === "HEAD" ? undefined : await req.arrayBuffer(),
    })
    return new Response(await upstream.arrayBuffer(), {
      status: upstream.status,
      headers: { "content-type": upstream.headers.get("content-type") ?? "application/json" },
    })
  } catch (e) {
    return new Response("Proxy error: " + (e as Error).message, { status: 502 })
  }
}

export const config: Config = {
  path: "/api/*",
}
