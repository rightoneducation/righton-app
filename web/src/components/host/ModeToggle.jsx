import React from 'react'
import { makeStyles, } from "@material-ui/core";
import CachedIcon from '@material-ui/icons/Cached';

const ModeToggle = () => {
    const classes = useStyles()
  return (
    <div className={classes.modes}>
        <p style={{cursor: 'pointer'}}>Display Mode</p>
            <CachedIcon style={{fontSize: '30px', margin: '20px', marginTop: '9px'}} />
        <p style={{opacity: '0.3'}}>Host Mode</p>
     </div>
  )
}

const useStyles = makeStyles(themes => ({
    modes: {
        position: 'absolute',
        display: 'flex',
        textAlign: 'center',
        color: 'white',
        fontSize: '15.19px',
        textDecoration: 'underline',
        marginTop: '1px',      
    },
}))

export default ModeToggle