import { useLocation, useNavigate } from "react-router-dom"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { GraduationCap, RotateCcw, Home, Trophy, Target, Brain } from "lucide-react"
import ThemeToggle from "../components/ThemeToggle"

const gradeConfig = {
    A: { color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300", message: "Excellent Performance! 🌟", border: "border-green-400" },
    B: { color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300", message: "Good Job! Keep it up! 💪", border: "border-blue-400" },
    C: { color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300", message: "Average — Push a bit more! 📚", border: "border-yellow-400" },
    D: { color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300", message: "Needs Serious Attention! ⚠️", border: "border-red-400" },
}

const PIE_COLORS = ["#4F46E5", "#7C3AED", "#10B981"]

const Result = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const result = location.state?.result

    if (!result) {
        navigate("/predict")
        return null
    }

    const { decision_tree, svm, random_forest, accuracies } = result

    // Final grade — majority voting
    const grades = [decision_tree.grade, svm.grade, random_forest.grade]
    const finalGrade = grades.sort((a, b) =>
        grades.filter(v => v === a).length - grades.filter(v => v === b).length
    ).pop()

    const config = gradeConfig[finalGrade] || gradeConfig["C"]

    // Bar chart data
    const barData = [
        { model: "Decision Tree", accuracy: accuracies["Decision Tree"] },
        { model: "SVM", accuracy: accuracies["SVM"] },
        { model: "Random Forest", accuracy: accuracies["Random Forest"] },
    ]

    // Pie chart data
    const pieData = [
        { name: "Decision Tree", value: decision_tree.confidence },
        { name: "SVM", value: svm.confidence },
        { name: "Random Forest", value: random_forest.confidence },
    ]

   const models = [
    { name: "Decision Tree", icon: <Target size={18} />, grade: decision_tree.grade, confidence: decision_tree.confidence, accuracy: accuracies["Decision Tree"] },
    { name: "SVM", icon: <Brain size={18} />, grade: svm.grade, confidence: svm.confidence, accuracy: accuracies["SVM"] },
    { name: "Random Forest", icon: <Trophy size={18} />, grade: random_forest.grade, confidence: random_forest.confidence, accuracy: accuracies["Random Forest"] },
]

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

            {/* Navbar */}
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/dashboard")}>
                    <GraduationCap className="text-indigo-600" size={26} />
                    <span className="font-bold text-lg text-gray-800 dark:text-white">GradePredictor</span>
                </div>
                <ThemeToggle />
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-10">

                {/* Final Grade Card */}
                <div className={`bg-white dark:bg-gray-800 rounded-2xl border-2 ${config.border} shadow-lg p-8 text-center mb-8`}>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Your Predicted Grade</p>
                    <div className={`inline-flex items-center justify-center w-28 h-28 rounded-full text-6xl font-bold mb-4 ${config.color}`}>
                        {finalGrade}
                    </div>
                    <p className="text-xl font-semibold text-gray-800 dark:text-white">{config.message}</p>
                </div>

                {/* 3 Models Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                    {models.map((m) => {
                        const mc = gradeConfig[m.grade] || gradeConfig["C"]
                        return (
                            <div key={m.name} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 text-center shadow-sm">
                                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-3">
                                    {m.icon}
                                </div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{m.name}</p>
                                <span className={`inline-block px-4 py-1 rounded-full text-lg font-bold mb-2 ${mc.color}`}>
                                    {m.grade}
                                </span>
                                <p className="text-xs text-gray-400">Confidence: {m.confidence}%</p>
                            </div>
                        )
                    })}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

                    {/* Bar Chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                        <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Model Accuracy Comparison</h3>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="model" tick={{ fontSize: 11 }} />
                                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                                <Tooltip formatter={(val) => `${val}%`} />
                                <Bar dataKey="accuracy" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Pie Chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                        <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Confidence Distribution</h3>
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={85}
                                    paddingAngle={4}
                                    dataKey="value"
                                >
                                    {pieData.map((_, i) => (
                                        <Cell key={i} fill={PIE_COLORS[i]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(val) => `${val}%`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition font-medium"
                    >
                        <Home size={18} />
                        Dashboard
                    </button>
                    <button
                        onClick={() => navigate("/predict")}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition"
                    >
                        <RotateCcw size={18} />
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Result