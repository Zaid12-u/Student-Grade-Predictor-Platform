import { useNavigate } from "react-router-dom"
import { GraduationCap, Brain, BarChart3, Shield, ArrowRight, BookOpen, Target, Sparkles } from "lucide-react"
import ThemeToggle from "../components/ThemeToggle"

const Welcome = () => {
    const navigate = useNavigate()

    const features = [
        { icon: <Brain size={22} />, title: "AI Powered", desc: "3 ML models predict your grade" },
        { icon: <BarChart3 size={22} />, title: "Visual Results", desc: "Charts & detailed comparison" },
        { icon: <Shield size={22} />, title: "Secure Login", desc: "OTP based authentication" },
        { icon: <Sparkles size={22} />, title: "Study Bot", desc: "AI tips to improve grades" },
    ]

    const steps = [
        { icon: <BookOpen size={20} />, step: "01", title: "Register", desc: "Create your account" },
        { icon: <Target size={20} />, step: "02", title: "Fill Form", desc: "Enter your study details" },
        { icon: <BarChart3 size={20} />, step: "03", title: "Get Grade", desc: "AI predicts your result" },
        { icon: <Sparkles size={20} />, step: "04", title: "Improve", desc: "Follow AI study tips" },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">

            {/* Navbar */}
            <nav className="flex items-center justify-between px-8 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <GraduationCap className="text-indigo-600" size={28} />
                    <span className="font-bold text-xl text-gray-800 dark:text-white">GradePredictor</span>
                </div>
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <button
                        onClick={() => navigate("/login")}
                        className="px-4 py-2 text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-lg transition"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate("/register")}
                        className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
                    >
                        Register
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="max-w-6xl mx-auto px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* Left Side */}
                <div>
                    <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                        <Sparkles size={14} />
                        AI Powered Grade Prediction
                    </div>
                    <h1 className="text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                        Predict Your
                        <span className="text-indigo-600"> Academic </span>
                        Future
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                        Know your expected grade before exams using 3 powerful ML models.
                        Get personalized AI study tips to improve your performance.
                    </p>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/register")}
                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                        >
                            Get Started
                            <ArrowRight size={18} />
                        </button>
                        <button
                            onClick={() => navigate("/login")}
                            className="px-6 py-3 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition"
                        >
                            Already have account?
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-8 mt-12">
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">ML Models</p>
                        </div>
                        <div className="w-px h-10 bg-gray-200 dark:bg-gray-600" />
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">74%</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Accuracy</p>
                        </div>
                        <div className="w-px h-10 bg-gray-200 dark:bg-gray-600" />
                        <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">8K+</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Students Data</p>
                        </div>
                    </div>
                </div>

                {/* Right Side — Visual Card */}
                <div className="hidden lg:flex justify-center">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-80 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                                <GraduationCap className="text-indigo-600 dark:text-indigo-400" size={20} />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-white">Grade Prediction</p>
                                <p className="text-xs text-gray-400">AI Analysis Complete</p>
                            </div>
                        </div>

                        {/* Grade Result Preview */}
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white text-center mb-4">
                            <p className="text-sm opacity-80 mb-1">Predicted Grade</p>
                            <p className="text-6xl font-bold">A</p>
                            <p className="text-sm opacity-80 mt-1">Excellent Performance!</p>
                        </div>

                        {/* Model Results Preview */}
                        {[
                            { name: "Random Forest", grade: "A", conf: "88%", color: "bg-green-100 text-green-700" },
                            { name: "SVM", grade: "A", conf: "79%", color: "bg-blue-100 text-blue-700" },
                            { name: "Decision Tree", grade: "B", conf: "72%", color: "bg-yellow-100 text-yellow-700" },
                        ].map((m) => (
                            <div key={m.name} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                                <p className="text-sm text-gray-600 dark:text-gray-300">{m.name}</p>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m.color}`}>{m.grade}</span>
                                    <span className="text-xs text-gray-400">{m.conf}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-6xl mx-auto px-8 py-16">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Why GradePredictor?</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-10">Everything you need to stay ahead academically</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((f) => (
                        <div key={f.title} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
                            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                                {f.icon}
                            </div>
                            <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{f.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* How It Works */}
            <div className="max-w-6xl mx-auto px-8 py-16">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">How It Works</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-10">Simple steps to predict your grade</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((s, i) => (
                        <div key={s.step} className="relative">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
                                <p className="text-4xl font-bold text-indigo-100 dark:text-indigo-900 mb-3">{s.step}</p>
                                <div className="text-indigo-600 dark:text-indigo-400 mb-2">{s.icon}</div>
                                <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{s.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{s.desc}</p>
                            </div>
                            {i < steps.length - 1 && (
                                <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-indigo-300 z-10" size={20} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-gray-100 dark:border-gray-700 py-8 text-center text-gray-400 text-sm">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <GraduationCap className="text-indigo-400" size={18} />
                    <span className="font-medium text-gray-600 dark:text-gray-300">GradePredictor</span>
                </div>
                <p>Built with React + FastAPI + Machine Learning</p>
            </footer>
        </div>
    )
}

export default Welcome