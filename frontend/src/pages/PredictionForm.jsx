import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { GraduationCap, ArrowRight, ArrowLeft, User, BookOpen, Heart } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"
import ThemeToggle from "../components/ThemeToggle"

const steps = ["Personal Info", "Study Habits", "Background"]

const PredictionForm = () => {
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(0)
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        Age: "",
        Gender: "",
        Hours_Studied: "",
        Attendance: "",
        Sleep_Hours: "",
        Stress_Level: "",
        Screen_Time: "",
        Previous_GPA: "",
        Part_Time_Job: "",
        Study_Method: "",
        Diet_Quality: "",
        Internet_Quality: "",
        Extracurricular: "",
        Tutoring_Sessions_Per_Week: "",
        Family_Income_Level: "",
        Exam_Anxiety_Score: "",
    })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const encodeForm = () => ({
        Age: parseFloat(form.Age),
        Gender: form.Gender === "Female" ? 0 : 1,
        Hours_Studied: parseFloat(form.Hours_Studied),
        Attendance: parseFloat(form.Attendance),
        Sleep_Hours: parseFloat(form.Sleep_Hours),
        Stress_Level: parseFloat(form.Stress_Level),
        Screen_Time: parseFloat(form.Screen_Time),
        Previous_GPA: parseFloat(form.Previous_GPA),
        Part_Time_Job: form.Part_Time_Job === "Yes" ? 1 : 0,
        Study_Method: form.Study_Method === "Online" ? 2 : form.Study_Method === "Offline" ? 1 : 0,
        Diet_Quality: form.Diet_Quality === "Good" ? 2 : form.Diet_Quality === "Average" ? 1 : 0,
        Internet_Quality: form.Internet_Quality === "Excellent" ? 3 : form.Internet_Quality === "Good" ? 2 : form.Internet_Quality === "Average" ? 1 : 0,
        Extracurricular: form.Extracurricular === "Yes" ? 1 : 0,
        Tutoring_Sessions_Per_Week: parseInt(form.Tutoring_Sessions_Per_Week),
        Family_Income_Level: form.Family_Income_Level === "High" ? 2 : form.Family_Income_Level === "Middle" ? 1 : 0,
        Exam_Anxiety_Score: parseFloat(form.Exam_Anxiety_Score),
    })

    const validateStep = () => {
        const step0 = ["Age", "Gender", "Previous_GPA", "Exam_Anxiety_Score"]
        const step1 = ["Hours_Studied", "Attendance", "Sleep_Hours", "Stress_Level", "Screen_Time", "Study_Method", "Tutoring_Sessions_Per_Week"]
        const step2 = ["Part_Time_Job", "Diet_Quality", "Internet_Quality", "Extracurricular", "Family_Income_Level"]
        const fields = [step0, step1, step2][currentStep]
        return fields.every(f => form[f] !== "")
    }

    const handleNext = () => {
        if (!validateStep()) return toast.error("Please fill all fields!")
        setCurrentStep(prev => prev + 1)
    }

    const handleBack = () => setCurrentStep(prev => prev - 1)

    const handleSubmit = async () => {
        if (!validateStep()) return toast.error("Please fill all fields!")
        try {
            setLoading(true)
            const payload = encodeForm()
            const res = await axios.post("http://localhost:8000/predict", payload)

            const total = parseInt(localStorage.getItem("totalPredictions") || "0") + 1
            localStorage.setItem("totalPredictions", total)
            localStorage.setItem("lastGrade", res.data.random_forest.grade)
            localStorage.setItem("bestModel", "Random Forest")

            navigate("/result", { state: { result: res.data, form } })
        } catch (err) {
            toast.error("Prediction failed! Make sure ML server is running.")
        } finally {
            setLoading(false)
        }
    }

    const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
    const selectClass = inputClass

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

            <div className="max-w-2xl mx-auto px-6 py-10">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Predict Your Grade</h1>
                    <p className="text-gray-500 dark:text-gray-400">Fill in your details — {steps.length} simple steps</p>
                </div>

                {/* Stepper */}
                <div className="flex items-center justify-center mb-8">
                    {steps.map((step, i) => (
                        <div key={step} className="flex items-center">
                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                                    i < currentStep
                                        ? "bg-indigo-600 text-white"
                                        : i === currentStep
                                        ? "bg-indigo-600 text-white ring-4 ring-indigo-200"
                                        : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                                }`}>
                                    {i < currentStep ? "✓" : i + 1}
                                </div>
                                <p className={`text-xs mt-1 font-medium ${i === currentStep ? "text-indigo-600" : "text-gray-400"}`}>
                                    {step}
                                </p>
                            </div>
                            {i < steps.length - 1 && (
                                <div className={`w-16 h-0.5 mx-2 mb-4 ${i < currentStep ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-700"}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Form Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">

                    {/* Step 1 — Personal Info */}
                    {currentStep === 0 && (
                        <div className="space-y-5">
                            <div className="flex items-center gap-2 mb-6">
                                <User className="text-indigo-600" size={20} />
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Personal Information</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Age</label>
                                    <input
                                        type="text"
                                        name="Age"
                                        value={form.Age}
                                        onChange={handleChange}
                                        placeholder="e.g. 20"
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Gender</label>
                                    <select name="Gender" value={form.Gender} onChange={handleChange} className={selectClass}>
                                        <option value="">Select</option>
                                        <option>Male</option>
                                        <option>Female</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Previous GPA (0.0 - 4.0)</label>
                                    <input
                                        type="text"
                                        name="Previous_GPA"
                                        value={form.Previous_GPA}
                                        onChange={handleChange}
                                        placeholder="e.g. 3.2"
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Exam Anxiety (1-10)</label>
                                    <input
                                        type="text"
                                        name="Exam_Anxiety_Score"
                                        value={form.Exam_Anxiety_Score}
                                        onChange={handleChange}
                                        placeholder="e.g. 5"
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2 — Study Habits */}
                    {currentStep === 1 && (
                        <div className="space-y-5">
                            <div className="flex items-center gap-2 mb-6">
                                <BookOpen className="text-indigo-600" size={20} />
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Study Habits</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Hours Studied/Day</label>
                                    <input
                                        type="text"
                                        name="Hours_Studied"
                                        value={form.Hours_Studied}
                                        onChange={handleChange}
                                        placeholder="e.g. 5"
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Attendance (%)</label>
                                    <input
                                        type="text"
                                        name="Attendance"
                                        value={form.Attendance}
                                        onChange={handleChange}
                                        placeholder="e.g. 80"
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Sleep Hours/Day</label>
                                    <input
                                        type="text"
                                        name="Sleep_Hours"
                                        value={form.Sleep_Hours}
                                        onChange={handleChange}
                                        placeholder="e.g. 7"
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Stress Level (1-10)</label>
                                    <input
                                        type="text"
                                        name="Stress_Level"
                                        value={form.Stress_Level}
                                        onChange={handleChange}
                                        placeholder="e.g. 5"
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Screen Time/Day (hrs)</label>
                                    <input
                                        type="text"
                                        name="Screen_Time"
                                        value={form.Screen_Time}
                                        onChange={handleChange}
                                        placeholder="e.g. 3"
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Tutoring Sessions/Week</label>
                                    <input
                                        type="text"
                                        name="Tutoring_Sessions_Per_Week"
                                        value={form.Tutoring_Sessions_Per_Week}
                                        onChange={handleChange}
                                        placeholder="e.g. 2"
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Study Method</label>
                                <select name="Study_Method" value={form.Study_Method} onChange={handleChange} className={selectClass}>
                                    <option value="">Select</option>
                                    <option>Online</option>
                                    <option>Offline</option>
                                    <option>Hybrid</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Step 3 — Background */}
                    {currentStep === 2 && (
                        <div className="space-y-5">
                            <div className="flex items-center gap-2 mb-6">
                                <Heart className="text-indigo-600" size={20} />
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Background Info</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Part Time Job</label>
                                    <select name="Part_Time_Job" value={form.Part_Time_Job} onChange={handleChange} className={selectClass}>
                                        <option value="">Select</option>
                                        <option>Yes</option>
                                        <option>No</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Extracurricular</label>
                                    <select name="Extracurricular" value={form.Extracurricular} onChange={handleChange} className={selectClass}>
                                        <option value="">Select</option>
                                        <option>Yes</option>
                                        <option>No</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Diet Quality</label>
                                    <select name="Diet_Quality" value={form.Diet_Quality} onChange={handleChange} className={selectClass}>
                                        <option value="">Select</option>
                                        <option>Good</option>
                                        <option>Average</option>
                                        <option>Poor</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Internet Quality</label>
                                    <select name="Internet_Quality" value={form.Internet_Quality} onChange={handleChange} className={selectClass}>
                                        <option value="">Select</option>
                                        <option>Excellent</option>
                                        <option>Good</option>
                                        <option>Average</option>
                                        <option>Poor</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Family Income Level</label>
                                <select name="Family_Income_Level" value={form.Family_Income_Level} onChange={handleChange} className={selectClass}>
                                    <option value="">Select</option>
                                    <option>High</option>
                                    <option>Middle</option>
                                    <option>Low</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex items-center justify-between mt-8">
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 0}
                            className="flex items-center gap-2 px-5 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition disabled:opacity-40"
                        >
                            <ArrowLeft size={18} />
                            Back
                        </button>

                        {currentStep < steps.length - 1 ? (
                            <button
                                onClick={handleNext}
                                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition"
                            >
                                Next
                                <ArrowRight size={18} />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl transition"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>Predict Grade <ArrowRight size={18} /></>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PredictionForm