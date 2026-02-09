export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return new Response("Missing url", { status: 400 });
  }

  const upstream = await fetch(imageUrl, {
    next: { revalidate: 60 * 60 * 24 }, // CDN cache
  });

  if (!upstream.ok) {
    return new Response("Fetch failed", { status: 500 });
  }

  // convert to blob
  const blob = await upstream.blob();

  return new Response(blob, {
    headers: {
      "Content-Type":
        upstream.headers.get("content-type") || "application/octet-stream",

      "Cache-Control":
        "public, s-maxage=86400, stale-while-revalidate",
    },
  });
}
