// Simple test script to verify API keys work
require('dotenv').config();

async function testNewsAPI() {
    console.log("🧪 Testing NewsAPI...");
    
    if (!process.env.NEXT_PUBLIC_NEWS_API_KEY) {
        console.error("❌ NewsAPI key not found");
        return;
    }
    
    try {
        const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`);
        const data = await response.json();
        
        if (response.ok) {
            console.log("✅ NewsAPI working! Found", data.articles?.length || 0, "articles");
            console.log("📰 Sample article:", data.articles?.[0]?.title || "No articles");
        } else {
            console.error("❌ NewsAPI error:", data.message || response.status);
        }
    } catch (error) {
        console.error("❌ NewsAPI fetch error:", error.message);
    }
}

async function testGeminiAPI() {
    console.log("🧪 Testing Gemini API...");
    
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        console.error("❌ Gemini API key not found");
        return;
    }
    
    try {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        
        const result = await model.generateContent("Say hello in one sentence");
        const response = await result.response;
        const text = response.text();
        
        console.log("✅ Gemini API working! Response:", text);
    } catch (error) {
        console.error("❌ Gemini API error:", error.message);
    }
}

async function runTests() {
    console.log("🚀 Starting API tests...\n");
    await testNewsAPI();
    console.log("");
    await testGeminiAPI();
    console.log("\n✨ Tests completed!");
}

runTests();