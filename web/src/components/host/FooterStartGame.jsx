import React from 'react'
import { makeStyles } from "@material-ui/core";

const FooterStartGame = () => {
    const classes = useStyles()
  return (
    <div classname={classes.startButtonDiv}>
        <div classname={classes.startButtonCenter}>
        <button className={classes.startGameButton} variant="contained">Start Game</button>
        </div>
      </div>
  )
}
const useStyles = makeStyles(theme => ({
   
    //trying to figure out how to position the start game button here, will circle back
    // startButtonDiv:{
    //   height: "200px",
    //   position: "relative"
    // },
  
    // startButtonCenter: {
    //   margin: "auto",
    //   position: "absolute",
    //   top: "50%",
    //   left: "50%"
    // },
  
    startGameButton: {
      background: 'linear-gradient(90deg, #FC1047 0%, #FC2468 100%)',
      borderRadius: '34px',
      color: 'white',
      fontWeight: "bold",
      width: "300px",
      height: "48px",
      position: "absolute",
      bottom: "2%",
      marginLeft: "14.2%",
      fontSize: "20px"
      
    }
  }))

export default FooterStartGame