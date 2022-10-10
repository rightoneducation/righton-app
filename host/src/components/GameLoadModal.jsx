import React from "react";
import { makeStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Modal from 'react-modal';
import RadialLoaderImage from '../images/RadialLoaderImage.svg';

export default function GameLoadModal({ handleModalClose, modalOpen, countdown}) {
  const classes = useStyles();

   return (
      <Modal 
           isOpen={modalOpen}
           contentLabel="Game Load Modal"
           style={{
            content: {
              position: 'absolute',
              top:'0px',
              left:'0px',
              display: 'flex',
              flexDirection: 'column',
              margin:'auto',
              width: '100%',
              height: '100%',
              minHeight: "100vh",
              padding: '-20px',
              justifyContent: "center",
              alignItems: "center",
              border: '0',
              background: 'linear-gradient(#483a82 0%, #7962c4 30%,  #483a82 100%)'
             },
             overlay: { 
              position: 'absolute',
              top:'0px',
              left:'0px',
              width: '100%',
              height: '100%',
              minHeight: "100vh",
              background: 'linear-gradient(#483a82 0%, #7962c4 30%,  #483a82 100%)'
            }
            }}
            //onRequestClose={() => handleModalClose(false)}
            appElement={document.getElementById('root') || undefined}
           >
           <div className={classes.counterContainer}> {/*loader + text*/} 
              <div className={classes.counterText}> {countdown} </div>
          </div>
          <div className={classes.modalHead}> {/*bottom text*/}
             The game will begin soon.
          </div>
        </Modal> 
  );
}

const useStyles = makeStyles(theme => ({
  
  modalHead: {
    fontSize: "20px",
    fontWeight: "700",
    fontFamily: 'Karla',
    color: 'white',
    lineHeight: '23.38px',
    textAlign: 'center'
  },
  counterContainer:{
    backgroundImage: `url(${RadialLoaderImage})`,
    width: '242px',
    height: '242px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 'auto'
  },
  counterText:{
    fontSize: "108px",
    fontWeight: "700",
    fontFamily: 'Karla',
    color: 'white',
    lineHeight: '131.65px',
    textAlign: 'center'
  }
}));
