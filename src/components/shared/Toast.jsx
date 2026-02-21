/* ========================================
   SENTRAK — Toast Notification System
   Global toast for success/error/info feedback.
   Usage: import { toast } from './Toast';
          toast.success('Saved!');
   Owner: Navneeth (architect)
   ======================================== */

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle,
  error: AlertTriangle,
  info: Info
};

const COLORS = {
  success: 'var(--accent-success)',
  error: 'var(--accent-danger)',
  info: 'var(--accent-primary)'
};

let globalAddToast = null;

export const toast = {
  success: (msg) => globalAddToast?.({ type: 'success', message: msg }),
  error: (msg) => globalAddToast?.({ type: 'error', message: msg }),
  info: (msg) => globalAddToast?.({ type: 'info', message: msg }),
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type, message }) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, message }]);

    // Haptic
    if (navigator.vibrate) navigator.vibrate(40);

    // Auto-dismiss
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Expose globally
  useEffect(() => {
    globalAddToast = addToast;
    return () => { globalAddToast = null; };
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Container */}
      <div style={{
        position: 'fixed',
        bottom: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-sm)',
        pointerEvents: 'none',
        width: '90%',
        maxWidth: 420,
      }}>
        {toasts.map((t) => {
          const Icon = ICONS[t.type] || Info;
          return (
            <div
              key={t.id}
              className="animate-slide-up"
              style={{
                pointerEvents: 'auto',
                background: 'rgba(15, 20, 50, 0.95)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${COLORS[t.type]}40`,
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-md) var(--space-lg)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${COLORS[t.type]}15`,
                animation: 'slideUp 0.3s ease-out',
              }}
            >
              <Icon size={18} color={COLORS[t.type]} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {t.message}
              </span>
              <button
                onClick={() => removeToast(t.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                  color: 'var(--text-muted)',
                  flexShrink: 0
                }}
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  return ctx || toast;
}
