import React from "react"

export default function Svg({
  name,
  className,
  fill,
  currentColor,
  strokeWidth,
}) {
  switch (name) {
    case "checvron-up":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={fill || "none"}
          viewBox="0 0 24 24"
          strokeWidth={strokeWidth ?? 1.5}
          stroke={currentColor ?? "currentColor"}
          className={className || "w-6 h-6"}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 15.75l7.5-7.5 7.5 7.5"
          />
        </svg>
      )
    case "checvron-down":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={fill || "none"}
          viewBox="0 0 24 24"
          strokeWidth={strokeWidth ?? 1.5}
          stroke={currentColor ?? "currentColor"}
          className={className || "w-6 h-6"}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      )
    case "pencil":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={fill || "none"}
          viewBox="0 0 24 24"
          strokeWidth={strokeWidth ?? 1.5}
          stroke={currentColor ?? "currentColor"}
          className={className || "w-6 h-6"}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
          />
        </svg>
      )
    case "info":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={fill || "none"}
          viewBox="0 0 24 24"
          strokeWidth={strokeWidth ?? 1.5}
          stroke={currentColor ?? "currentColor"}
          className={className || "w-6 h-6"}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
          />
        </svg>
      )
    case "sun":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={fill || "none"}
          viewBox="0 0 24 24"
          strokeWidth={strokeWidth ?? 1.5}
          stroke={currentColor ?? "currentColor"}
          className={className || "w-6 h-6"}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
          />
        </svg>
      )
    case "moon":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={fill || "none"}
          viewBox="0 0 24 24"
          strokeWidth={strokeWidth ?? 1.5}
          stroke={currentColor ?? "currentColor"}
          className={className || "w-6 h-6"}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
          />
        </svg>
      )
    case "chevron-double-left":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={fill || "none"}
          viewBox="0 0 24 24"
          strokeWidth={strokeWidth ?? 1.5}
          stroke={currentColor ?? "currentColor"}
          className={className || "w-6 h-6"}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
          />
        </svg>
      )
    case "chevron-double-right":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={fill || "none"}
          viewBox="0 0 24 24"
          strokeWidth={strokeWidth ?? 1.5}
          stroke={currentColor ?? "currentColor"}
          className={className || "w-6 h-6"}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
          />
        </svg>
      )
    case "chevron-left":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={fill || "none"}
          viewBox="0 0 24 24"
          strokeWidth={strokeWidth ?? 1.5}
          stroke={currentColor ?? "currentColor"}
          className={className || "w-6 h-6"}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      )
    case "chevron-right":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={fill || "none"}
          viewBox="0 0 24 24"
          strokeWidth={strokeWidth ?? 1.5}
          stroke={currentColor ?? "currentColor"}
          className={className || "w-6 h-6"}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      )

    default:
      null
  }
}
