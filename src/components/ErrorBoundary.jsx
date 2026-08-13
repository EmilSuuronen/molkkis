import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    try {
      localStorage.removeItem("molkky_app_state_v1");
    } catch (e) {
      console.error("Failed to clear state on error reset:", e);
    }
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: "24px",
          margin: "20px auto",
          maxWidth: "500px",
          background: "#161b22",
          color: "#f0f6fc",
          borderRadius: "16px",
          border: "1px solid #30363d",
          textAlign: "center",
          fontFamily: "sans-serif"
        }}>
          <h2 style={{ color: "#e74c3c", margin: "0 0 12px 0" }}>
            Hups! Jotain meni pieleen.
          </h2>
          <p style={{ color: "#8b949e", fontSize: "0.95rem", marginBottom: "20px" }}>
            Pelin lataamisessa tapahtui odottamaton virhe.
          </p>
          {this.state.error && (
            <pre style={{
              background: "#0d1117",
              padding: "12px",
              borderRadius: "8px",
              fontSize: "0.8rem",
              textAlign: "left",
              overflowX: "auto",
              color: "#ff7b72"
            }}>
              {this.state.error.toString()}
            </pre>
          )}
          <button
            type="button"
            onClick={this.handleReset}
            style={{
              marginTop: "16px",
              padding: "12px 24px",
              fontSize: "1rem",
              fontWeight: "bold",
              borderRadius: "999px",
              border: "none",
              background: "#3877d3",
              color: "#ffffff",
              cursor: "pointer"
            }}
          >
            Palaa aloitusnäyttöön
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
