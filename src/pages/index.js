import React, { useState } from "react" // React core imports
import { inventoryData } from "../data/inventory" // Custom data imports
import Image from "next/image" // Next.js Image component

const pageSize = 5 // Constant for pagination size

// Index: Main component for rendering table, handling pagination and sorting
const Index = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" })

  // Filter out unwanted columns from inventoryData
  const columnHeaders = Object.keys(inventoryData[0] || {}).filter(
    (key) =>
      ![
        "primary_variants",
        "secondary_variants",
        "id",
        "primary_variant_name",
        "secondary_variant_name",
      ].includes(key)
  )

  const totalPages = Math.ceil(inventoryData.length / pageSize)

  // Handle page change and reset sorting
  const handlePageChange = (page) => {
    setCurrentPage(page)
    setSortConfig({ key: null, direction: "asc" })
  }

  // Handle sorting by column
  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc"
    setSortConfig({ key, direction })
  }

  // Function to sort data based on configuration
  const sortedData = (currentData) => {
    if (!sortConfig.key) return currentData
    return [...currentData].sort((a, b) => {
      const [aValue, bValue] = [a[sortConfig.key], b[sortConfig.key]]
      const isStringCompare =
        typeof aValue === "string" && typeof bValue === "string"
      const compareResult = isStringCompare
        ? aValue.localeCompare(bValue)
        : aValue - bValue
      return sortConfig.direction === "asc" ? compareResult : -compareResult
    })
  }

  // Calculate the current data slice for the table
  const startItem = (currentPage - 1) * pageSize
  const endItem = Math.min(currentPage * pageSize, inventoryData.length)
  const currentData = inventoryData.slice(startItem, endItem)
  const sortedCurrentData = sortedData(currentData)

  // Main table rendering
  return (
    <div>
      {/* Table for inventory data */}
      <Table
        columnHeaders={columnHeaders}
        sortedData={sortedCurrentData}
        handleSort={handleSort}
        currentPage={currentPage} // Pass currentPage as a prop to Table
      />
      {/* Pagination controls */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />
    </div>
  )
}

// Table component for displaying inventory data
const Table = ({ columnHeaders, sortedData, handleSort, currentPage }) => (
  <table className="min-w-full">
    <thead className="bg-zinc-800">
      <tr>
        {columnHeaders.map((header, index) => (
          <th
            key={index}
            className="px-4 py-2"
            onClick={() => handleSort(header)}
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {sortedData.map((item, index) => (
        <ItemRow
          key={`${item.id}-${currentPage}`} // Unique key based on item id and current page
          item={item}
          columnHeaders={columnHeaders}
        />
      ))}
    </tbody>
  </table>
)

// PaginationControls component for navigating pages
const PaginationControls = ({ currentPage, totalPages, handlePageChange }) => (
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

// ItemRow component for rendering each row of the table
const ItemRow = ({ item, level = 0, columnHeaders }) => {
  const [showPrimaryVariants, setShowPrimaryVariants] = useState(false)

  return (
    <>
      <tr onClick={() => setShowPrimaryVariants(!showPrimaryVariants)}>
        {columnHeaders.map((header, index) => (
          <td
            key={header}
            className="px-4 py-2 border-b"
            style={index === 0 ? { paddingLeft: `${level * 20}px` } : {}}
          >
            {renderCellContent(item, header)}
          </td>
        ))}
      </tr>
      {/* Conditionally rendered rows for primary variants */}
      {showPrimaryVariants &&
        item.primary_variants &&
        item.primary_variants.map((primaryVariant, index) => (
          <ItemRowWithSecondary
            key={index}
            item={primaryVariant}
            level={level + 1}
            columnHeaders={columnHeaders}
          />
        ))}
    </>
  )
}

// Helper function to render cell content based on item and header
const renderCellContent = (item, header) => {
  if (header === "image" && item[header]) {
    return (
      <Image
        src={item[header]}
        alt={item.title || "Item Image"}
        width={50}
        height={50}
      />
    )
  }
  return typeof item[header] === "boolean"
    ? item[header]
      ? "yes"
      : "no"
    : item[header]
}

// Component for rendering rows with secondary variants
const ItemRowWithSecondary = ({ item, level, columnHeaders }) => {
  const [showSecondaryVariants, setShowSecondaryVariants] = useState(false)
  const adjustedItem = { ...item, title: item.name }

  return (
    <>
      <tr onClick={() => setShowSecondaryVariants(!showSecondaryVariants)}>
        {columnHeaders.map((header, index) => (
          <td
            key={header}
            className="px-4 py-2 border-b"
            style={index === 0 ? { paddingLeft: `${level * 20}px` } : {}}
          >
            {adjustedItem[header]}
          </td>
        ))}
      </tr>
      {/* Conditionally rendered rows for secondary variants */}
      {showSecondaryVariants &&
        item.secondary_variants &&
        item.secondary_variants.map((secondaryVariant, index) => (
          <ItemRow
            key={index}
            item={{ ...secondaryVariant, title: secondaryVariant.name }}
            level={level + 1}
            columnHeaders={columnHeaders}
          />
        ))}
    </>
  )
}

export default Index
