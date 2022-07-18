import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, BottomNavigation, Paper } from "@material-ui/core";

const FooterStartGame = ({ gameId }) => {
  const classes = useStyles();
  const history = useHistory();

  const handleStartGame = (e) => {
    e.preventDefault();
    history.push(`/game-in-progress/${gameId}`);
  }
  
  return (
    <BottomNavigation className={classes.footer}>
           <button className={classes.startGameButton} onClick={handleStartGame}>Start Game</button>
          <p className={classes.clickToPair}>Got a desktop and projector? Click here to pair it!</p>      
    </BottomNavigation>
  )
}
const useStyles = makeStyles(theme => ({
    footer:{
      position: 'sticky',
      bottom: '0',
      padding: '7%',
    },
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