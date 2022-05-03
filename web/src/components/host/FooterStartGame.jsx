import React from 'react'
import { makeStyles, BottomNavigation, Paper } from "@material-ui/core";

const FooterStartGame = () => {
    const classes = useStyles()
  return (
    <BottomNavigation style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: "7%"}}>
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