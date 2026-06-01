import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { GraduationCap, LogOut, BarChart3, Target, Trophy, Send, Bot, ArrowRight } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import ThemeToggle from "../components/ThemeToggle"
import axios from "axios"
import toast from "react-hot-toast"

const Dashboard = () => {
    const { user, token, logout } = useAuth()
    const navigate = useNavigate()

    const totalPredictions = parseInt(localStorage.getItem("totalPredictions") || "0")
    const lastGrade = localStorage.getItem("lastGrade") || "N/A"
    const bestModel = localStorage.getItem("bestModel") || "N/A"

    const [messages, setMessages] = useState([
        { role: "bot", text: "Hi! I'm your AI Study Assistant 🎓 Ask me anything about improving your grades!" }
    ])
    const [input, setInput] = useState("")
    const [chatLoading, setChatLoading] = useState(false)
    const chatEndRef = useRef(null)

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:3000/api/auth/logout", {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
        } catch (err) { }
        logout()
        toast.success("Logged out successfully!")
        navigate("/")
    }

   const sendMessage = async () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "user", text: userMsg }])
    setChatLoading(true)

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [
                    {
                        role: "user",
                        content: `You are a helpful study assistant. Give short practical study tips. Student asks: ${userMsg}`
                    }
                ],
                max_tokens: 200,
                temperature: 0.7
            })
        })
        const data = await response.json()
        console.log("Groq Response:", data)

        if (data.error) {
            throw new Error(data.error.message)
        }

        const text = data.choices?.[0]?.message?.content || "No response!"
        setMessages(prev => [...prev, { role: "bot", text }])
    } catch (err) {
        console.log("Groq Error:", err)
        setMessages(prev => [...prev, {
            role: "bot",
            text: "Sorry, something went wrong!"
        }])
    } finally {
        setChatLoading(false)
    }
}
const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        sendMessage()
    }
}

    const stats = [
        {
            icon: <Target className="text-indigo-600 dark:text-indigo-400" size={22} />,
            label: "Total Predictions",
            value: totalPredictions,
            bg: "bg-indigo-50 dark:bg-indigo-900/30"
        },
        {
            icon: <BarChart3 className="text-purple-600 dark:text-purple-400" size={22} />,
            label: "Last Grade",
            value: lastGrade,
            bg: "bg-purple-50 dark:bg-purple-900/30"
        },
        {
            icon: <Trophy className="text-yellow-600 dark:text-yellow-400" size={22} />,
            label: "Best Model",
            value: bestModel,
            bg: "bg-yellow-50 dark:bg-yellow-900/30"
        },
    ]

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

            {/* Navbar */}
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <GraduationCap className="text-indigo-600" size={26} />
                    <span className="font-bold text-lg text-gray-800 dark:text-white">GradePredictor</span>
                </div>
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition text-sm font-medium"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-6 py-8">

                {/* Welcome */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        👋 Welcome back, {user?.username}!
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Track your predictions and get AI study tips
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                    {stats.map((s) => (
                        <div key={s.label} className={`${s.bg} rounded-2xl p-5 border border-gray-100 dark:border-gray-700`}>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm">
                                    {s.icon}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{s.label}</p>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Chatbot */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm mb-8">
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                        <div className="w-9 h-9 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center">
                            <Bot className="text-indigo-600 dark:text-indigo-400" size={20} />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800 dark:text-white">AI Study Assistant</p>
                            <p className="text-xs text-gray-400">Powered by Groq AI</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="h-72 overflow-y-auto px-6 py-4 space-y-4">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                                    ? "bg-indigo-600 text-white rounded-br-none"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none"
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {chatLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-2xl rounded-bl-none">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input */}
                    <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask a study tip..."
                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={chatLoading || !input.trim()}
                            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl transition"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>

                {/* Start Prediction */}
                <button
                    onClick={() => navigate("/predict")}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none"
                >
                    <GraduationCap size={22} />
                    Start New Prediction
                    <ArrowRight size={18} />
                </button>
            </div>
        </div>
    )
}

export default Dashboard