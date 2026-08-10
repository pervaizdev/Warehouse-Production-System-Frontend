import { Link } from 'react-router-dom';
import { IconCompassOff } from '@tabler/icons-react';
import './NotFound.css';

const NotFound = () => (
  <div className="not-found" role="status">
    <IconCompassOff size={48} aria-hidden="true" />
    <h2>Page not found</h2>
    <p>The module you are looking for does not exist or has moved.</p>
    <Link to="/dashboard" className="not-found-link">Return to Dashboard</Link>
  </div>
);

export default NotFound;
