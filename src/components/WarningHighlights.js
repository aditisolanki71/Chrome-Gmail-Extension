import React from "react";
// import WarningTooltip from './WarningTooltip';
export default function Highlight(props) {
  console.log("Warning highlight",props);
return (
  <a href={props.link}>
  <div
      className="jns-highlight"
      style={props.styles}
      data-tip={props.message}
      data-place={props.position}
    >
      {/* <WarningTooltip /> */}
    </div>
    </a>
    );
}
