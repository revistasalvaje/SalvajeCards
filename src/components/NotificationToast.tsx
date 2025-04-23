import React, { useEffect } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationProps {
  message: string;
  type: NotificationType;
  id: number;
  onDismiss: (id: number) => void;
  duration?: number;
}

const NotificationToast: React.FC<NotificationProps> = ({
  message,
  type,
  id,
  onDismiss,
  duration = 3000,
}) => {
  // Definir los iconos y colores para cada tipo
  const styles = {
    success: {
      bg: 'var(--color-green-50, #f0fdf4)',
      border: 'var(--color-green-500, #22c55e)',
      text: 'var(--color-green-700, #15803d)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      ),
    },
    error: {
      bg: 'var(--color-red-50, #fef2f2)',
      border: 'var(--color-red-500, #ef4444)',
      text: 'var(--color-red-700, #b91c1c)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      ),
    },
    warning: {
      bg: 'var(--color-yellow-50, #fefce8)',
      border: 'var(--color-yellow-500, #eab308)',
      text: 'var(--color-yellow-700, #a16207)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      ),
    },
    info: {
      bg: 'var(--color-blue-50, #eff6ff)',
      border: 'var(--color-blue-500, #3b82f6)',
      text: 'var(--color-blue-700, #1d4ed8)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      ),
    },
  };

  const style = styles[type];

  // Auto-eliminar después del tiempo especificado
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, onDismiss, duration]);

  return (
    <div
      className="notification-toast"
      style={{
        backgroundColor: style.bg,
        borderLeftColor: style.border,
        color: style.text,
        animation: 'slideIn 0.3s ease-out forwards'
      }}
    >
      <div className="notification-icon">{style.icon}</div>
      <div className="notification-message">{message}</div>
      <button
        onClick={() => onDismiss(id)}
        className="notification-close"
        aria-label="Cerrar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
};

export default NotificationToast;
