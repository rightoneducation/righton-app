import React from 'react'
import GameCode from './GameCode'
import { makeStyles } from "@material-ui/core";

const HostHeader = () => {
  const classes = useStyles()
  return (
    <div>HostHeader
      <GameCode/>
    </div>
  )
}
const useStyles = makeStyles(theme => ({
  
}))

export default HostHeader