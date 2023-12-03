// React and State Management
import React, { useState, useEffect } from "react"

// Custom Components and Data
import Paginate from "../components/paginate"
import HeadlessTooltip from "../components/headlessTooltip"
import ThemeSwitch from "../components/features/themeSwitch"
// Utilities and Styles
import {
  filterColumnHeaders,
  getPaddingClass,
  isNullOrEmpty,
  joinClassNames,
  sortData,
} from "../utils"
import Image from "next/image"
import { fetchInventoryData } from "../network.js"
import Svg from "../components/svg"

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
    <div className="m-8 border p-4 rounded-md space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-3xl font-semibold text-primary">
            Andisor Inventory
          </p>
          <p className="text-secondary font-medium">{`${data.length} Products Present`}</p>
        </div>
        <ThemeSwitch />
      </div>
      <Table
        columnHeaders={columnHeaders}
        sortedData={sortedCurrentData}
        handleSort={handleSort}
        handleEditSave={handleEditSave}
        sortConfig={sortConfig}
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
const Table = ({
  columnHeaders,
  sortedData,
  handleSort,
  handleEditSave,
  sortConfig,
}) => (
  <table className="min-w-full">
    <thead className="bg-muted text-left ">
      <tr>
        {columnHeaders.map((header, index) => {
          const isSorted = sortConfig.key === header
          let sortIcon = null
          if (isSorted) {
            sortIcon =
              sortConfig.direction === "asc" ? "checvron-up" : "checvron-down"
          }

          return (
            <th
              key={index}
              className={joinClassNames(
                index === 0 ? "pl-[20px]" : "",
                " py-2 text-primary capitalize font-medium cursor-pointer"
              )}
              onClick={() => handleSort(header)}
            >
              <div className="flex justify-start items-center gap-2">
                <div>{header}</div>
                {sortIcon && (
                  <Svg
                    strokeWidth={2}
                    className={"w-4 text-secondary"}
                    name={sortIcon}
                  />
                )}
              </div>
            </th>
          )
        })}
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
            style={
              index === 0
                ? {
                    paddingLeft: (level + 1) * 20,
                  }
                : null
            }
            className={`pr-4 py-2 border-b ${
              header === "active"
                ? item[header]
                  ? " opacity-100"
                  : " opacity-50"
                : ""
            }`}
          >
            {header === "title" ? (
              <div className="flex justify-start items-center gap-2 ">
                <CellContent
                  content={item[header]}
                  handleEditSave={handleEditSave}
                  dataItem={item}
                  dataItemKey={header}
                />
                {item.description && (
                  <HeadlessTooltip content={item.description} id="my-tooltip">
                    <a>
                      <Svg
                        className={"w-4 mt-1 text-secondary cursor-help"}
                        name="info"
                      />
                    </a>
                  </HeadlessTooltip>
                )}
              </div>
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
            className={`pr-4 py-2 border-b `}
            style={
              index === 0
                ? {
                    paddingLeft: (level + 1) * 20,
                  }
                : null
            }
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
    <div className="relative group text-primary">
      {!isEditing && (
        <span
          className="absolute -top-0 -left-4 cursor-pointer hidden group-hover:block  "
          onClick={handleEditClick}
        >
          <Svg className={"w-4"} name="pencil" />
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
