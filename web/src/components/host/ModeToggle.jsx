import React from 'react'
import { Grid, makeStyles, } from "@material-ui/core";
import CachedIcon from '@material-ui/icons/Cached';

const ModeToggle = () => {
    const classes = useStyles()
  return (
    <Grid className={classes.modes}>
        <p style={{cursor: 'pointer'}}>Display</p>
            <CachedIcon style={{fontSize: '30px', margin: '20px', marginTop: '9px'}} />
        <p style={{opacity: '0.3'}}>Host</p>
     </Grid>
  )
}

const useStyles = makeStyles(themes => ({
    modes: {
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        color: 'white',
        fontSize: '15.19px',
        textDecoration: 'underline',
        marginTop: '1px',
        fontWeight: 'Bold'      
    },
}))

export default ModeToggle