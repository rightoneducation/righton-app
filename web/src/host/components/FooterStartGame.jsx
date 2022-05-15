import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, BottomNavigation, Paper } from "@material-ui/core";
import Button from '@material-ui/core/Button';

const FooterStartGame = () => {
  const classes = useStyles();
  const history = useHistory();
  const sessionID = '12345';
  return (
    
    <BottomNavigation style={{ position: 'sticky', bottom: 0, padding: "7%",  marginTop: "43%"}}>
           <button className={classes.startGameButton} >Start Game</button>
          <p className={classes.clickToPair}>Got a desktop and projector? Click here to pair it!</p>      
    </BottomNavigation>
    
  )
}
const useStyles = makeStyles(theme => ({
   
    clickToPair: {
        position: "absolute",
        fontSize: "12px",
        marginTop: "52px",
        marginBottom: "75px",
        textAlign: "center",
        fontWeight: "700",
        color: "rgba(0, 117, 255, 1)",
        textDecoration: 'underline',
       
    },

    startGameButton: {
      background: 'linear-gradient(90deg, #FC1047 0%, #FC2468 100%)',
      borderRadius: '34px',
      color: 'white',
      fontWeight: "bold",
      width: "300px",
      height: "48px",
      marginTop: "-2%",
      fontSize: "20px",
      border: "none"
      
    }
  }))

export default FooterStartGame