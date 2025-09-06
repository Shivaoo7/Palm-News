import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type") || "headlines";
    const category = url.searchParams.get("category") || "general";
    const pageSize = url.searchParams.get("pageSize") || "10";
    const page = url.searchParams.get("page") || "1";
    const q = url.searchParams.get("q") || "";

    console.log("🔧 News API proxy called:", { type, category, pageSize, page, q });

    if (!process.env.NEWS_API_KEY) {
      console.error("❌ NEWS_API_KEY not found in environment");
      return NextResponse.json(
        { status: "error", message: "API key not configured" },
        { status: 500 }
      );
    }

    let apiUrl;
    
    if (type === "headlines" || type === "category") {
      // Use top headlines for better reliability
      apiUrl = `https://newsapi.org/v2/top-headlines?country=us&category=${encodeURIComponent(
        category
      )}&pageSize=${encodeURIComponent(pageSize)}&page=${encodeURIComponent(page)}`;
    } else if (type === "hot" || type === "trending") {
      // For hot topics, use everything endpoint with trending keywords
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 3);
      const fromDateString = fromDate.toISOString().split('T')[0];
      
      apiUrl = `https://newsapi.org/v2/everything?q=trending OR viral OR "breaking news"&from=${fromDateString}&sortBy=popularity&language=en&pageSize=${encodeURIComponent(pageSize)}&page=${encodeURIComponent(page)}`;
    } else if (type === "search" && q) {
      // For search queries
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 7);
      const fromDateString = fromDate.toISOString().split('T')[0];
      
      apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&from=${fromDateString}&sortBy=popularity&language=en&pageSize=${encodeURIComponent(pageSize)}&page=${encodeURIComponent(page)}`;
    } else {
      // Default to top headlines
      apiUrl = `https://newsapi.org/v2/top-headlines?country=us&pageSize=${encodeURIComponent(pageSize)}&page=${encodeURIComponent(page)}`;
    }

    console.log("📡 Fetching from NewsAPI:", apiUrl.replace(process.env.NEWS_API_KEY, 'API_KEY_HIDDEN'));

    const res = await fetch(apiUrl, {
      headers: {
        "X-Api-Key": process.env.NEWS_API_KEY,
        "User-Agent": "PalmNews/1.0"
      },
    });

    const body = await res.json().catch(() => ({}));
    
    console.log("📊 NewsAPI response:", {
      status: res.status,
      articlesCount: body.articles?.length || 0,
      totalResults: body.totalResults
    });

    if (!res.ok) {
      console.error("❌ NewsAPI error:", body);
    }

    return NextResponse.json(body, { status: res.status });
  } catch (err) {
    console.error("❌ News proxy error:", err);
    return NextResponse.json(
      { status: "error", message: err.message },
      { status: 500 }
    );
  }
}