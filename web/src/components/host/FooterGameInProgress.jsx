import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, BottomNavigation } from "@material-ui/core";
import Button from '@material-ui/core/Button';

export default function FooterStartGame () {
  //const classes = useStyles();
  const history = useHistory();
  const sessionID = '12345';
  
  return (
    <div>
       <p>sup</p> 
      {/*
        <BottomNavigation className={classes.bar}>
           <Button className={classes.startGameButton} onClick={() => history.push(`/host/${sessionID}`)}>Start Game</Button>
           <p className={classes.clickToPair}>Got a desktop and projector? Click here to pair it!</p>  
       </BottomNavigation>*/}
   </div>
    
  )
}


