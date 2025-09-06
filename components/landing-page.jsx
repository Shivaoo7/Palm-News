"use client"
import { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { ArrowDown, ArrowRight, CheckCircle, Clock, Zap, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"

export default function LandingPage() {
    const { toast } = useToast()

    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [count1, setCount1] = useState(0)
    const [count2, setCount2] = useState(0)
    const [count3, setCount3] = useState(0)

    const statsRef = useRef(null)
    const isStatsInView = useInView(statsRef, { once: true })

    useEffect(() => {
        if (isStatsInView) {
            const timer1 = setTimeout(() => {
                const interval = setInterval(() => {
                    setCount1((prev) => {
                        if (prev < 26) return prev + 1
                        clearInterval(interval)
                        return prev
                    })
                }, 60)
                return () => clearInterval(interval)
            }, 300)

            const timer2 = setTimeout(() => {
                const interval = setInterval(() => {
                    setCount2((prev) => {
                        if (prev < 83) return prev + 1
                        clearInterval(interval)
                        return prev
                    })
                }, 30)
                return () => clearInterval(interval)
            }, 600)

            const timer3 = setTimeout(() => {
                const interval = setInterval(() => {
                    setCount3((prev) => {
                        if (prev < 94) return prev + 1
                        clearInterval(interval)
                        return prev
                    })
                }, 20)
                return () => clearInterval(interval)
            }, 900)

            return () => {
                clearTimeout(timer1)
                clearTimeout(timer2)
                clearTimeout(timer3)
            }
        }
    }, [isStatsInView])

    const scrollToSignup = () => {
        document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" })
    }

    const fadeInUp = {
        initial: { opacity: 0, y: 50 },
        whileInView: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
        viewport: { once: true },
    }

    const handleSubmitEmail = async () => {
        if (!email || !email.includes('@') || !email.includes('.')) {
            alert("Please enter a valid email address");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setEmail("");
                
             
                toast({
                   title: "Success!",
                   description: "Check your email for the latest news.",
                });
            } else {
              
                toast({
                    title: "Error!",
                    description: data.message,
                });
            }
        } catch (error) {
            console.error("Error sending email:", error);
            alert("Failed to send email. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen font-sans bg-gray-50">
            {/* Hero Section */}
            <motion.section
                className="flex flex-col items-center justify-center px-4 py-24 text-center md:py-32 bg-white"
                {...fadeInUp}
            >
                <h1 className="text-4xl font-bold tracking-tight md:text-6xl text-gray-900">News. <span className="text-red-700">Short</span> and <span className="text-red-700">Simple</span>.</h1>
                <p className="max-w-md mt-6 text-lg text-gray-700">
                    Stay updated in seconds with concise headlines. No noise. Just news.
                </p>

                    <Button
                        onClick={scrollToSignup}
                        className="mt-8 px-8 py-6 text-lg bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
                    >
                        Get Updated
                        <ArrowDown className="ml-2 h-4 w-4" />
                    </Button>
                
            </motion.section>

            {/* How It Works - Flowchart Section */}
            <motion.section className="py-16 px-4 bg-gray-100" {...fadeInUp}>
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-12 text-gray-900">How Palm News Works</h2>

                    <div className="relative">
                        {/* Flowchart with connecting lines */}
                        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-red-200 -translate-y-1/2 z-0"></div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                            <motion.div
                                className="bg-white p-8 rounded-xl shadow-sm flex flex-col items-center border-t-4 border-red-400"
                                {...fadeInUp}
                                transition={{ delay: 0.1 }}
                            >
                                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                                    <Zap className="h-8 w-8 text-red-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">1. Collect</h3>
                                <p className="text-gray-700 text-center">Our AI scans thousands of news sources in real-time</p>
                            </motion.div>

                            <motion.div
                                className="bg-white p-8 rounded-xl shadow-sm flex flex-col items-center border-t-4 border-red-600"
                                {...fadeInUp}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                                    <BarChart3 className="h-8 w-8 text-red-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">2. Analyze</h3>
                                <p className="text-gray-700 text-center">Stories are analyzed and summarized into bite-sized updates</p>
                            </motion.div>

                            <motion.div
                                className="bg-white p-8 rounded-xl shadow-sm flex flex-col items-center border-t-4 border-red-800"
                                {...fadeInUp}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle className="h-8 w-8 text-red-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">3. Deliver</h3>
                                <p className="text-gray-700 text-center">Personalized news delivered to you in seconds</p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Animated Stats Section */}
            <motion.section ref={statsRef} className="py-20 px-4 bg-white" {...fadeInUp}>
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">Why People Choose Palm News</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div
                            className="p-8 bg-red-50 rounded-xl shadow-sm text-center"
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <div className="text-5xl font-bold mb-2 text-red-700">{count1}%</div>
                            <p className="text-gray-700">of younger audiences prefer brief news</p>
                        </motion.div>

                        <motion.div
                            className="p-8 bg-red-50 rounded-xl shadow-sm text-center"
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div className="text-5xl font-bold mb-2 text-red-700">{count2}%</div>
                            <p className="text-gray-700">faster news consumption with Palm News</p>
                        </motion.div>

                        <motion.div
                            className="p-8 bg-red-50 rounded-xl shadow-sm text-center"
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            <div className="text-5xl font-bold mb-2 text-red-700">{count3}%</div>
                            <p className="text-gray-700">user satisfaction rate</p>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Interactive Demo Section */}
            <motion.section className="py-20 px-4 bg-gray-100" {...fadeInUp}>
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-gray-900">See How Time Flies</h2>
                            <p className="text-gray-700 mb-8">
                                The average person spends 70 minutes daily reading news. With Palm News, get the same information in
                                just 12 minutes.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <Clock className="h-6 w-6 mr-3 text-gray-500" />
                                    <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
                                        <motion.div
                                            className="bg-gray-500 h-full"
                                            initial={{ width: 0 }}
                                            whileInView={{ width: "100%" }}
                                            transition={{ duration: 2 }}
                                            viewport={{ once: true }}
                                        ></motion.div>
                                    </div>
                                    <span className="ml-3 text-gray-700 font-medium">70 min</span>
                                </div>

                                <div className="flex items-center">
                                    <Zap className="h-6 w-6 mr-3 text-red-600" />
                                    <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
                                        <motion.div
                                            className="bg-red-600 h-full"
                                            initial={{ width: 0 }}
                                            whileInView={{ width: "17%" }}
                                            transition={{ duration: 0.5 }}
                                            viewport={{ once: true }}
                                        ></motion.div>
                                    </div>
                                    <span className="ml-3 text-red-700 font-medium">12 min</span>
                                </div>
                            </div>
                            <Link href={"/news-category"}>
                                <Button className="mt-8 rounded-lg bg-red-600 hover:bg-red-700 text-white">
                                    Try It Now
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>

                        <motion.div
                            className="bg-white p-6 rounded-xl shadow-md"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <div className="space-y-4">
                                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="w-12 h-12 bg-red-700 rounded-full flex-shrink-0"></div>
                                    <div>
                                        <h4 className="font-medium">Traditional News</h4>
                                        <p className="text-sm text-gray-700">
                                            "The economic summit concluded yesterday with leaders from 15 nations discussing various policies
                                            related to international trade, climate initiatives, and financial regulations. The three-day
                                            event featured multiple keynote speeches and panel discussions..."
                                        </p>
                                        <p className="text-xs text-gray-500 mt-2">3 min read</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4 p-4 bg-red-800 text-white rounded-lg">
                                    <div className="w-12 h-12 bg-red-700 rounded-full flex-shrink-0 flex items-center justify-center">
                                        <Zap className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium">Palm News</h4>
                                        <p className="text-sm">
                                            "Economic summit: 15 nations agree on new trade policies and climate initiatives. Key outcome: 2%
                                            tariff reduction on renewable tech."
                                        </p>
                                        <p className="text-xs text-red-200 mt-2">20 sec read</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* News Pulse Visualization */}
            <motion.section className="py-20 px-4 bg-white" {...fadeInUp}>
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">News Pulse</h2>
                    <p className="text-gray-700 mb-12 text-center max-w-2xl mx-auto">
                        See what's trending right now across different categories. Our AI analyzes thousands of sources to show you
                        what matters.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Trending Topics Bubbles */}
                        <motion.div
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-xl font-semibold mb-6 text-gray-900">Trending Topics</h3>

                            <div className="relative h-[300px]">
                                {/* Animated bubbles representing trending topics */}
                                {[
                                    { name: "Climate", size: "w-24 h-24", position: "top-4 left-4", delay: 0, bgColor: "bg-red-50", textColor: "text-red-700" },
                                    { name: "Tech", size: "w-28 h-28", position: "top-20 right-12", delay: 0.2, bgColor: "bg-red-100", textColor: "text-red-800" },
                                    { name: "Politics", size: "w-20 h-20", position: "bottom-12 left-20", delay: 0.4, bgColor: "bg-gray-200", textColor: "text-gray-800" },
                                    { name: "Sports", size: "w-16 h-16", position: "bottom-4 right-4", delay: 0.6, bgColor: "bg-red-50", textColor: "text-red-700" },
                                    { name: "Health", size: "w-20 h-20", position: "top-32 left-32", delay: 0.8, bgColor: "bg-gray-100", textColor: "text-gray-800" },
                                    { name: "Finance", size: "w-24 h-24", position: "bottom-24 right-28", delay: 1, bgColor: "bg-red-100", textColor: "text-red-800" },
                                ].map((topic, index) => (
                                    <motion.div
                                        key={index}
                                        className={`absolute ${topic.position} ${topic.size} ${topic.bgColor} rounded-full flex items-center justify-center text-sm font-medium ${topic.textColor}`}
                                        initial={{ scale: 0, opacity: 0 }}
                                        whileInView={{ scale: 1, opacity: 1 }}
                                        transition={{
                                            delay: topic.delay,
                                            duration: 0.5,
                                            type: "spring",
                                            stiffness: 100,
                                        }}
                                        viewport={{ once: true }}
                                        whileHover={{
                                            scale: 1.05,
                                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                                        }}
                                    >
                                        {topic.name}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Category Distribution */}
                        <motion.div
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-xl font-semibold mb-6 text-gray-900">Category Distribution</h3>

                            <div className="space-y-6">
                                {[
                                    { name: "Technology", percentage: 28, color: "bg-red-800" },
                                    { name: "Politics", percentage: 22, color: "bg-red-700" },
                                    { name: "Business", percentage: 18, color: "bg-red-600" },
                                    { name: "Entertainment", percentage: 15, color: "bg-red-500" },
                                    { name: "Sports", percentage: 12, color: "bg-red-400" },
                                    { name: "Science", percentage: 5, color: "bg-red-300" },
                                ].map((category, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium">{category.name}</span>
                                            <span className="text-sm text-gray-600">{category.percentage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                            <motion.div
                                                className={`${category.color} h-full`}
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${category.percentage}%` }}
                                                transition={{ duration: 1, delay: index * 0.1 }}
                                                viewport={{ once: true }}
                                            ></motion.div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Interactive News Timeline */}
                    <motion.div
                        className="mt-12 bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-xl font-semibold mb-6 text-gray-900">News Timeline</h3>

                        <div className="relative">
                            {/* Timeline line */}
                            <div className="absolute left-0 top-0 bottom-0 w-px bg-red-200 ml-3"></div>

                            <div className="space-y-8 ml-8">
                                {[
                                    { time: "Just now", title: "ISRO launches new satellite", category: "Technology", dotColor: "bg-red-700" },
                                    { time: "2 hours ago", title: "Global markets reaction on Trump's tariffs", category: "Business", dotColor: "bg-red-600" },
                                    { time: "5 hours ago", title: "New Income Tax bill and GST bill passes", category: "Politics", dotColor: "bg-red-500" },
                                    { time: "Yesterday", title: "Scientists discover potential new treatment for the Cancer", category: "Science", dotColor: "bg-red-400" },
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        className="relative"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                    >
                                        {/* Timeline dot */}
                                        <div className={`absolute -left-8 mt-1.5 w-3 h-3 rounded-full ${item.dotColor}`}></div>

                                        <div>
                                            <span className="text-xs text-gray-500">{item.time}</span>
                                            <h4 className="font-medium text-gray-900">{item.title}</h4>
                                            <span className="inline-block px-2 py-1 mt-1 text-xs bg-red-50 text-red-800 rounded">{item.category}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Features Grid */}
            <motion.section className="py-16 px-4 bg-gray-100" {...fadeInUp}>
                <div className="max-w-6xl mx-auto">
                    <div className="grid gap-8 md:grid-cols-2">
                        <motion.div className="p-6 bg-white rounded-xl shadow-sm border-l-4 border-red-600" {...fadeInUp} transition={{ delay: 0.1 }}>
                            <div className="text-4xl mb-4">🔥</div>
                            <h3 className="text-xl font-semibold text-gray-900">What's Hot</h3>
                            <p className="mt-2 text-gray-700">Real-time trending topics from around the globe.</p>
                        </motion.div>

                        <motion.div className="p-6 bg-white rounded-xl shadow-sm border-l-4 border-red-700" {...fadeInUp} transition={{ delay: 0.2 }}>
                            <div className="text-4xl mb-4">📰</div>
                            <h3 className="text-xl font-semibold text-gray-900">Choose Your Interest</h3>
                            <p className="mt-2 text-gray-700">Browse categories like tech, sports, and politics with a tap.</p>
                        </motion.div>

                        <motion.div className="p-6 bg-white rounded-xl shadow-sm border-l-4 border-red-800" {...fadeInUp} transition={{ delay: 0.3 }}>
                            <div className="text-4xl mb-4">🤖</div>
                            <h3 className="text-xl font-semibold text-gray-900">Smarter, Faster News</h3>
                            <p className="mt-2 text-gray-700">Get concise AI-powered summaries of top stories.</p>
                        </motion.div>

                        <motion.div className="p-6 bg-white rounded-xl shadow-sm border-l-4 border-red-500" {...fadeInUp} transition={{ delay: 0.4 }}>
                            <div className="text-4xl mb-4">⏳</div>
                            <h3 className="text-xl font-semibold text-gray-900">Pick Your Time Frame</h3>
                            <p className="mt-2 text-gray-700">Filter news to see what matters now or catch up on any timeframe.</p>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Email Signup Section */}
            <motion.section id="signup" className="py-20 px-4 bg-white" {...fadeInUp}>
                <div className="max-w-md mx-auto">
                    <Card className="shadow-md rounded-xl border border-red-100">
                        <CardHeader className="bg-red-50 rounded-t-xl">
                            <CardTitle className="text-2xl font-bold text-center text-gray-900">Stay in the Loop</CardTitle>
                            <CardDescription className="text-center text-gray-700">
                                Get the latest headlines delivered quickly to your inbox.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="flex flex-col space-y-4">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="rounded-lg border-gray-300"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                className="w-full rounded-lg bg-red-600 hover:bg-red-700 text-white"
                                                onClick={handleSubmitEmail}
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? "Sending..." : "Notify Me"}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-red-50 text-red-800 border border-red-200">
                                            <p>26% of younger audiences prefer brief news</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </motion.section>

            {/* Footer */}
            <motion.footer className="py-8 text-center text-gray-600 bg-gray-100 border-t border-gray-200" {...fadeInUp}>
                <p>© 2025 Palm News</p>
            </motion.footer>
        </div>
    )
}