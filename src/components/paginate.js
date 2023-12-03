import React from "react"
import Svg from "./svg"

export default function Paginate({
  currentPage,
  totalPages,
  handlePageChange,
}) {
  const buttonClass =
    "bg-muted px-4 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
  const iconClass = "w-4 h-4"

  // Function to create a pagination button
  const createButton = (changeToPage, iconName, isDisabled) => (
    <button
      className={buttonClass}
      onClick={() => handlePageChange(changeToPage)}
      disabled={isDisabled}
    >
      <Svg className={iconClass} name={iconName} />
    </button>
  )

  // Determine if the current page is at the start or end
  const isAtStart = currentPage === 1
  const isAtEnd = currentPage >= totalPages

  return (
    <div className="flex justify-end space-x-8">
      {createButton(1, "chevron-double-left", isAtStart)}
      {createButton(currentPage - 1, "chevron-left", isAtStart)}
      {createButton(currentPage + 1, "chevron-right", isAtEnd)}
      {createButton(totalPages, "chevron-double-right", isAtEnd)}
    </div>
  )
}
