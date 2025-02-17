import { Component, ErrorInfo, ReactNode } from "react";
import { Div } from "@ly_styles/Div";
import * as Sentry from "@sentry/react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    if (Sentry.getClient()) {
        Sentry.captureException(error);
      }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <Div>An unexpected error has occurred.</Div>;
    }
    return this.props.children;
  }
}