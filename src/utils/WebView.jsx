import { useEffect, useState } from "react";

const WebView = () => {
  const [showOpenInBrowser, setShowOpenInBrowser] = useState(false);

  const detectWebView = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    const isWebView =
      /instagram/i.test(userAgent) ||
      /FBAV/i.test(userAgent) ||
      /Twitter/i.test(userAgent) ||
      /YouTube/i.test(userAgent) ||
      /Google/i.test(userAgent);

    return isWebView;
  };

  const handleOpenInBrowser = () => {
    const isIos = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isIos) {
      window.open("https://saalons.com", "_blank");
    } else {
      window.location.href = "https://saalons.com";
    }
  };

  useEffect(() => {
    if (detectWebView()) {
      setShowOpenInBrowser(true); // show button instead of popup
    }
  }, []);

  return (
    <>
      {showOpenInBrowser && (
        <div className="fixed bottom-4 left-0 right-0 flex justify-center">
          <button
            onClick={handleOpenInBrowser}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md"
          >
            Open in Browser for Best Experience
          </button>
        </div>
      )}
    </>
  );
};

export default WebView;
