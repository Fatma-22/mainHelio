// hooks/useAlert.ts
import { useCallback } from 'react';
import { AlertType } from '../components/Alert';

export const useAlert = () => {
  const showAlert = useCallback(
    (type: AlertType, title: string, message?: string, duration?: number) => {
      // Check if AlertManager is available
      if (typeof window !== 'undefined' && (window as any).showAlert) {
        (window as any).showAlert(type, title, message, duration);
      } else {
        console.error('AlertManager is not available');
      }
    },
    []
  );

  const showSuccessAlert = useCallback(
    (title: string, message?: string, duration?: number) => {
      showAlert('success', title, message, duration);
    },
    [showAlert]
  );

  const showErrorAlert = useCallback(
    (title: string, message?: string, duration?: number) => {
      showAlert('error', title, message, duration);
    },
    [showAlert]
  );

  const showWarningAlert = useCallback(
    (title: string, message?: string, duration?: number) => {
      showAlert('warning', title, message, duration);
    },
    [showAlert]
  );

  const showInfoAlert = useCallback(
    (title: string, message?: string, duration?: number) => {
      showAlert('info', title, message, duration);
    },
    [showAlert]
  );

  return {
    showSuccessAlert,
    showErrorAlert,
    showWarningAlert,
    showInfoAlert,
    showAlert,
  };
};

export default useAlert;