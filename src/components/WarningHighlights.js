import React, { useState, useEffect } from "react";

export default function Highlight(props) {
  const [links, setLinks] = useState("");

  useEffect(() => {
    if (
      props?.email?.length > 0 &&
      props?.link.includes("https://www.simform.com/")
    ) {
      let emails = props?.email[0];
      const linkUrl = new URL(props?.link);
      setLinks(linkUrl.origin + linkUrl.pathname + "?utm-email=" + emails);
    } else {
      setLinks(props?.link);
    }
  }, [props?.email, props?.link]);
  return (
    <>
      <a href={links}>
        <div
          className="jns-highlight"
          style={props.styles}
          data-tip={props.message}
          data-place={props.position}
        >
          {/* <WarningTooltip /> */}
        </div>
      </a>
    </>
  );
}
