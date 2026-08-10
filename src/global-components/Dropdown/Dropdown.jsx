import { cloneElement, useEffect, useRef, useState } from 'react';
import './Dropdown.css';

const Dropdown = ({ trigger, children, align = 'right' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div ref={ref} className={`global-dropdown global-dropdown-${align}`}>
      {cloneElement(trigger, { 'aria-expanded': open, onClick: () => setOpen(!open) })}
      {open && <div className="global-dropdown-menu">{children}</div>}
    </div>
  );
};

export default Dropdown;
