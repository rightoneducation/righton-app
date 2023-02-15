import React from 'react';
import { makeStyles} from '@material-ui/core';
import Modal from 'react-modal';
import OnboardingLogo from '../images/OnboardingLogo.svg';
import OnboardingLogin from '../images/OnboardingLogin.png';
import OnboardingTestFlight from '../images/OnboardingTestFlight.png';
import OnboardingGooglePlay from '../images/OnboardingGooglePlay.png';
import OnboardingPickAGame from '../images/OnboardingPickAGame.png';
import OnboardingLaunchGame1 from '../images/OnboardingLaunchGame1.png';
import OnboardingLaunchGame2 from '../images/OnboardingLaunchGame2.png';
import OnboardingShareGameCode1 from '../images/OnboardingShareGameCode1.png';
import OnboardingShareGameCode2 from '../images/OnboardingShareGameCode2.png';
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';


export default function GameModal({ modalOpen, handleModalClose}) {
  const classes = useStyles();

   return (
    <div>
      <Modal 
           isOpen={modalOpen}
           contentLabel='Game Modal'
           style={{
            content: {
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0)',
              margin: 'auto',
              maxWidth: '800px',
              maxHeight: '670px',
              border: 'none',
             },
             overlay: {
                minHeight: '100vh',
                height: '100%',
                width: '100%',
                overflow: 'hidden',
                margin: 0,
                padding: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.80)',
                zIndex:2,
            }}}
            onRequestClose={() => handleModalClose(false)}
            shouldCloseOnOverlayClick={true}
            appElement={document.getElementById('root') || undefined}
           >
          <div style={{minWidth: 0, minHeight: 0, overflow: 'hidden',}} >
            <Swiper pagination={true} modules={[Pagination]} spaceBetween={8} className={classes.swiper} > 
                <SwiperSlide className={classes.slide}>
                  <div className={classes.modalHead}> Welcome to RightOn! </div>
                  <img src={OnboardingLogo} alt='Logo' className={classes.logo} />
                  <div className={classes.modalBody}> Inspire learning by embracing mistakes! 
                  <div className={classes.modalBodyBold}> To learn how to start a game, swipe to the left.</div> </div> 
                  <div className={classes.modalBody}> For more information about us visit {'\n'}
                  <a href='https://www.rightoneducation.com' className={classes.modalBodyLink}> https://www.rightoneducation.com. </a> </div>
                </SwiperSlide>
                <SwiperSlide className={classes.slide}>
                  <div className={classes.modalHead}> Get the RightOn! App</div>
                  <img src={OnboardingLogin} alt='Login' className={classes.screenshots} />
                  <div className={classes.modalBody}> Your students will need to download the RightOn! app on their phones or Chromebooks. </div>
                  <div className={classes.imageContainer}>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                      <a href='https://testflight.apple.com/join/0FwryrId'> <img src={OnboardingTestFlight} alt='Apple TestFlight' style={{height:'6vh'}} /> </a>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                      <a href='https://play.google.com/store/apps/details?id=com.rightonnew'><img src={OnboardingGooglePlay} alt='Google Play' style={{height:'6vh'}} /> </a>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide className={classes.slide}>
                  <div className={classes.modalHead}> Pick a Game </div>
                  <img src={OnboardingPickAGame} alt='Pick A Game' className={classes.screenshots} />
                  <div className={classes.modalBody}> After the game list has loaded,  select a game. </div>
                  <div className={classes.modalBody}> During this initial beta, <span className={classes.modalBodyBold}> only the first question </span> from a game will be played </div> 
                </SwiperSlide>
                <SwiperSlide className={classes.slide}>
                  <div className={classes.modalHead}> Launch Your Game </div>
                  <div className={classes.imageContainer}>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                      <img src={OnboardingLaunchGame1} alt='Launch Game 1' className={classes.screenshots} />
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                      <img src={OnboardingLaunchGame2} alt='Launch Game 2' className={classes.screenshots} />
                    </div>
                  </div>
                  <div className={classes.modalBody}> When you've selected a game, press the <span className={classes.modalBodyBold}> Launch Game </span> button to launch a game session. </div> 
                </SwiperSlide>
                <SwiperSlide className={classes.slide}>
                  <div className={classes.modalHead}> Share Game Code </div>
                  <div className={classes.imageContainer}>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                      <img src={OnboardingShareGameCode1} alt='Share Game Code 1' className={classes.screenshots} />
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                      <img src={OnboardingShareGameCode2} alt='Share Game Code 2' className={classes.screenshots} />
                    </div>
                  </div>
                  <div className={classes.modalBody}> After the game is launched, the Game Code will be displayed at the top of the screen. </div>
                  <div className={classes.modalBody}> Once students enter this code on the app, you're all ready to go! </div>
                </SwiperSlide>
            </Swiper>
          </div>
        </Modal>
        <div className={classes.modalClose} onClick={() => handleModalClose(false)} >  Skip  </div> 
        </div>
  );
}

const useStyles = makeStyles(theme => ({
  logo: {
    height: '35vh',
  },
  screenshots: {
    height: '23vh',
  },
  qrCode: {
    height: '20vh',
  },
  swiper: {
    paddingBottom: '20px',
    maxWidth: '700px',
    '--swiper-pagination-bottom':'0', 
    '--swiper-pagination-color': 'linear-gradient(90deg, #22ADFF 100%, #FFFFFF 0%)', 
    '--swiper-pagination-bullet-inactive-color': '#CFCFCF', 
    '--swiper-pagination-bullet-size': '12px'
  },
  slide: {
    textAlign: 'center',
    margin: 'auto',
    minHeight: '100%',
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '20px',
  },
  modalHead: {
    fontSize: '30px',
    fontWeight: '700',
    fontFamily: 'Karla',
    color: '#FFF',
    lineHeight: '30px',
    paddingBottom: '5px',
  },
  modalBody: {
    fontSize: '14px',
    fontFamily: 'Poppins',
    color: '#FFF',
    lineHeight: '25px',
    maxWidth: '400px',
    margin: 'auto',
    marginTop: '10px',
    marginBottom: '10px',
  },
  modalBodyLink: {
    fontSize: '14px',
    fontFamily: 'Poppins',
    color: '#FFF',
    lineHeight: '18px',
    textDecoration: 'underline',
    whiteSpace: 'pre-line',
  },
  modalBodyBold: {
    fontSize: '14px',
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: '#FFF',
    lineHeight: '18px',
    whiteSpace: 'pre-line',
  },
  modalClose: {
    fontSize: '14px',
    fontWeight: '500',
    fontFamily: 'Poppins',
    color: '#FFF',
    lineHeight: '22.5px',
    textDecoration: 'underline',
    zIndex: 3,
    position: 'absolute',
    bottom: 20,
    left: 0,
    width: '100vw',
    textAlign: 'center',
  },
  qrText: {
    fontSize: '10px',
    fontFamily: 'Poppins',
    color: '#FFF',
    lineHeight: '25px',
    whiteSpace: 'pre-line',
  },
  mySwiper: {
    swiperPaginationColor: '#FFF',
  },
}));
