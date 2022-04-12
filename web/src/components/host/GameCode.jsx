import React from 'react'
import { makeStyles, MenuItem } from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
;

const gameCode = 9349;

const GameCode = () => {
    const classes = useStyles()
  return (
      <Grid  container className={classes.gameCodeCard} >  
          <p className={classes.p}>Game Code: </p>
          <Grid className={classes.gameCode}>
              {gameCode}
          </Grid>
                
      </Grid>        
              
   
  )
}
const useStyles = makeStyles(theme => ({
  
  gameCode: {
    margin: "auto",
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 1)",
  }, 

  p: {
    fontSize: "16px",
    color: "rgba(255, 255, 255, 1)",
  },

  gameCodeCard: {
    position: 'relative',
    border: "1px solid rgba(255, 255, 255, 0.25)",
    borderRadius: "8px",
    width: "212px",
    height: "48px",
    margin: "auto",
    marginBottom: "3.5%",
    justifyContent: "center"  
  }
}))

export default GameCode