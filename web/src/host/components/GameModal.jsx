import React from "react";
import { makeStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Modal from 'react-modal';


export default function GameModal({handleModalButtonOnClick, handleModalClose, modalOpen}) {
  const classes = useStyles();

   return (
      <Modal 
           isOpen={modalOpen}
           contentLabel="Game Modal"
           style={{
            content: {
              position: 'absolute',
              margin: 'auto',
              display: 'flex',
              flexDirection: 'column',
              width: '250px',
              height: '180px',
              padding: '20px',
              justifyContent: "space-between",
              alignItems: "center",
              background: 'linear-gradient(90deg, #043272 0%, #0D68B1 100%)',
              borderRadius: '20px',
              border: 'none'
             },
             overlay: {
                height: '100%',
                width: '100%',
                minHeight: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.65)'
            }}}
            onRequestClose={() => handleModalClose(false)}
            shouldCloseOnOverlayClick={true}
            appElement={document.getElementById('root') || undefined}
           >
           <div className={classes.modalHead}>Are you sure that you want to move on? Not every student has answered yet. </div>
           <Button 
             className={classes.endAnswerButton}
             onClick={() => { 
               handleModalButtonOnClick();
            }}>
            Yes
            </Button>
            <div className={classes.modalClose} onClick={() => handleModalClose(false)}>No, I'm not done. </div>
        </Modal> 
  );
}

const useStyles = makeStyles(theme => ({
  endAnswerButton: {
    border: "4px solid #159EFA",
    background: "linear-gradient(#159EFA 100%,#19BCFB 100%)",
    borderRadius: "34px",
    width: "123px",
    height: "38px",
    color: "white",
    fontSize: "20px",
    bottom: '0',
    fontWeight: "700",
    lineHeight: "30px",
    boxShadow: "0px 5px 22px 0px #47D9FF4D", 
    "&:disabled": {
      background: 'transparent',
      border: '4px solid #159EFA',
      borderRadius: '34px',
      width: '300px',
      height: '48px',
      color: '#159EFA',
      fontSize: '20px',
      fontWeight: '700',
      lineHeight: '30px',
      opacity: '25%',
      cursor: "not-allowed",
    }
  },
  modalHead: {
    fontSize: "20px",
    fontWeight: "700",
    fontFamily: 'Karla',
    color: 'white',
    lineHeight: '23.38px',
    textAlign: 'center'
  },
  modalClose: {
    fontSize: "15px",
    fontWeight: "500",
    fontFamily: 'Poppins',
    color: '#19B9FB',
    lineHeight: '22.5px',
    textDecoration: 'underline'
  }
}));
