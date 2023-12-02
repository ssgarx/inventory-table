import React, { useState } from "react" // React imports
import { dummyData, inventoryData } from "../data/inventory" // Data imports
import Image from "next/image"

// Constants
const pageSize = 5

// Main component that renders the table and handles pagination and sorting
const Index = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" })

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

  // Change page and reset sorting
  const handlePageChange = (page) => {
    setCurrentPage(page)
    setSortConfig({ key: null, direction: "asc" })
  }

  // Handle sorting logic
  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc"
    setSortConfig({ key, direction })
  }

  // Sort data based on the current sort configuration
  const sortedData = (currentData) => {
    if (!sortConfig.key) return currentData

    return [...currentData].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      return sortConfig.direction === "asc"
        ? aValue < bValue
          ? -1
          : 1
        : bValue < aValue
        ? -1
        : 1
    })
  }

  // Calculate current data slice for the table
  const startItem = (currentPage - 1) * pageSize
  const endItem = Math.min(currentPage * pageSize, inventoryData.length)
  const currentData = inventoryData.slice(startItem, endItem)
  const sortedCurrentData = sortedData(currentData)

  return (
    <div>
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
          {sortedCurrentData.map((item, index) => (
            <ItemRow
              key={item.name}
              item={item}
              columnHeaders={columnHeaders}
            />
          ))}
        </tbody>
      </table>
      <div className="flex justify-between">
        {/* Pagination buttons */}
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
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
    </div>
  )
}

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
            {header === "image" && item[header] ? (
              <Image
                src={item[header]}
                alt={item.title || "Item Image"}
                width={50}
                height={50}
              />
            ) : typeof item[header] === "boolean" ? (
              item[header] ? (
                "yes"
              ) : (
                "no"
              )
            ) : (
              item[header]
            )}
          </td>
        ))}
      </tr>
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
