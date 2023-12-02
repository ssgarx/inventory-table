import React from "react"

export default function Paginate({
  currentPage,
  totalPages,
  handlePageChange,
}) {
  return (
    <div className="flex justify-between">
      <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
        First Page
      </button>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next
      </button>
      <button
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage >= totalPages}
      >
        Last Page
      </button>
    </div>
  )
}
