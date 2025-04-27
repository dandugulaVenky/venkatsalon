import React from "react";
import { ErrorContext } from "../context/ErrorContext";
import GlobalErrorPopup from "./GlobalErrorPopup";

class ErrorBoundary extends React.Component {
  static contextType = ErrorContext;

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.context.setGlobalError({
      message: error?.message || "Something went wrong",
      stack: errorInfo?.componentStack || "",
    });
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      // Instead of crashing, show popup
      return <GlobalErrorPopup />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
