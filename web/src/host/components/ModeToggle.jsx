import React from 'react'
import { Grid, makeStyles, } from "@material-ui/core";
import CachedIcon from '@material-ui/icons/Cached';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

const ModeToggle = () => {
    const classes = useStyles()
  return (
    <Grid className={classes.modes}>
        <p style={{cursor: 'pointer', paddingRight: ".5%"}}>Display</p>
            <CachedIcon style={{fontSize: '20px', margin: '20px', marginTop: '15px', justifyContent: "center", paddingLeft: "5%", paddingRight: "5%"}} />
        <p style={{opacity: '0.3', }}>Host</p>
            <HelpOutlineIcon className={classes.helpOutlineIcon}/>
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
        margin: "auto",
        marginLeft: "-3%",
        fontWeight: '700'      
    },
    helpOutlineIcon: {
        //position: "absolute",
        //alignItems: "right",
        margin: "auto",
        marginRight: "-15%",
        marginLeft: "10%",
        paddingLeft: "-3%",
        marginTop: "3.5%"
    }
    
}))

export default ModeToggle