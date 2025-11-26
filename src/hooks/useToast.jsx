import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const TOAST_LIFETIME = 5000; // milliseconds

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, TOAST_LIFETIME);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} removeToast={removeToast} />
      ))}
    </div>
  );
};

const Toast = ({ id, message, type, removeToast }) => {
  let bgColor = 'bg-gray-800';
  let textColor = 'text-white';

  switch (type) {
    case 'success':
      bgColor = 'bg-green-500';
      break;
    case 'error':
      bgColor = 'bg-red-500';
      break;
    case 'warning':
      bgColor = 'bg-yellow-500';
      textColor = 'text-gray-900';
      break;
    case 'info':
    default:
      bgColor = 'bg-blue-500';
      break;
  }

  return (
    <div
      className={`flex items-center justify-between w-full max-w-xs p-4 rounded-lg shadow-md ${bgColor} ${textColor}`}
      role="alert"
    >
      <div className="text-sm font-medium">{message}</div>
      <button
        onClick={() => removeToast(id)}
        className={`ml-4 ${textColor === 'text-white' ? 'text-white/80 hover:text-white' : 'text-gray-900/80 hover:text-gray-900'} focus:outline-none`}
        aria-label="Close"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path>
        </svg>
      </button>
    </div>
  );
};
