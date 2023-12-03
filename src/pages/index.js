// React and State Management
import React, { useState, useEffect } from "react"

// Custom Components and Data
import Paginate from "../components/paginate"
import HeadlessTooltip from "../components/headlessTooltip"
import { inventoryData } from "../data/inventory"

// Utilities and Styles
import {
  filterColumnHeaders,
  getPaddingClass,
  isNullOrEmpty,
  sortData,
} from "../utils"
import Image from "next/image"
import { fetchInventoryData } from "../network.js"

const pageSize = 10

export default function Index() {
  // State management
  const [data, setData] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" })

  // Fetch and update data
  useEffect(() => {
    const fetchData = async () => {
      const initialData = JSON.parse(sessionStorage.getItem("editedData"))
      if (initialData) {
        setData(initialData)
        return
      }

      try {
        const fetchedData = await fetchInventoryData()
        console.log("fetchedData", fetchedData)
        const newData = fetchedData || []
        setData(newData)
        if (!isNullOrEmpty(newData)) {
          sessionStorage.setItem("editedData", JSON.stringify(newData))
        }
      } catch (error) {
        console.error("Failed to fetch inventory data:", error)
        setData([])
      }
    }

    fetchData()
  }, [])

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page)
    setSortConfig({ key: null, direction: "asc" })
  }

  // Handle sorting
  const handleSort = (key) => {
    const newDirection =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc"
    setSortConfig({ key, direction: newDirection })
  }

  // Handle edit and save
  const handleEditSave = (editedRowData) => {
    const updatedData = data.map((item) =>
      item.id === editedRowData.id ? editedRowData : item
    )
    setData(updatedData)
    sessionStorage.setItem("editedData", JSON.stringify(updatedData))
  }

  // Render loading or no data scenarios
  if (!data) return <div>Loading...</div>
  if (isNullOrEmpty(data)) return <div>No data</div>

  // Data processing for table display
  const columnHeaders = filterColumnHeaders(data)
  const totalPages = Math.ceil(data.length / pageSize)
  const startItem = (currentPage - 1) * pageSize
  const endItem = Math.min(currentPage * pageSize, data.length)
  const currentData = data.slice(startItem, endItem)
  const sortedCurrentData = sortData(currentData, sortConfig)

  // Rendering main component
  return (
    <div>
      <Table
        columnHeaders={columnHeaders}
        sortedData={sortedCurrentData}
        handleSort={handleSort}
        handleEditSave={handleEditSave}
      />
      {pageSize < data.length && (
        <Paginate
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      )}
    </div>
  )
}
const Table = ({ columnHeaders, sortedData, handleSort, handleEditSave }) => (
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
          key={item.id}
          item={item}
          columnHeaders={columnHeaders}
          handleEditSave={handleEditSave}
        />
      ))}
    </tbody>
  </table>
)

const ItemRow = ({ item, level = 0, columnHeaders, handleEditSave }) => {
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
                <CellContent
                  content={item[header]}
                  handleEditSave={handleEditSave}
                  dataItem={item}
                  dataItemKey={header}
                />
                {item.description && (
                  <HeadlessTooltip content={item.description} id="my-tooltip">
                    <a>TT</a>
                  </HeadlessTooltip>
                )}
              </>
            ) : header === "image" && item[header] ? (
              <CellContent
                content={item[header]}
                isImage
                handleEditSave={handleEditSave}
                dataItem={item}
                dataItemKey={header}
              />
            ) : (
              <CellContent
                content={item[header]}
                handleEditSave={handleEditSave}
                dataItem={item}
                dataItemKey={header}
              />
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
            dataItem={item}
            dataItemKey={index}
            handleEditSave={handleEditSave}
          />
        ))}
    </>
  )
}

const ItemRowWithSecondary = ({
  item,
  level,
  columnHeaders,
  dataItem,
  dataItemKey,
  handleEditSave,
}) => {
  const [showSecondaryVariants, setShowSecondaryVariants] = useState(false)
  const adjustedItem = { ...item, title: item.name }

  const handlePrimaryVariantEdit = (editedRowData) => {
    const editedData = { ...dataItem }
    editedData.primary_variants[dataItemKey] = {
      ...editedRowData,
      name: editedRowData.title,
    }
    handleEditSave(editedData)
  }
  const handleSecondaryVariantEdit = (editedRowData, orderIndex) => {
    const editedData = { ...dataItem }
    editedData.primary_variants[dataItemKey].secondary_variants[orderIndex] = {
      ...editedRowData,
      name: editedRowData.title,
    }
    handleEditSave(editedData)
  }

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
            <CellContent
              content={adjustedItem[header]}
              dataItem={adjustedItem}
              dataItemKey={header}
              handleEditSave={handlePrimaryVariantEdit}
            />
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
            dataItem={item}
            dataItemKey={index}
            handleEditSave={(editedObj) =>
              handleSecondaryVariantEdit(editedObj, index)
            }
          />
        ))}
    </>
  )
}

const CellContent = ({
  content,
  isImage,
  handleEditSave,
  dataItem,
  dataItemKey,
  type,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(content)

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleSaveClick = () => {
    // Handle the save logic here
    // For now, it just turns off the editing mode
    setIsEditing(false)
    const editedItem = { ...dataItem }
    editedItem[dataItemKey] = inputValue
    handleEditSave(editedItem)
  }

  return (
    <div className="relative group">
      {!isEditing && (
        <span
          className="absolute -top-0 -left-2 cursor-pointer hidden group-hover:block"
          onClick={handleEditClick}
        >
          e
        </span>
      )}
      {isEditing ? (
        <div>
          <input
            type={typeof inputValue === "string" ? "text" : "number"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="bg-zinc-600 px-2 py-1"
          />
          <button className="bg-zinc-400" onClick={handleSaveClick}>
            Save
          </button>
        </div>
      ) : isImage ? (
        <Image
          className=""
          src={content}
          alt="Item Image"
          width={50}
          height={50}
        />
      ) : (
        <div className="">{content}</div>
      )}
    </div>
  )
}
