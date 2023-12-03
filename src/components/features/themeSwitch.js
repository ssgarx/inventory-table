import { useTheme } from "next-themes"
import React from "react"
import Svg from "../svg"

export default function ThemeSwitch() {
  const { setTheme, theme } = useTheme()

  // Function to create a theme toggle button
  const createThemeToggleButton = (targetTheme, label, iconName, iconColor) => {
    const isActive = theme === targetTheme
    const buttonClass = isActive
      ? "bg-zinc-800 text-zinc-50 px-2 py-1 rounded-md flex justify-center items-center gap-2"
      : "px-2 py-1 rounded-md flex justify-center items-center gap-2"

    return (
      <button className={buttonClass} onClick={() => setTheme(targetTheme)}>
        <div>{label}</div>
        {isActive && (
          <Svg
            className={`w-4 animate-loadFadeUp ${iconColor}`}
            name={iconName}
          />
        )}
      </button>
    )
  }

  return (
    <div className="flex justify-between w-fit px-2 py-2 gap-2 rounded-md">
      {createThemeToggleButton("light", "Light Mode", "sun", "text-yellow-200")}
      {createThemeToggleButton("dark", "Dark Mode", "moon", "text-blue-200")}
    </div>
  )
}
