/**
 * ErrorBoundary component for the presentation editor
 *
 * This component catches JavaScript errors in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */

import * as React from 'react';

interface ErrorBoundaryProps {
  /** Children components to be rendered inside the error boundary */
  children: React.ReactNode;
  /** Optional custom fallback component to render when an error occurs */
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  /** Whether an error has occurred */
  hasError: boolean;
  /** The error that was caught */
  error: Error | null;
}

/**
 * An error boundary component that catches JavaScript errors in its child component tree,
 * logs those errors, and displays a fallback UI.
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  /**
   * Initialize state
   */
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  /**
   * Update state when an error is caught
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  /**
   * Log error details when an error occurs
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // You can also log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
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
  render(): React.ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        this.props.fallback || (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="mb-4">The editor encountered an error and couldn't continue.</p>
            <p className="text-sm text-gray-600 border p-2 rounded bg-gray-100">
              {this.state.error?.message || 'Unknown error'}
            </p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={this.handleReset}
            >
              Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
