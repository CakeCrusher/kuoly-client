import React from 'react';
import ReactTooltip from "react-tooltip";

type CopyToolTipProps = {
  children: any;
  text: string;
}
const CopyToolTip = ({children, text}:CopyToolTipProps) => {
  const [copied, setCopied] = React.useState(false);
  // procude an id for the tooltip
  const id = React.useRef(`copy-tooltip-${Math.random()}`);
  const onCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }
  return (
    <div onClick={onCopy} data-tip data-for={id.current} className="btn-wrapper">
      {children}
      <ReactTooltip id={id.current} place="top" effect="solid">
        {copied ? "Link copied" : text}
      </ReactTooltip>
    </div>
  )
}

export default CopyToolTip;