import { joinClassNames } from "../../utils"

const BoxSkeleton = ({ className = "", styles = {}, colorClass }) => (
  <div
    style={{ ...styles }}
    id="box"
    className={joinClassNames("animate-pulse", className, colorClass ?? "bg-muted")}
  />
)

export default BoxSkeleton
