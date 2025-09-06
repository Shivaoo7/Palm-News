"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { fetchCategoryNews } from "../actions/actions"
import { Clock, User, ArrowUpRight, Filter, RefreshCw } from "lucide-react"

export default function CategoryNewsPage() {
 
  const [articles, setArticles] = useState([])
  const [featuredArticle, setFeaturedArticle] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [category, setCategory] = useState("business")
  const [page, setPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)

  const categories = [
    "business",
    "entertainment",
    "general",
    "health",
    "science",
    "sports",
    "technology"
  ]

  // Fetch articles when category changes
  useEffect(() => {
    const loadArticles = async () => {
      try {
        setIsLoading(true)
        const response = await fetchCategoryNews(category, 1)

        const fetchedArticles = response.data || []

        if (fetchedArticles && fetchedArticles.length > 0) {
          // Set the first article as featured
          setFeaturedArticle(fetchedArticles[0])
          // Set remaining articles
          setArticles(fetchedArticles.slice(1))
          // Reset page
          setPage(1)
        }
      } catch (error) {
        console.error(`Error fetching ${category} news:`, error)
      } finally {
        setIsLoading(false)
      }
    }

    loadArticles()
  }, [category])

  // Load more articles
  const handleLoadMore = async () => {
    try {
      setLoadingMore(true)
      const nextPage = page + 1
      const response = await fetchCategoryNews(category, nextPage)

      const fetchedArticles = response.data || []

      if (fetchedArticles && fetchedArticles.length > 0) {
        setArticles(prev => [...prev, ...fetchedArticles])
        setPage(nextPage)
      }
    } catch (error) {
      console.error(`Error fetching more ${category} news:`, error)
    } finally {
      setLoadingMore(false)
    }
  }

  // Change category
  const handleCategoryChange = (newCategory) => {
    if (newCategory !== category) {
      setCategory(newCategory)
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
          <p className="mt-4 text-gray-600">Loading {category} news...</p>
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
          <p className="text-gray-600">We couldn't find any {category} news at the moment. Please try another category.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${cat === category
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {category.charAt(0).toUpperCase() + category.slice(1)} News
          </h1>
          <p className="text-gray-600 mt-1">Browse the latest {category} news with Palm News</p>
        </div>

        {/* Category tabs */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${cat === category
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Featured article card */}
        {featuredArticle && (
          <motion.div
            className="w-full bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            key={`featured-${featuredArticle.title}`}
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
                    {featuredArticle.source?.name || category}
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
                      {category}
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </motion.div>
        )}

        {/* More articles section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">More {category} News</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <motion.div
                key={`${article.title}-${index}`}
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
                    <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium text-gray-700">
                      {article.source?.name || category}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="text-xs text-gray-500 mb-2">
                      {article.publishedAt ? formatDate(article.publishedAt) : "Recent"}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 hover:text-red-600 transition-colors">{article.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {article.description || article.content || "No description available"}
                    </p>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>

          {/* Load more button */}
          <div className="mt-12 text-center">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center mx-auto transition-colors disabled:opacity-50"
            >
              {loadingMore ? (
                <>
                  <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                  Loading more...
                </>
              ) : (
                <>
                  Load more {category} news
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}