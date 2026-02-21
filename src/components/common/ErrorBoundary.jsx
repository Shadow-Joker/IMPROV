import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("[ErrorBoundary] Caught exception:", error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false });
        if (this.props.onReset) {
            this.props.onReset();
        }
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="glass-card flex flex-col items-center justify-center p-xl text-center border-dashed border-red-500/30">
                    <AlertTriangle size={48} className="text-red-400 mb-md opacity-80" />
                    <h3 className="heading-3 mb-sm">Assessment Interrupted</h3>
                    <p className="text-secondary mb-lg">Could not load test format. Missing structure data.</p>
                    <button className="btn btn-secondary flex items-center gap-sm" onClick={this.handleReset}>
                        <RefreshCw size={16} /> Resetting.
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
