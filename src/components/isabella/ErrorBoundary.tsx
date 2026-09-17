import React, { Component, ErrorInfo, ReactNode } from "react";
import { EmergencyModeView } from "./EmergencyModeView";
import { toOTelLog } from "@/lib/telemetry/otel-neutral";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class IsabellaErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);

    toOTelLog({
      traceId: "client-error",
      kind: "error",
      name: "frontend.critical.error",
      status: "error",
      attributes: {
        error_code: error.name,
      },
      timestamp: new Date().toISOString(),
    });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <EmergencyModeView
          mode="critical_error"
          errorDetails={{
            code: "CROWN-CLIENT-CRASH",
            message: this.state.error?.message || "Fallo crítico en el renderizado del cliente.",
          }}
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}
