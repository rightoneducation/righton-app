import React from "react";
import { makeStyles} from "@material-ui/core";
import Modal from 'react-modal';
import LoadingIndicator from './LoadingIndicator';

export default function GameLoadModal({ handleStartGameModalTimerFinished, modalOpen}) {
  const classes = useStyles();
   return (
      <Modal 
           isOpen={modalOpen}
           contentLabel="Game Load Modal"
           style={{
            content: {
              position: 'sticky',
              top:'0px',
              left:'0px',
              display: 'flex',
              flexDirection: 'column',
              margin:'auto',
              width: '100%',
              height: '100%',
              minHeight: "100vh",
              padding: '-20px',
              gap: '5%',
              justifyContent: "center",
              alignItems: "center",
              border: '0',
              background: 'linear-gradient(#483a82 0%, #7962c4 30%,  #483a82 100%)',
             }
            }}
            appElement={document.getElementById('root') || undefined}
           >
           <div className={classes.counterContainer}> {/*loader + text*/} 
              <LoadingIndicator
                      theme={[
                        'rgb(126, 90, 175)',
                        'rgb(148, 98, 179)',
                        'rgb(169, 104, 180)',
                        'rgb(186, 107, 177)',
                        'rgb(202, 109, 172)',
                        'rgb(218, 112, 168)',
                        'rgb(237, 115, 166)',
                        'rgb(255, 120, 165)',
                      ]}
                      radius={110}
                      timerStartInSecond={3}
                      handleStartGameModalTimerFinished={handleStartGameModalTimerFinished}
                      gameCreate={false}
                  />
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
    width: '242px',
    height: '242px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
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
