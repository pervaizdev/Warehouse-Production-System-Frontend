import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconBox, IconGhost, IconHome, IconPackage, IconTractor } from '@tabler/icons-react';
import Button from '../../global-components/Button/Button';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="animated-scene">
        <div className="floating-404">
          4<IconGhost className="ghost-icon" size={100} stroke={1.5} />4
        </div>
        
        <div className="forklift-container">
          <IconTractor size={80} color="var(--primary, #047857)" stroke={1.5} />
          <IconPackage className="falling-box" size={40} color="#d97706" stroke={1.5} />
        </div>
      </div>

      <h1 className="not-found-title">Whoops! Pallet Not Found.</h1>
      <p className="not-found-subtitle">
        Looks like this URL got misplaced in the warehouse. Our digital forklifts are searching everywhere, but this page definitely doesn't exist.
      </p>

      <Button 
        variant="primary" 
        size="lg" 
        icon={<IconHome size={20} />}
        onClick={() => navigate('/')}
      >
        Back to Dashboard
      </Button>
      
      {/* Background decoration */}
      <div className="bg-decor bg-decor-1"><IconBox size={150} stroke={0.5} /></div>
      <div className="bg-decor bg-decor-2"><IconBox size={250} stroke={0.5} /></div>
    </div>
  );
};

export default NotFound;
