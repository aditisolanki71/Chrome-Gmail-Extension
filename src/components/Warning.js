import React from "react";
import WarningHighlight from "./WarningHighlights";
const YPOS_ADJUSTMENT = 3;
export function calculateCoords(parentRect, rect) {
  return parentRect && rect
    ? {
        top: rect.top - parentRect.top + rect.height,
        left: rect.left - parentRect.left,
      }
    : undefined;
}

export function getHighlight(rect, coord) {
  return rect && coord
    ? {
        style: {
          top: `${coord.top - YPOS_ADJUSTMENT}px`,
          left: `${coord.left}px`,
          width: `${rect.width}px`,
          height: `${rect.height * 0.2}px`,
          zIndex: 10,
          position: "absolute",
          padding: "0px",
          color: "green",
          border: "1px solid blue",
        },
        position: coord.top <= 200 ? "bottom" : "top",
      }
    : undefined;
}

export default function Warning(props) {
    //msg is printed from props.value.message
    console.log("warning called",props);
    const rects = props.value.rangeToHighlight.getClientRects();
  console.log("rects",rects);
    return (
        <div className="jns-warning">
        {Array.from(rects, (rect, index) => {
          const highlight = getHighlight(
            rect,
            calculateCoords(props.parentRect, rect)
          );
          return (
            <WarningHighlight
              link={props.value.link}
              message={props.value.message}
              position={highlight.position}
              styles={highlight.style}
              key={index}
              email={props?.email}
            />
          );
        })}
      </div>
    )
}
