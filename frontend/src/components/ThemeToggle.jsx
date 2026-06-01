import { Sun, Moon } from "lucide-react"
import { useTheme } from "../context/ThemeContext"

const ThemeToggle = () => {
    const { darkMode, toggleTheme } = useTheme()

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
        >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    )
}

export default ThemeToggle