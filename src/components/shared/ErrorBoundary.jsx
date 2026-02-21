/* ========================================
   SENTRAK — Error Boundary
   Catches React render crashes per-page.
   Shows friendly recovery UI instead of blank screen.
   Owner: Navneeth (architect)
   ======================================== */

import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[SENTRAK] Component crashed:', error, info?.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="animate-fade-in" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          textAlign: 'center',
          padding: 'var(--space-xl)',
          gap: 'var(--space-lg)'
        }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <AlertTriangle size={32} color="var(--accent-danger)" />
          </div>
          <div>
            <h2 className="heading-3" style={{ marginBottom: 'var(--space-sm)' }}>
              Something went wrong
            </h2>
            <p className="text-secondary" style={{ maxWidth: 400, margin: '0 auto' }}>
              {this.props.fallbackMessage || "This section encountered an error. Tap below to try again."}
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={this.handleRetry}
            style={{ gap: 'var(--space-xs)' }}
          >
            <RefreshCw size={16} /> Try Again
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{
              marginTop: 'var(--space-md)',
              padding: 'var(--space-md)',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 'var(--radius-md)',
              maxWidth: 500,
              width: '100%',
              textAlign: 'left'
            }}>
              <summary className="text-muted" style={{ cursor: 'pointer' }}>Error Details</summary>
              <pre style={{
                fontSize: '0.75rem',
                color: 'var(--accent-danger)',
                whiteSpace: 'pre-wrap',
                marginTop: 'var(--space-sm)'
              }}>
                {this.state.error?.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
