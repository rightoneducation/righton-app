import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, BottomNavigation } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';


export default function FooterStartGame () {
  const classes = useStyles();
  const history = useHistory();
  const sessionID = '12345';
  const [numPlayerJoin, setNumPlayerJoin] = useState(50);
  const [numPlayerTotal, setNumPlayerTotal] = useState(100);
  const [progressPercent, setProgressPercent] = useState(50);

  const progressTest = () => 
    {
      setNumPlayerJoin(numPlayerJoin+1);
      setProgressPercent((numPlayerJoin / numPlayerTotal)*100);
    }
  
  return (
      <div className={classes.footer}>
        <BottomNavigation className={classes.footer}>
          <div className={classes.footerContainer}>
            <div className={classes.playerNum}>Players that answered</div>  
            <div className={classes.bargroup}>
               <div className={classes.barContainer}>
                  <LinearProgress variant='determinate' classes={{colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary}} className={classes.progressBar} value={progressPercent}></LinearProgress>
                  <div style={{position: 'absolute', top: '0', left: '0', width: `${progressPercent-2}%`, textAlign: 'right', fontSize: '12px', fontWeight:'bold', zIndex: '1', lineHeight:'18px'}}> {numPlayerJoin} </div> 
               </div>
               <div className={classes.totalPlayers}>{numPlayerTotal}</div>
            </div>
            <Button className={classes.startGameButton} onClick={()=>progressTest()}>Skip to Results</Button>
          </div>
       </BottomNavigation>
      </div>
  )
}

const useStyles = makeStyles(theme => ({
  footer: {
    position: 'sticky',
    bottom: '0',
    height: '132px',
    marginBottom: "22px",
    width: "100%", 
  },
  footerContainer:{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  playerNum: {
    fontSize: '16px',
    textAlign: 'left',
    color: 'white',
  },
  bargroup:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap:'10px',
  },
  totalPlayers:{
    fontSize: '12px',
    lineHeight: '18px',
    fontWeight: '700',
    color: 'white',
  },
  barContainer: {
    position: 'relative',
    width: '291px',
  },
  progressBar: {
     position: 'relative',
     top: '0',
     left: '0',
     height: '18px',
     width: '100%',
     borderRadius: '3px',
  },
  colorPrimary: {
    background: 'rgba(255,255,255,0.2)',
  } ,
  barColorPrimary: {
    background: 'white',
  },
  startGameButton: {
      border: '4px solid #159EFA',
      borderRadius: '34px',
      width: '300px',
      height: '48px',
      color: '#159EFA',
      fontSize: '20px',
      fontWeight: '700',
      lineHeight: '30px',
  },  
}));

