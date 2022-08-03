import React from 'react'
import { makeStyles } from "@material-ui/core";
import Grid from '@material-ui/core/Grid';


const GameCode = ({gameCode}) => {
  const classes = useStyles()
  return (
      <Grid  container className={classes.gameCodeCard} >  
          <p className={classes.p}>Game Code: </p>
          <Grid className={classes.gameCodeText}>
              {gameCode} 
          </Grid>      
      </Grid>        
              
   
  )
}
const useStyles = makeStyles(theme => ({
  
  gameCodeText: {
    margin: "auto",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 1)",
  }, 

  p: {
    fontSize: "16px",
    color: "rgba(255, 255, 255, 1)",
    margin: "auto"
  },

  gameCodeCard: {
    paddingLeft: "10px",
    paddingRight: "10px",
    border: "1px solid rgba(255, 255, 255, 0.25)",
    borderRadius: "8px",
    width: "212px",
    height: "48px",
    margin: "auto",
    marginTop: "-1%",
    marginBottom: "4%",
    justifyContent: "center",
     
  }
}))

export default GameCode