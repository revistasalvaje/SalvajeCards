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
  // Auto-eliminar después del tiempo especificado
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, onDismiss, duration]);

  return (
    <div className={`notification notification-${type}`}>
      <div className="notification-icon">
        {type === 'success' && (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39763 14.6024 1.66667 10 1.66667C5.39765 1.66667 1.66669 5.39763 1.66669 10C1.66669 14.6024 5.39765 18.3333 10 18.3333Z" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7.5 10L9.16667 11.6667L12.5 8.33334" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}

        {type === 'error' && (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39763 14.6024 1.66667 10 1.66667C5.39765 1.66667 1.66669 5.39763 1.66669 10C1.66669 14.6024 5.39765 18.3333 10 18.3333Z" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12.5 7.5L7.5 12.5" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7.5 7.5L12.5 12.5" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}

        {type === 'warning' && (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 6.66667V10" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 13.3333H10.0083" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.05 3.81667L1.71666 16.1833C1.5684 16.4311 1.50057 16.7242 1.5256 17.0192C1.55063 17.3141 1.66699 17.5909 1.85837 17.8084C2.04974 18.026 2.30371 18.1729 2.58552 18.2291C2.86732 18.2853 3.16062 18.2479 3.41666 18.1233L9.99999 15L16.5833 18.1233C16.8394 18.2479 17.1327 18.2853 17.4145 18.2291C17.6963 18.1729 17.9502 18.026 18.1416 17.8084C18.333 17.5909 18.4493 17.3141 18.4744 17.0192C18.4994 16.7242 18.4316 16.4311 18.2833 16.1833L10.95 3.81667C10.7961 3.58095 10.5735 3.39126 10.3089 3.27243C10.0444 3.1536 9.75097 3.10999 9.4625 3.14689C9.17403 3.18379 8.90506 3.29932 8.69057 3.47887C8.47608 3.65842 8.32673 3.89334 8.26666 4.15833L9.05 3.81667Z" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}

        {type === 'info' && (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39763 14.6024 1.66667 10 1.66667C5.39765 1.66667 1.66669 5.39763 1.66669 10C1.66669 14.6024 5.39765 18.3333 10 18.3333Z" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 13.3333V10" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 6.66667H10.0083" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>

      <div className="notification-content">
        {message}
      </div>

      <button
        onClick={() => onDismiss(id)}
        className="notification-close"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
};

export default NotificationToast;