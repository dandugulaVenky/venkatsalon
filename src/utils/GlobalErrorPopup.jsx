import { useContext } from "react";
import { ErrorContext } from "../context/ErrorContext";

const GlobalErrorPopup = () => {
  const { globalError, clearGlobalError } = useContext(ErrorContext);
  if (!globalError) return null; // Don't show anything if no error

  // console.log(globalError, "globalError in GlobalErrorPopup"); // Debugging line
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">
          Something went wrong Please Refresh..
        </h2>
        <h2 className="text-xl font-bold mb-4">
          Sorry for inconvenience! We are looking into it.
        </h2>
        <p className="text-red-600">{globalError.message}</p>
        <pre className="text-gray-500 text-sm mt-2 overflow-x-auto">
          {globalError.stack}
        </pre>
        <button
          onClick={() => {
            clearGlobalError(); // Clear the error when closing the popup
            window.location.reload(); // Reload the page to reset the app state
          }}
          className="mt-4 px-4 py-2 text-white rounded primary-button"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default GlobalErrorPopup;
