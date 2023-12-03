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
  return (
    <div className="flex justify-end space-x-8">
      <button
        className={buttonClass}
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
      >
        <Svg className={iconClass} name="chevron-double-left" />
      </button>
      <button
        className={buttonClass}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <Svg className={iconClass} name="chevron-left" />
      </button>
      <button
        className={buttonClass}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        <Svg className={iconClass} name="chevron-right" />
      </button>
      <button
        className={buttonClass}
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage >= totalPages}
      >
        <Svg className={iconClass} name="chevron-double-right" />
      </button>
    </div>
  )
}
