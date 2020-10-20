import React from 'react';

export type Alert = {
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
};

const AlertContext = React.createContext<{ alert: Alert | null, setAlert: (alert: Alert) => void }>({
  alert: null,
  setAlert: () => { throw new Error('Missing setAlerts function'); },
});

export default AlertContext;
