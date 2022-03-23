import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import MonsterPink from './images/monsters/Monster-Pink.svg';
import MonsterRed from './images/monsters/Monster-Red.svg';
import RightOnLogo from './images/logos/righton-med.svg';
import CachedIcon from '@material-ui/icons/Cached';
import Button from '@material-ui/core/Button';

export default function LaunchScreen() {
    const classes = useStyles();
    const gameCCSS = '7.RP.A.3';
    const gameTitle = "Practicing Percents: Let's Go Shopping!";
    const gameCode = 9349;
    const students = 28;
    return(
        <div className={classes.page}>
            <div className={classes.monsterPink}><img src={MonsterPink} alt="Pink Monster" /></div>
            <div className={classes.monsterRed}><img src={MonsterRed} alt="Red Monster" /></div>

            <div className={classes.rightonLogo}><img src={RightOnLogo} alt="RightOn Logo" /></div>

            <div className={classes.modes}>
                <p style={{cursor: 'pointer'}}>Display Mode</p>
                <CachedIcon style={{fontSize: '40px', margin: '30px', marginTop: '5px'}} />
                <p style={{opacity: '0.3'}}>Host Mode</p>
            </div>

            <div className={classes.gameInfo}>
                <p style={{color: '#AEA0E1', letterSpacing: '0.15em'}}>{gameCCSS}</p>
                <p style={{color: '#384466', fontSize: '30px'}}>{gameTitle}</p>
            </div>

            <div className={classes.gameCode}>
                <p style={{textAlign: 'center', width: '50%', position: 'relative', top: '-30px'}}>Students, Enter this game code in your RightOn Player App to join the game:</p>
                <p style={{fontSize: '72px', fontWeight: 'bold', position: 'relative', top: '-40px', right: '-40px'}}>{gameCode}</p>
            </div>

            <div className={classes.students}>
                <p style={{fontSize: '72px', fontWeight: 'bold', marginBottom: '10px'}}>{students}</p>
                <p>Students<br />In Session</p>
            </div>

            <div className={classes.startGame}>
                <Button variant="contained">Start Game</Button>
                <p>Teachers: Got a mobile device? Click here to pair it!</p>
            </div>
        </div>
    )
};

const useStyles = makeStyles(themes => ({
    page: {
        background: 'radial-gradient(73.27% 100.19% at 59.84% 33.29%, #6E5EAF 0%, #312759 100%)',
        width: '100vw',
        height: '100vh',
        position: 'absolute',
        overflow: 'hidden'
    },
    monsterPink: {
        position: 'absolute',
        top: '62vh',
        left: '-7vw',
        '& > *': {
            height: '55%',
            width: '55%'
        },
    },
    monsterRed: {
        position: 'absolute',
        top: '25vh',
        right: '-35vw',
        '& > *': {
            height: '55%',
            width: '55%'
        },
    },
    rightonLogo: {
        position: 'absolute',
        top: '9vh',
        right: '-5vw',
        '& > *': {
            height: '60%',
            width: '60%'
        },
    },
    modes: {
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        '& > *': {
            display: 'inline-block',
            color: 'white',
            fontSize: '32px',
            textDecoration: 'underline',
            marginTop: '5px',
            cursor: 'not-allowed'
        },
    },
    gameInfo: {
        background: 'white',
        boxShadow: '0px 4px 10px rgba(15, 27, 40, 0.3)',
        borderRadius: '18px',
        width: '65vw',
        height: '10vh',
        position: 'absolute',
        top: '10vh',
        left: '3vw',
        padding: '15px 20px',
        '& > p': {
            margin: 0,
            fontWeight: 'bold',
        },
    },
    gameCode: {
        border: '4px solid rgba(255, 255, 255, 0.25)',
        borderRadius: '32px',
        position: 'absolute',
        top: '40%',
        left: '50%',
        width: '733px',
        height: '166px',
        transform: 'translate(-50%, -50%)',
        '& > p': {
            color: 'white',
            fontSize: '28px',
            display: 'inline-block',
            marginLeft: '40px',
            verticalAlign: 'top'
        },
    },
    students: {
        position: 'absolute',
        top: '53vh',
        width: '100%',
        textAlign: 'center',
        '& > *': {
            color: 'white',
            fontSize: '30px',
            margin: '0'
        },
    },
    startGame: {
        position: 'absolute',
        top: '82vh',
        width: '100%',
        textAlign: 'center',
        '& > p': {
            color: '#0075FF',
            textDecoration: 'underline',
            fontSize: '24px',
            cursor: 'pointer'
        },
        '& > Button': {
            width: '30%',
            borderRadius: '58px',
            fontSize: '30px',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #FC1047 0%, #FC2468 100%)',
            color: 'white'
        },
    },
}));