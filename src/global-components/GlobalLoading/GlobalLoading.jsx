import './GlobalLoading.css';

const GlobalLoading = ({ text }) => {
  return (
    <div className="global-loading-overlay">
      <div className="global-loading-content">
        <div className="lottie-dots-loader">
          <div className="lottie-dot"></div>
          <div className="lottie-dot"></div>
          <div className="lottie-dot"></div>
          <div className="lottie-dot"></div>
        </div>
        {text && <span className="global-loading-text">{text}</span>}
      </div>
    </div>
  );
};

export default GlobalLoading;
