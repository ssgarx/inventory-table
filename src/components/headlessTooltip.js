import React from "react"
import { Tooltip } from "react-tooltip"

export default function HeadlessTooltip({
  children,
  content,
  id,
  place = "bottom",
  style = { maxWidth: "15rem" },
}) {
  return (
    <>
      {React.cloneElement(children, {
        "data-tooltip-id": id,
        "data-tooltip-content": content,
      })}
      <Tooltip place={place} style={style} id={id} />
    </>
  )
}
