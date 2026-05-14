import React, { createContext, useContext, useEffect, useState } from "react"

interface ThemeContextType {
  theme: "light" | "dark"
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    // Only access localStorage in browser environment
    if (typeof window === "undefined") {
      return "light"
    }

    // Try to read from localStorage
    const savedTheme = localStorage.getItem("theme-preference")
    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme
    }

    // Fall back to system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark"
    }

    // Default to light
    return "light"
  })

  useEffect(() => {
    // Apply or remove .dark class to document.documentElement
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    // Persist to localStorage
    localStorage.setItem("theme-preference", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
