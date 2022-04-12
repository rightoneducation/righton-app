import React from 'react'
import GameCode from './GameCode'
import { makeStyles } from "@material-ui/core";
import ModeToggle from './ModeToggle'


const HostHeader = () => {
  const classes = useStyles()
  return (
    <div>
      <ModeToggle/>
      <GameCode/>
    </div>
    
  )
}
const useStyles = makeStyles(theme => ({
  
}))

export default HostHeader