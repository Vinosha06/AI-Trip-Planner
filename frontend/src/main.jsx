import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React application error:", error);
    console.error("Component stack:", errorInfo?.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            padding: "40px",
            fontFamily: "Arial, sans-serif",
            background: "#f8fafc",
            color: "#0f172a",
          }}
        >
          <h1 style={{ color: "#dc2626" }}>
            Application Error
          </h1>

          <p>
            The frontend could not load correctly.
          </p>

          <pre
            style={{
              marginTop: "20px",
              padding: "20px",
              borderRadius: "12px",
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              whiteSpace: "pre-wrap",
              overflow: "auto",
            }}
          >
            {this.state.error?.stack ||
              this.state.error?.message ||
              "Unknown React error"}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </React.StrictMode>
);