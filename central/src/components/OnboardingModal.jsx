import React from 'react';
import { makeStyles} from '@material-ui/core';
import Modal from 'react-modal';
import OnboardingLogo from '../images/OnboardingLogo.png';
import OnboardingPickAGame from '../images/OnboardingPickAGame.png';
import OnboardingShareYourGame from '../images/OnboardingShareYourGame.png';
import OnboardingPlayOnAnyDevice from '../images/OnboardingPlayOnAnyDevice.png';
import OnboardingJoinTheGame from '../images/OnboardingJoinTheGame.png';
import {useMediaQuery} from 'react-responsive'; 
import { Pagination, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


export default function GameModal({ modalOpen, showModalGetApp, handleModalClose}) {
  const smallBreakPoint = 569;
  const mediumBreakPoint = 991;
  const isTablet = useMediaQuery({ query: `(min-width: ${smallBreakPoint}px) and (max-width: ${mediumBreakPoint}px)` });
  const isMobile = useMediaQuery({query: `(max-width: ${smallBreakPoint}px)`});
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
              backgroundColor: 'rgba(0, 0, 0,  0)',
              margin: 'auto',
              maxWidth: '800px',
              minWidth: '260px',
           
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
          <div style={{minWidth:0, minHeight: '610x', overflow: 'hidden'}} >
            <Swiper initialSlide={(showModalGetApp ? 1 : 0)} navigation={((isMobile || isTablet) ? false: true)} pagination={{clickable:true}} modules={[Navigation, Pagination]} spaceBetween={8} className={classes.swiper} > 
                <SwiperSlide className={classes.slide}>
                 <div style={{height: '100%', display:'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 10}}>
                    <div className={classes.modalHead}> Welcome to RightOn! </div>
                    <div className={classes.imageContainer} style={{height: isMobile ? '30vh' : (isTablet ? '40vh' :'50vh')}}>
                      <img src={OnboardingLogo} alt='Logo' className={classes.screenshots} />
                    </div>
                    <div>
                    <div className={classes.modalBodyBreak}> Inspire learning by embracing mistakes!</div>
                    <div className={classes.modalBody}><div className={classes.modalBodyBold}> To learn how to start a game, {'\n'}</div> swipe to the left. </div> 
                     </div>
                    <div className={classes.modalBody}> For more information about us visit {'\n'}
                    <a href='https://www.rightoneducation.com' className={classes.modalBodyLink}> https://www.rightoneducation.com </a> </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide className={classes.slide}>
                <div style={{height: '100%', display:'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', gap: 10}}>
                    <div className={classes.modalHead}> Pick a Game </div>
                    <div className={classes.imageContainer} style={{height: isMobile ? '30vh' : (isTablet ? '40vh' :'50vh')}}>
                       <img src={OnboardingPickAGame} alt='Pick A Game' className={classes.screenshots} />
                    </div>
                    <div className={classes.modalBodyBreak}> After the game list has loaded, {`\n`} pick a game. </div>
                    <div className={classes.modalBody}> Each game can have one or more questions. </div> 
                  </div>
                </SwiperSlide>
                <SwiperSlide className={classes.slide}>
                <div style={{height: '100%', display:'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 10}}>
                    <div className={classes.modalHead}> Launch and Share Your Game </div>
                    <div className={classes.imageContainer} style={{height: isMobile ? '30vh' : (isTablet ? '40vh' :'50vh')}}>
                     <img src={OnboardingShareYourGame} alt='Pick A Game' className={classes.screenshots} />
                    </div>
                    <div className={classes.modalBodyBreak}> When you've selected a game, press the
                    <div className={classes.modalBodyBold}> Launch Game </div> button to launch a game session. </div> 
                    <div className={classes.modalBodyBreak}> After the game is launched, the Game Code will be displayed at the top of the screen.  </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide className={classes.slide}>
                <div style={{height: '100%', display:'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 10}}>
                    <div className={classes.modalHead}> Play On Any Device </div>
                    <div className={classes.imageContainer} style={{height: isMobile ? '30vh' : (isTablet ? '40vh' :'50vh')}}>
                     <img src={OnboardingPlayOnAnyDevice} alt='Play On Any Device' className={classes.screenshots} />
                    </div>
                    <div className={classes.modalBodyBreak}> Students can join your game session through any browser by going to the link below:</div>
                    <div><a href='https://play.rightoneducation.com' className={classes.modalBodyLink}> https://play.rightoneducation.com </a> </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide className={classes.slide}>
                <div style={{height: '100%', display:'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 10}}>
                    <div className={classes.modalHead}> Join the Game </div>
                    <div className={classes.imageContainer} style={{height: isMobile ? '30vh' : (isTablet ? '40vh' :'50vh')}}>
                      <img src={OnboardingJoinTheGame} alt='Join the Game' className={classes.screenshots} />
                    </div>
                    <div className={classes.modalBodyBreak}> Once students enter the Game Code, {'\n'} you're all ready to go! </div>
                  </div>
                </SwiperSlide>
            </Swiper>
          </div>
        </Modal>
        {modalOpen ? <div className={classes.modalClose} onClick={() => handleModalClose(false)} >  Skip  </div> : null}
        </div>
  );
}

const useStyles = makeStyles({
  logo: {
    height: '35vh',
  },
  imageContainer: {
    position: 'relative',
    height: '100%',
    width: 'auto',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenshots: {
    minWidth: '260px',
    maxWidth: '650px',
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    objectPosition: 'center',
  },
  qrCode: {
    height: '20vh',
  },
  swiper: {
    paddingBottom: '20px',
    '--swiper-pagination-bottom':'0', 
    '--swiper-pagination-color': 'linear-gradient(90deg, #22ADFF 100%, #FFFFFF 0%)', 
    '--swiper-pagination-bullet-inactive-color': '#CFCFCF', 
    '--swiper-pagination-bullet-size': '12px',
    '--swiper-navigation-color': 'white',
  },
  slide: {
    textAlign: 'center',
    margin: '0',
    height: '100%',
  },
  modalHead: {
    fontSize: '30px',
    fontWeight: '700',
    fontFamily: 'Karla',
    color: '#FFF',
    lineHeight: '30px',
    height: '60px',
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
  modalBodyBreak: {
    fontSize: '14px',
    fontFamily: 'Poppins',
    color: '#FFF',
    lineHeight: '25px',
    maxWidth: '400px',
    margin: 'auto',
    marginTop: '10px',
    marginBottom: '10px',
    whiteSpace: 'pre-line'
  },
  modalBodyLink: {
    fontSize: '14px',
    fontFamily: 'Poppins',
    color: '#159EFA',
    lineHeight: '18px',
    fontWeight: 700,
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
    display: 'inline'
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
    cursor: 'pointer'
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
});
