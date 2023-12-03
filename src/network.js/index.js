// network.js
async function fetchInventoryData() {
  try {
    const response = await fetch(
      `https://mocki.io/v1/cf803129-9508-4b94-9baf-1be045522a65`
    )
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Fetch error:", error)
    return null
  }
}

export { fetchInventoryData }
