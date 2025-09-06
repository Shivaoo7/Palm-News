"use client"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Bot, User as UserIcon, XCircle, ArrowUp, Sparkles } from "lucide-react"
import { Chatbot } from "@/app/actions/actions"

export default function ChatbotInterface() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: "bot",
            content: "Hello! I'm your Palm News assistant. Ask me anything about the latest news!",
            timestamp: new Date()
        }
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    // Auto scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                inputRef.current?.focus()
            }, 300)
        }
    }, [isOpen])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMessage = {
            id: messages.length + 1,
            role: "user",
            content: input.trim(),
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInput("")
        setIsLoading(true)

        try {
            const response = await Chatbot(input.trim())

            if (response.success && response.data) {
                const botMessage = {
                    id: messages.length + 2,
                    role: "bot",
                    content: response.data,
                    timestamp: new Date()
                }
                setMessages(prev => [...prev, botMessage])
            } else {
                const errorMessage = {
                    id: messages.length + 2,
                    role: "bot",
                    content: "I'm sorry, I couldn't process your question. Please try again.",
                    timestamp: new Date(),
                    isError: true
                }
                setMessages(prev => [...prev, errorMessage])
            }
        } catch (error) {
            console.error("Error getting chatbot response:", error)
            const errorMessage = {
                id: messages.length + 2,
                role: "bot",
                content: "Something went wrong. Please try again later.",
                timestamp: new Date(),
                isError: true
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const clearChat = () => {
        setMessages([
            {
                id: 1,
                role: "bot",
                content: "Hello! I'm your Palm News assistant. Ask me anything about the latest news!",
                timestamp: new Date()
            }
        ])
    }

    // Animation variants
    const chatWindowVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.3 }
        },
        exit: {
            opacity: 0,
            y: 20,
            scale: 0.95,
            transition: { duration: 0.2 }
        }
    }

    const bubbleVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3 }
        }
    }

    return (
        <>
            {/* Floating button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-red-600 text-white shadow-lg flex items-center justify-center hover:bg-red-700 transition-all z-40 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
            >
                <Bot size={24} />
            </button>

            {/* Chat window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed bottom-6 right-6 w-full max-w-md h-[70vh] max-h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50"
                        variants={chatWindowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Header */}
                        <div className="bg-red-600 text-white p-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <Bot size={20} className="mr-2" />
                                <h3 className="font-semibold">Palm News Assistant</h3>
                            </div>
                            <div className="flex items-center">
                                <button
                                    onClick={clearChat}
                                    className="p-1.5 rounded-full hover:bg-red-500 transition-colors mr-1"
                                    title="Clear chat"
                                >
                                    <ArrowUp size={16} />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 rounded-full hover:bg-red-500 transition-colors"
                                >
                                    <XCircle size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Messages area */}
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                            {messages.map(message => (
                                <motion.div
                                    key={message.id}
                                    variants={bubbleVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'user' ? 'bg-gray-200 ml-2' : 'bg-red-100 mr-2'
                                            }`}>
                                            {message.role === 'user' ? (
                                                <UserIcon size={16} className="text-gray-700" />
                                            ) : (
                                                <Sparkles size={16} className="text-red-600" />
                                            )}
                                        </div>
                                        <div className={`rounded-2xl p-3 px-4 ${message.role === 'user'
                                            ? 'bg-red-600 text-white'
                                            : message.isError
                                                ? 'bg-red-50 text-red-700 border border-red-100'
                                                : 'bg-white text-gray-800 shadow-sm'
                                            }`}>
                                            <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                                            <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-red-100' : 'text-gray-400'
                                                }`}>
                                                {formatTime(message.timestamp)}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start mb-4">
                                    <div className="flex">
                                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-2">
                                            <Sparkles size={16} className="text-red-600" />
                                        </div>
                                        <div className="bg-white rounded-2xl p-4 shadow-sm">
                                            <div className="flex space-x-2">
                                                <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input area */}
                        <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 bg-white">
                            <div className="flex items-center">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about the latest news..."
                                    className="flex-1 py-2 px-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-red-600/50"
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className={`ml-2 w-10 h-10 rounded-full flex items-center justify-center ${!input.trim() || isLoading
                                        ? 'bg-gray-200 text-gray-400'
                                        : 'bg-red-600 text-white hover:bg-red-700'
                                        } transition-colors`}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}