# PalmNews - Your AI-Powered News Platform

A modern news application built with Next.js that provides:

- 📰 Latest hot topics and trending news
- 🏷️ Category-based news browsing
- 🤖 AI-powered article summaries using Google Gemini
- 💬 Interactive chatbot for news queries
- 📧 Email newsletter functionality

## Features

- **Hot Topics**: Get the latest trending news with AI-generated summaries
- **Category News**: Browse news by categories (business, technology, sports, etc.)
- **AI Chatbot**: Ask questions and get intelligent responses
- **Responsive Design**: Works perfectly on desktop and mobile
- **Fast Loading**: Optimized for performance with Next.js

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **AI**: Google Gemini API for summaries and chatbot
- **News Data**: NewsAPI for real-time news
- **Email**: Nodemailer for newsletter functionality
- **Deployment**: Vercel

## Environment Variables

Create a `.env` file with:

```
NEXT_PUBLIC_NEWS_API_KEY=your_newsapi_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
PASS_KEY=your_email_app_password
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## Deployment

This app is optimized for Vercel deployment. Simply connect your GitHub repository to Vercel and set the environment variables.

---

Built with ❤️ using Next.js and AI