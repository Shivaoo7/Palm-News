"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Newspaper, Grid3X3 } from "lucide-react"

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const pathname = usePathname()

    // Handle scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true)
            } else {
                setScrolled(false)
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMenuOpen(false)
    }, [pathname])

    // Check if link is active
    const isActive = (path) => {
        return pathname === path
    }

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-white shadow-md py-2"
                : "bg-white bg-opacity-95 py-4"
                }`}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/">
                            <div className="flex items-center">
                                <span className="text-xl font-bold text-gray-900">Palm<span className="text-red-600">News</span></span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        <Link
                            href="/hot-topics"
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/hot-topics")
                                ? "bg-red-600 text-white"
                                : "text-gray-700 hover:bg-red-500"
                                }`}
                        >
                            <div className="flex items-center">
                                <Newspaper className="w-4 h-4 mr-1.5" />
                                Hot Topics
                            </div>
                        </Link>
                        <Link
                            href="/news-category"
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/news-category")
                                ? "bg-red-600 text-white"
                                : "text-gray-700 hover:bg-red-500"
                                }`}
                        >
                            <div className="flex items-center">
                                <Grid3X3 className="w-4 h-4 mr-1.5" />
                                Categorical News
                            </div>
                        </Link>
                    </nav>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
                <div className="px-4 pt-2 pb-3 space-y-1 bg-white shadow-lg">
                    <Link
                        href="/hot-topics"
                        className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/hot-topics")
                            ? "bg-red-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        <div className="flex items-center">
                            <Newspaper className="w-5 h-5 mr-2" />
                            Hot Topics
                        </div>
                    </Link>
                    <Link
                        href="/news-category"
                        className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/news-category")
                            ? "bg-red-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        <div className="flex items-center">
                            <Grid3X3 className="w-5 h-5 mr-2" />
                            Categorical News
                        </div>
                    </Link>
                </div>
            </div>
        </header>
    )
}