import React from 'react'
import GameCode from './GameCode'
import { makeStyles } from "@material-ui/core";
import ModeToggle from './ModeToggle'
import ClearIcon from '@material-ui/icons/Clear';


const HostHeader = () => {
  const classes = useStyles()
  return (
    <div>
      <ModeToggle/>
      <div>
      <ClearIcon className={classes.clearIconGameCode}/>
      <GameCode/>
      </div>
    </div>
    
  )
}
const useStyles = makeStyles(theme => ({
  clearIconGameCode: {
    color: "white",
    position: "absolute",
    padding: "3%",
    marginLeft: "3%"
  }
}))

export default HostHeader