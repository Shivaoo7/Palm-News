import { GoogleGenerativeAI } from '@google/generative-ai';

export async function fetchHotTopic(page = 1) {
    try {
        console.log("🔑 API Key exists:", !!process.env.NEXT_PUBLIC_NEWS_API_KEY);
        
        if (!process.env.NEXT_PUBLIC_NEWS_API_KEY) {
            throw new Error("API key is not defined in the environment variables.");
        }

        let articles = [];
        
        // Try multiple approaches to get news
        try {
            // Approach 1: Try top headlines first (more reliable)
            const topHeadlinesUrl = `https://newsapi.org/v2/top-headlines?country=us&pageSize=10&page=${page}&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`;
            console.log("📡 Trying top headlines API...");
            
            const response = await fetch(topHeadlinesUrl, {
                method: 'GET',
                headers: {
                    'User-Agent': 'PalmNews/1.0',
                },
            });

            if (response.ok) {
                const data = await response.json();
                articles = data.articles || [];
                console.log("📰 Top headlines found:", articles.length);
            }
        } catch (error) {
            console.log("⚠️ Top headlines failed, trying everything endpoint...");
        }

        // Approach 2: If no articles, try everything endpoint
        if (articles.length === 0) {
            try {
                const fromDate = new Date();
                fromDate.setDate(fromDate.getDate() - 3); // Reduced to 3 days for better results
                const fromDateString = fromDate.toISOString().split('T')[0];
                
                const everythingUrl = `https://newsapi.org/v2/everything?q=news&from=${fromDateString}&sortBy=popularity&language=en&pageSize=10&page=${page}&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`;
                console.log("📡 Trying everything API...");
                
                const response = await fetch(everythingUrl, {
                    method: 'GET',
                    headers: {
                        'User-Agent': 'PalmNews/1.0',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    articles = data.articles || [];
                    console.log("📰 Everything articles found:", articles.length);
                }
            } catch (error) {
                console.error("❌ Everything endpoint failed:", error);
            }
        }

        // Filter out articles without proper content
        articles = articles.filter(article => 
            article && 
            article.title && 
            article.title !== "[Removed]" &&
            article.url &&
            (article.description || article.content)
        );

        console.log("📰 Filtered articles:", articles.length);

        // Generate summaries for first few articles only (to avoid rate limits)
        const articlesToSummarize = Math.min(articles.length, 3);
        for (let i = 0; i < articlesToSummarize; i++) {
            try {
                if (i > 0) {
                    await new Promise((resolve) => setTimeout(resolve, 1000)); // Rate limiting
                }
                
                const article = articles[i];
                
                if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
                    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
                    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
                    const contentToSummarize = article.content || article.description || article.title;
                    
                    const prompt = `Summarize this news article in 3-4 concise sentences. Focus on the key facts and main points:

"${contentToSummarize}"`;

                    const result = await model.generateContent(prompt);
                    const response = await result.response;
                    article.summary = response.text();
                } else {
                    article.summary = article.description || "Summary not available";
                }
            } catch (summaryError) {
                console.error("Error generating summary:", summaryError);
                articles[i].summary = articles[i].description || "Summary not available";
            }
        }

        // For remaining articles, use description as summary
        for (let i = articlesToSummarize; i < articles.length; i++) {
            articles[i].summary = articles[i].description || "Summary not available";
        }

        return {
            data: articles,
            success: true
        };

    } catch (error) {
        console.error("Error fetching hot topics:", error);
        return {
            data: [],
            success: false,
            error: error.message
        };
    }
}

export async function fetchCategoryNews(category, page = 1) {
    try {
        console.log("🔑 API Key exists:", !!process.env.NEXT_PUBLIC_NEWS_API_KEY);
        console.log("📂 Fetching category:", category, "page:", page);
        
        if (!process.env.NEXT_PUBLIC_NEWS_API_KEY) {
            throw new Error("API key is not defined in the environment variables.");
        }

        let articles = [];

        // Try category-specific top headlines first
        try {
            const categoryUrl = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=10&page=${page}&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`;
            console.log("📡 Trying category headlines API...");
            
            const response = await fetch(categoryUrl, {
                method: 'GET',
                headers: {
                    'User-Agent': 'PalmNews/1.0',
                },
            });

            if (response.ok) {
                const data = await response.json();
                articles = data.articles || [];
                console.log("📰 Category headlines found:", articles.length);
            }
        } catch (error) {
            console.log("⚠️ Category headlines failed, trying everything endpoint...");
        }

        // If no articles, try everything endpoint with category search
        if (articles.length === 0) {
            try {
                const fromDate = new Date();
                fromDate.setDate(fromDate.getDate() - 7);
                const fromDateString = fromDate.toISOString().split('T')[0];
                
                const searchUrl = `https://newsapi.org/v2/everything?q=${category}&from=${fromDateString}&sortBy=popularity&language=en&pageSize=10&page=${page}&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`;
                console.log("📡 Trying category search API...");
                
                const response = await fetch(searchUrl, {
                    method: 'GET',
                    headers: {
                        'User-Agent': 'PalmNews/1.0',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    articles = data.articles || [];
                    console.log("📰 Category search articles found:", articles.length);
                }
            } catch (error) {
                console.error("❌ Category search failed:", error);
            }
        }

        // Filter out articles without proper content
        articles = articles.filter(article => 
            article && 
            article.title && 
            article.title !== "[Removed]" &&
            article.url &&
            (article.description || article.content)
        );

        console.log("📰 Filtered articles:", articles.length);

        // Generate summaries for first few articles only
        const articlesToSummarize = Math.min(articles.length, 3);
        for (let i = 0; i < articlesToSummarize; i++) {
            try {
                if (i > 0) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
                
                const article = articles[i];
                
                if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
                    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
                    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
                    const contentToSummarize = article.content || article.description || article.title;
                    
                    const prompt = `Summarize this ${category} news article in 3-4 concise sentences. Focus on the key facts and main points:

"${contentToSummarize}"`;

                    const result = await model.generateContent(prompt);
                    const response = await result.response;
                    article.summary = response.text();
                } else {
                    article.summary = article.description || "Summary not available";
                }
            } catch (summaryError) {
                console.error("Error generating summary:", summaryError);
                articles[i].summary = articles[i].description || "Summary not available";
            }
        }

        // For remaining articles, use description as summary
        for (let i = articlesToSummarize; i < articles.length; i++) {
            articles[i].summary = articles[i].description || "Summary not available";
        }

        return {
            data: articles,
            success: true
        };

    } catch (error) {
        console.error("Error fetching category news:", error);
        return {
            data: [],
            success: false,
            error: error.message
        };
    }
}

export async function Chatbot(query) {
    try {
        if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
            throw new Error("Gemini API key is not defined in the environment variables.");
        }
        
        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const prompt = `Answer the following question based on general knowledge and current events. 
Provide a concise and informative response:

"${query}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const answer = response.text();

        return {
            data: answer,
            success: true
        };

    } catch (error) {
        console.error("Error in chatbot:", error);
        return {
            data: "Sorry, I'm unable to process your request at the moment. Please try again later.",
            success: false,
            error: error.message
        };
    }
}