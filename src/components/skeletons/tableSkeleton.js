import BoxSkeleton from "./boxSkeleton"

export default function TableSkeleton({ rows = 30 }) {
  const boxStyles = {
    width: "100%",
    height: 43,
  }

  return (
    <div className="p-5 w-full h-full overflow-y-hidden">
      <div className="flex flex-col gap-1">
        {/* Table Header */}
        <BoxSkeleton styles={boxStyles} />

        {/* Table Rows */}
        {[...Array(rows)].map((_, rowIndex) => (
          <div className="flex gap-1" key={rowIndex}>
            {[...Array(4)].map((_, colIndex) => (
              <BoxSkeleton key={colIndex} styles={boxStyles} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
