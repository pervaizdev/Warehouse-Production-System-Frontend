import './Tooltip.css';

const Tooltip = ({ content, children }) => (
  <span className="global-tooltip">
    {children}
    <span className="global-tooltip-content" role="tooltip">{content}</span>
  </span>
);

export default Tooltip;
