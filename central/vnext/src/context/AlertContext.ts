import React from 'react';

export type Alert = {
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
};

const AlertContext = React.createContext<{
  /* eslint-disable @typescript-eslint/no-unused-vars */
  alert: Alert | null;
  setAlert: (alert: Alert) => void;
}>({
  alert: null,
  /* eslint-disable @typescript-eslint/no-unused-vars */
  setAlert: (alert: Alert) => {},
});

export default AlertContext;
