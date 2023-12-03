import React, { useState } from "react" // React core imports
import { inventoryData } from "../data/inventory" // Custom data imports
import Image from "next/image" // Next.js Image component
import Paginate from "../components/paginate"
import { Tooltip } from "react-tooltip"

const pageSize = 10 // Constant for pagination size

// Function to map indentation level to Tailwind padding class
const getPaddingClass = (level) => {
  switch (level) {
    case 0:
      return "pl-0"
    case 1:
      return "pl-10"
    case 2:
      return "pl-20"
    // Add more cases as needed
    default:
      return "pl-0"
  }
}

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
        "description",
        "active",
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
      />
      {/* Pagination controls */}
      {pageSize < totalPages && (
        <Paginate
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      )}
    </div>
  )
}

// Table component for displaying inventory data
const Table = ({ columnHeaders, sortedData, handleSort }) => (
  <table className="min-w-full">
    <thead className="bg-zinc-800 text-left">
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
      {sortedData.map((item) => (
        <ItemRow
          key={item.id} // Unique key based on item id and current page
          item={item}
          columnHeaders={columnHeaders}
        />
      ))}
    </tbody>
  </table>
)

// PaginationControls component for navigating pages

// ItemRow component for rendering each row of the table
const ItemRow = ({ item, level = 0, columnHeaders }) => {
  const [showPrimaryVariants, setShowPrimaryVariants] = useState(false)

  return (
    <>
      <tr onClick={() => setShowPrimaryVariants(!showPrimaryVariants)}>
        {columnHeaders.map((header, index) => (
          <td
            key={header}
            className={`p-4 py-2 border-b ${
              index === 0 ? getPaddingClass(level) : ""
            } ${
              header === "active"
                ? item[header]
                  ? " opacity-100"
                  : " opacity-50"
                : ""
            }`}
          >
            {header === "title" ? (
              <>
                {item[header]}
                {item.description && (
                  <>
                    <a
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content={item.description}
                    >
                      TT
                    </a>
                    <Tooltip place="bottom" style={{ maxWidth: "15rem" }} id="my-tooltip" />
                  </>
                )}
              </>
            ) : header === "image" && item[header] ? (
              <Image
                src={item[header]}
                alt={item.title || "Item Image"}
                width={50}
                height={50}
              />
            ) : (
              item[header]
            )}
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
            className={`px-4 py-2 border-b ${
              index === 0 ? getPaddingClass(level) : ""
            }`}
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
