import { Moon02Icon, Sun03Icon } from "hugeicons-react"
import { Button } from "./ui/button"
import { useTheme } from "../contexts/ThemeContext"
import { cn } from "../lib/utils"

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn(className)}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon02Icon className="h-5 w-5" />
      ) : (
        <Sun03Icon className="h-5 w-5" />
      )}
    </Button>
  )
}
