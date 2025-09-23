// components/AlertManager.tsx
import React, { useState, useCallback } from 'react';
import Alert, { AlertType } from './Alert';

interface AlertItem {
  id: string;
  type: AlertType;
  title: string;
  message?: string;
  duration?: number;
}

interface AlertManagerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-center';
  language?: 'ar' | 'en';
}

const AlertManager: React.FC<AlertManagerProps> = ({
  position = 'top-center',
  language = 'ar'
}) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const addAlert = useCallback(
    (type: AlertType, title: string, message?: string, duration?: number) => {
      const id = Math.random().toString(36).substring(2, 9);
      setAlerts((prev) => [...prev, { id, type, title, message, duration }]);
    },
    []
  );

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      default:
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
    }
  };

  // Expose methods globally for easier access
  React.useEffect(() => {
    (window as any).showAlert = addAlert;
    return () => {
      delete (window as any).showAlert;
    };
  }, [addAlert]);

  return (
    <div
      className={`fixed z-50 flex flex-col gap-3 ${getPositionClasses()}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          type={alert.type}
          title={alert.title}
          message={alert.message}
          duration={alert.duration}
          onClose={() => removeAlert(alert.id)}
          language={language}
        />
      ))}
    </div>
  );
};

export default AlertManager;