import { GoogleGenerativeAI } from '@google/generative-ai';

export async function fetchHotTopic(page = 1) {
    try {
        console.log("🔥 Fetching hot topics, page:", page);
        
        // Use our proxy API instead of calling NewsAPI directly
        const response = await fetch(`/api/news?type=hot&pageSize=10&page=${page}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${errorData.message || response.status}`);
        }

        const data = await response.json();
        let articles = data.articles || [];
        
        console.log("📰 Hot topics found:", articles.length);

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
                    const response = result.response;
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
        console.log("📂 Fetching category:", category, "page:", page);
        
        // Use our proxy API instead of calling NewsAPI directly
        const response = await fetch(`/api/news?type=category&category=${encodeURIComponent(category)}&pageSize=10&page=${page}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${errorData.message || response.status}`);
        }

        const data = await response.json();
        let articles = data.articles || [];
        
        console.log("📰 Category articles found:", articles.length);

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
                    const response = result.response;
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
        const response = result.response;
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