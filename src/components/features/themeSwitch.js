// components/ThemeSwitch.js
import { useTheme } from "next-themes"
import React from "react"
import { joinClassNames } from "../../utils"
import Svg from "../svg"

export default function ThemeSwitch() {
  const { setTheme, theme } = useTheme() // darkMode, setDarkMode => bool

  return (
    <div className="flex justify-between w-fit px-2 py-2 gap-2 rounded-md ">
      <button
        className={joinClassNames(
          theme === "light" ? " bg-zinc-800 text-zinc-50" : "",
          "px-2 py-1 rounded-md flex justify-center items-center gap-2"
        )}
        onClick={() => setTheme("light")}
      >
        <div>Light Mode</div>
        {theme === "light" && <Svg className={"w-4 animate-loadFadeUp text-yellow-200"} name="sun" />}
      </button>
      <button
        className={joinClassNames(
          theme === "dark" ? " bg-zinc-800 text-zinc-50" : "",
          "px-2 py-1 rounded-md flex justify-center items-center gap-2"
        )}
        onClick={() => setTheme("dark")}
      >
        <div>Dark Mode</div>
        {theme === "dark" && <Svg className={"w-4 animate-loadFadeUp text-blue-200"} name="moon" />}
      </button>
    </div>
  )
}
