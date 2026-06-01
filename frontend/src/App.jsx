import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { ThemeProvider } from "./context/ThemeContext"

import Welcome from "./pages/Welcome"
import Register from "./pages/Register"
import OtpVerify from "./pages/OtpVerify"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import PredictionForm from "./pages/PredictionForm"
import Result from "./pages/Result"

const ProtectedRoute = ({ children }) => {
    const { token, loading } = useAuth()
    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
        </div>
    )
    return token ? children : <Navigate to="/login" />
}

const PublicRoute = ({ children }) => {
    const { token } = useAuth()
    return token ? <Navigate to="/dashboard" /> : children
}

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<PublicRoute><Welcome /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/verify-otp" element={<PublicRoute><OtpVerify /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/predict" element={<ProtectedRoute><PredictionForm /></ProtectedRoute>} />
            <Route path="/result" element={<ProtectedRoute><Result /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    )
}

const App = () => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <BrowserRouter>
                    <Toaster position="top-right" />
                    <AppRoutes />
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    )
}

export default App