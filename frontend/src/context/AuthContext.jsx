import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)  // ✅ null se shuru karo
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedToken = localStorage.getItem("token")
        const storedUser = localStorage.getItem("user")

        if (storedToken && storedUser) {
            setToken(storedToken)           // ✅ effect mein set karo
            setUser(JSON.parse(storedUser))
        }
        setLoading(false)  // ✅ sab set hone ke baad loading false
    }, [])

    const login = (userData, authToken) => {
        setUser(userData)
        setToken(authToken)
        localStorage.setItem("token", authToken)
        localStorage.setItem("user", JSON.stringify(userData))
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("lastGrade")
        localStorage.removeItem("totalPredictions")
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)