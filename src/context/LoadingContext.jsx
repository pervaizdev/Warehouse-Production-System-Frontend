import { createContext, useState, useEffect, useContext } from "react";
import GlobalLoading from "../global-components/GlobalLoading/GlobalLoading";

const LoadingContext = createContext(null);

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  const showLoading = (text = "") => {
    // text might be an Event object if called from event listener, so we check type
    if (typeof text === 'string') {
      setLoadingText(text);
    }
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
    setLoadingText("");
  };

  useEffect(() => {
    window.addEventListener('show-global-loading', showLoading);
    window.addEventListener('hide-global-loading', hideLoading);

    return () => {
      window.removeEventListener('show-global-loading', showLoading);
      window.removeEventListener('hide-global-loading', hideLoading);
    };
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
      {children}
      {isLoading && <GlobalLoading text={loadingText} />}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
