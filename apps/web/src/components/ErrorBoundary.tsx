import { Component, type ErrorInfo, type ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return {
      hasError: true,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error("React application error:", error, errorInfo);
    } else {
      console.error("React application error");
    }
  }

  private handleRetry = (): void => {
    this.setState({
      hasError: false,
    });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
          <section
            role="alert"
            className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm"
          >
            <div className="mb-4 text-4xl">⚠️</div>

            <h1 className="text-2xl font-bold text-gray-900">
              Something went wrong
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              StudentOps encountered an unexpected error. Please try again.
            </p>

            <button
              type="button"
              onClick={this.handleRetry}
              className="mt-6 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Try again
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
