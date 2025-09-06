"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { fetchHotTopic } from "../actions/actions"
import { Clock, User, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react"

export default function NewsArticlePage() {
  // State for articles and loading state
  const [articles, setArticles] = useState([])
  const [featuredArticle, setFeaturedArticle] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)

  // Fetch articles on component mount
  useEffect(() => {
    const loadArticles = async () => {
      try {
        setIsLoading(true)
        const response = await fetchHotTopic()
        // console.log(" in client Fetched articles:", response)

        const fetchedArticles = response.data || []

        if (fetchedArticles && fetchedArticles.length > 0) {
          // Set the first article as featured
          setFeaturedArticle(fetchedArticles[0])
          // Set remaining articles
          setArticles(fetchedArticles.slice(1))
        }
      } catch (error) {
        console.error("Error fetching articles:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadArticles()
  }, [])

  // Navigation functions
  const handlePrevious = () => {
    if (articles.length > 0) {
      setCurrentPage((prev) => (prev === 0 ? articles.length - 1 : prev - 1))
      setFeaturedArticle(articles[currentPage === 0 ? articles.length - 1 : currentPage - 1])
    }
  }

  const handleNext = () => {
    if (articles.length > 0) {
      setCurrentPage((prev) => (prev === articles.length - 1 ? 0 : prev + 1))
      setFeaturedArticle(articles[currentPage === articles.length - 1 ? 0 : currentPage + 1])
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-red-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading articles...</p>
        </div>
      </div>
    )
  }

  // No articles state
  if (!featuredArticle && articles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Articles Found</h2>
          <p className="text-gray-600">We couldn't find any articles at the moment. Please check back later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Latest News</h1>
            <p className="text-gray-600 mt-1">Stay updated with Palm News</p>
          </div>

          <div className="flex space-x-2">
            <button
              className="p-2 bg-white rounded-full shadow hover:bg-gray-50"
              onClick={handlePrevious}
              disabled={articles.length <= 1}
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            <button
              className="p-2 bg-white rounded-full shadow hover:bg-gray-50"
              onClick={handleNext}
              disabled={articles.length <= 1}
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Featured article card */}
        {featuredArticle && (
          <motion.div
            className="w-full bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            key={featuredArticle.title} // Add key for animation reset when article changes
          >
            <a href={featuredArticle.url} target="_blank" rel="noopener noreferrer" className="block group">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                {/* Image container */}
                <div className="relative h-64 md:h-full overflow-hidden">
                  <div className="absolute inset-0 bg-red-600 opacity-10"></div>
                  <img
                    src={featuredArticle.urlToImage || "/api/placeholder/800/600"}
                    alt={featuredArticle.title}
                    width={800}
                    height={600}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {featuredArticle.source?.name || "News"}
                  </div>
                </div>

                {/* Content container */}
                <div className="p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors duration-200">
                      {featuredArticle.title}
                    </h2>

                    <div className="flex items-center text-gray-500 text-sm mb-4">
                      <User className="h-4 w-4 mr-1" />
                      <span className="mr-4">{featuredArticle.author || "Unknown"}</span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{formatDate(featuredArticle.publishedAt)}</span>
                    </div>

                    <div className="prose prose-sm text-gray-700 mb-6">
                      {featuredArticle.summary ? (
                        featuredArticle.summary.split('\n').filter(line => line.trim() !== '').map((paragraph, idx) => (
                          <p key={idx} className="mb-2">{paragraph}</p>
                        ))
                      ) : (
                        <p>{featuredArticle.description || featuredArticle.content || "No description available"}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center text-red-600 font-medium">
                      Read full article
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </div>
                    <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                      {featuredArticle.category || "News"}
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </motion.div>
        )}

        {/* More articles section */}
        <div className="mt-12">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(0, 6).map((article, index) => (
              <motion.div
                key={article.title || index}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  <div className="relative h-48 bg-gray-200">
                    {article.urlToImage ? (
                      <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <span>Image placeholder</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="text-xs text-gray-500 mb-2">
                      {article.publishedAt ? formatDate(article.publishedAt) : "Recent"}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{article.title}</h3>
                    <p className="text-sm text-gray-600">
                      {article.description || article.content || "No description available"}
                    </p>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}