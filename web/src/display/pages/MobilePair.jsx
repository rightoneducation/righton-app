import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Typography from '@material-ui/core/Typography';
import PhoneImage from '../../images/graphics/Transparent-Phone.png';
import PairCard from '../../images/graphics/Mobile-Pair-Card.png';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import QRCode from 'react-qr-code';


export default function QRScreen() {
   
    const [reveal, setReveal] = useState(false);
    const classes = useStyles();
    const history = useHistory();
    const gameCode = '9349';
    const qrAddress = 'https://www.righton.com/host/' + gameCode;
    

    return (
        <div className={classes.root}>
                <Button  type="button" onClick={() => history.push(`/display`)} className={classes.backButton}>
                    <ArrowBackIcon className={classes.back} /> 
                    <Typography className={classes.back}>  Back to Previous Screen </Typography>
                </Button>
    
                <div className={classes.marginBox}>
                    <Grid container direction='row' alignItems='center' spacing={6} xs={12} >        
                        <Grid item xs className={classes.LeftSide}> 
                                <div className={classes.phoneImage}>
                                    <img src={PhoneImage} alt="Phone"></img> 
                                </div>
                                <Typography  style={{fontWeight: 'bold', color:'white', paddingBottom:'50px', lineHeight:'81px', fontSize: '60px', textAlign:'center'}}>Control the game  <br /> from your phone! </Typography> 
                                <Typography  style={{fontWeight: 'bold',  color:'rgba(255,255,255,0.75)',  fontSize: '30px', textAlign:'center'}}>Enter the Host code to the right at <a href="app.rightoneducation.com" style={{fontWeight: 700, fontWeight: 'bold', color:'#198CFB', fontSize: '30px', textDecoration:'none'}}> RightOn.com/Host </a> on a seperate device or scan the QR code on your mobile device to control the game remotely with RightOn Host!
                                 If don't have an extra device, you can start the game without one by pressing "Start" <br /><br /> (Make sure your projection screen is not visible to your class before revealing the code) </Typography>
                               
                        </Grid>
                        <Grid item xs className={classes.RightSide} alignItems='center'>
                            <div className={classes.cardBox}>
                                {reveal === false ? 
                                  <Card className={classes.revealCard} onClick={() => setReveal(true)}>
                                        <CardContent>
                                           <img src={PairCard} alt="QRReveal" className={classes.cardImage}></img>
                                        </CardContent>
                                    </Card> : 
                                    <div className={classes.qrContainer}>
                                        <div className={classes.qrBox}>
                                            <QRCode value={qrAddress} size='400' /> 
                                        </div> 
                                        <Typography style={{fontWeight: 'bold',  color:'rgba(255,255,255)',  fontSize: '48px', textAlign:'center'}}>OR: </Typography>
                                        <div className={classes.gameCodeText}>
                                            <Typography  >Game Code: {gameCode} </Typography>
                                        </div>
                                    </div>
                                }
                            </div>
                            <Button variant='contained'  className={classes.redButton}> Start </Button> 
                    </Grid>
                </Grid>
                </div>
         </div>
    );
}


const useStyles = makeStyles(theme => ({
    root: {
        background: 'radial-gradient(73.27% 100.19% at 59.84% 33.29%, #6E5EAF 0%, #312759 100%)',
        width: '100vw',
        height: '100vh',
        position: 'absolute',
        overflow: 'hidden'
    },
    back: {
        color: 'white',
    },
    backButton:{
        position: 'aboslute',
        top: '2vh',
        left: '1vw',
    },
    marginBox: {
        marginLeft: '5%',
        marginRight: '5%',
    },
    phoneImage: {
        display:'flex',
        justifyContent:'center',
        
        '& > *': {
            width: '181px',
            height: 'auto',
        },
    },
    LeftSide: {
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
    },
    RightSide: {
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
    },
    cardImage:{
        width:'589px',
        height: 'auto',
    },
    revealCard: {
        background: '#FFFFFF',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        borderRadius: '61px',
        width:'650px',
        height: 'auto',
        display:'flex',
        justifyContent:'center',
       
    },
    cardBox: {
        marginBottom:'70px',
        width:'650px',
        height: '669px',
        display:'flex',
        justifyContent:'center',
        alignItems: 'center',
    },
    qrContainer:{
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
    },
    qrBox:{
        display: 'flex',
        width: '416px', 
        background: 'white', 
        padding: '16px',
        justifyContent:'center',
    },
    gameCodeText:{
        width: '650px',
        border: '9px solid rgba(255, 255, 255, 0.75)', 
        borderRadius:'25px',
        '& > *': {
          fontWeight: 'bold',  
          color:'rgba(255,255,255)',  
          fontSize: '48px', 
          textAlign:'center',
        }
    },
    redButton: {
        background: 'linear-gradient(90deg, #FC1047 0%, #FC2468 100%);',
        borderRadius: '50px',
        textTransform: 'none',
        fontSize: '25px',
        fontWeight: 500,
        color: 'white',
        minWidth: '30%',
    },
    
}));