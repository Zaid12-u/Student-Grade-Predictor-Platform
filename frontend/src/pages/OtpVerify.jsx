import { useState, useRef, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { GraduationCap, Mail } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"
import ThemeToggle from "../components/ThemeToggle"

const OtpVerify = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state?.email || ""
    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [loading, setLoading] = useState(false)
    const inputs = useRef([])

    useEffect(() => {
        if (!email) navigate("/register")
        inputs.current[0]?.focus()
    }, [])

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return
        const newOtp = [...otp]
        newOtp[index] = value.slice(-1)
        setOtp(newOtp)
        if (value && index < 5) {
            inputs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputs.current[index - 1]?.focus()
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const otpCode = otp.join("")
        if (otpCode.length < 6) return toast.error("Enter complete OTP!")

        try {
            setLoading(true)
            await axios.post("http://localhost:3000/api/auth/verify-otp", {
                email,
                otp: otpCode
            })
            toast.success("Email verified! Please login.")
            navigate("/login")
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid OTP!")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 flex flex-col">

            {/* Navbar */}
            <nav className="flex items-center justify-between px-8 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-700">
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    <GraduationCap className="text-indigo-600" size={26} />
                    <span className="font-bold text-lg text-gray-800 dark:text-white">GradePredictor</span>
                </div>
                <ThemeToggle />
            </nav>

            {/* OTP Form */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Mail className="text-indigo-600 dark:text-indigo-400" size={32} />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Verify Email
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            OTP sent to{" "}
                            <span className="font-medium text-indigo-600 dark:text-indigo-400">
                                {email}
                            </span>
                        </p>
                    </div>

                    {/* Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
                        <form onSubmit={handleSubmit}>

                            {/* OTP Inputs */}
                            <div className="flex justify-center gap-3 mb-8">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputs.current[index] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-12 h-12 text-center text-xl font-bold rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                                    />
                                ))}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl transition flex items-center justify-center"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : "Verify OTP"}
                            </button>
                        </form>

                        {/* Back */}
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                            Wrong email?{" "}
                            <button
                                onClick={() => navigate("/register")}
                                className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                            >
                                Go back
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OtpVerify