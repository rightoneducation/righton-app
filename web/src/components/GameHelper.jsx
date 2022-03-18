import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import { HelpOutline } from '@material-ui/icons';
import SpeechBubble from '../images/SpeechBubble.svg';


export default function Helper({text}) {
    const classes = useStyles();

    return(
        <div className={classes.wrapper}>
            <IconButton color='inherit' disableRipple style={{ backgroundColor: 'transparent' }}>
                <HelpOutline/>
            </IconButton>
            <div className={classes.bubble}>
                <p style={{margin: '65px 60px', fontSize: '20px', fontWeight: 500}}>
                    {text}
                </p>
            </div>
        </div>
    );
}

const useStyles = makeStyles(theme => ({
    wrapper: {
        '&:hover': {
            '& $bubble': {
                visibility: 'visible',
                opacity: 100,
                transition: 'opacity 0.4s',
            }
        }
    },
    bubble: {
        visibility: 'hidden',
        opacity: 0,
        backgroundImage: `url(${SpeechBubble})`, 
        backgroundSize: '250px 250px',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: 2,
        width: 335, 
        height: 343,
        position: 'absolute', 
        transform: 'translate(-42.5%, -96%)',
        textAlign: 'center',
    },
}));