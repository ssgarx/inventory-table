export // Function to map indentation level to Tailwind padding class
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
// Function to filter out unwanted columns
export const filterColumnHeaders = (data) => {
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
