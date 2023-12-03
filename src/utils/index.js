export // Function to map indentation level to Tailwind padding class
const getPaddingClass = (level) => {
  switch (level) {
    case 0:
      return "pl-5"
    case 1:
      return "pl-10"
    case 2:
      return "pl-20"
    // Add more cases as needed
    default:
      return "pl-5"
  }
}
// Function to filter out unwanted columns
export const filterColumnHeaders = (data) => {
  if (!data) return
  return Object.keys(data[0] || {}).filter(
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
}

// Sorting function
export const sortData = (data, sortConfig) => {
  if (!sortConfig.key) return data
  return [...data].sort((a, b) => {
    const [aValue, bValue] = [a[sortConfig.key], b[sortConfig.key]]
    const isStringCompare =
      typeof aValue === "string" && typeof bValue === "string"
    const compareResult = isStringCompare
      ? aValue.localeCompare(bValue)
      : aValue - bValue
    return sortConfig.direction === "asc" ? compareResult : -compareResult
  })
}

export function isNullOrEmpty(testObject) {
  if (!testObject) return true
  if (testObject instanceof Array) {
    return testObject.length == 0
  }
  return Object.keys(testObject).length == 0
}

export function isEmpty(obj) {
  if (Array.isArray(obj)) {
    return obj.length == 0
  }
  return obj !== null && typeof obj === "object" && Object.keys(obj).length == 0
}