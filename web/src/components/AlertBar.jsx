import React, { useContext } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import AlertContext from '../context/AlertContext';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function AlertBar() {
  const { alert, setAlert } = useContext(AlertContext);

  if (alert === null) return null;

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert(null);
  };

  return (
    <Snackbar open={alert} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={alert.type}>
        {alert.message}
      </Alert>
    </Snackbar>
  );
}
