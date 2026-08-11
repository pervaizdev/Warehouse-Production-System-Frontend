import Lottie from 'lottie-react';
import loadingAnimation from '../../assets/loading-animation.json';
import splashIcon from '../../assets/wps-splash.png';
import './Loading.css';

const LottieComponent = Lottie.default || Lottie;

const Loading = ({ text = 'Loading...', fullScreen = false, overlay = false, size = 120, showSplash = false }) => {
  return (
    <div className={`global-loading-container ${fullScreen ? 'fullscreen' : ''} ${overlay ? 'overlay' : ''}`.trim()}>
      {showSplash && (
        <img src={splashIcon} alt="WPS Splash" className="loading-splash-icon" style={{ width: '80px', height: '80px', marginBottom: '20px', borderRadius: '16px' }} />
      )}
      <div className="lottie-wrapper" style={{ width: size, height: size }}>
        <LottieComponent animationData={loadingAnimation} loop={true} />
      </div>
      {text && <div className="loading-text">{text}</div>}
    </div>
  );
};

export default Loading;
