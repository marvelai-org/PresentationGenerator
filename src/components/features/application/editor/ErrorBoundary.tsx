/**
 * ErrorBoundary component for the presentation editor
 *
 * This component catches JavaScript errors in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

interface Props {
  /** Children components to be rendered inside the error boundary */
  children: ReactNode;
  /** Optional custom fallback component to render when an error occurs */
  fallback?: ReactNode;
  /** Optional callback for when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Optional ID for tracking specific error boundaries */
  id?: string;
}

interface State {
  /** Whether an error has occurred */
  hasError: boolean;
  /** The error that was caught */
  error: Error | null;
}

/**
 * An error boundary component that catches JavaScript errors in its child component tree,
 * logs those errors, and displays a fallback UI.
 */
class ErrorBoundary extends Component<Props, State> {
  /**
   * Initialize state
   */
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  /**
   * Update state when an error is caught
   */
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  /**
   * Log error details when an error occurs
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      `[ErrorBoundary${this.props.id ? ` ${this.props.id}` : ""}]`,
      error,
      errorInfo,
    );

    // Call the optional onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * Reset the error state when trying to recover
   */
  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  /**
   * Render the fallback UI or the children depending on whether an error occurred
   */
  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="p-4 border border-red-300 bg-red-50 rounded-md text-center mt-4 mb-4">
          <Icon
            className="text-red-500 text-3xl mb-2"
            icon="material-symbols:error"
          />
          <h3 className="text-lg font-semibold text-red-800">
            Something went wrong
          </h3>
          <p className="text-sm text-red-600 mb-4">
            {this.state.error?.message ||
              "An unexpected error occurred in the editor component."}
          </p>
          <Button
            className="mx-auto"
            color="primary"
            variant="flat"
            onPress={this.handleReset}
          >
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
