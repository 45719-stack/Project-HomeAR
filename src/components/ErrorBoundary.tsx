import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-800 p-6">
                    <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 border border-gray-200">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
                        <p className="mb-4 text-gray-600">
                            The application encountered a critical error. Please check the developer console for more details.
                        </p>
                        {this.state.error && (
                            <div className="bg-gray-100 p-4 rounded-md overflow-x-auto mb-6 text-sm font-mono text-red-800">
                                {this.state.error.message}
                            </div>
                        )}
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
