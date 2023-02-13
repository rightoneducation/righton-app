import React from "react";
import { makeStyles} from "@material-ui/core";
import { Grid } from '@material-ui/core';
import Modal from 'react-modal';
import OnboardingLogo from '../images/OnboardingLogo.svg';
import iosQRCode from '../images/iosQRCode.svg';
import androidQRCode from '../images/androidQRCode.svg';
import OnboardingPickAGame from '../images/OnboardingPickAGame.svg';
import OnboardingLaunchGame1 from '../images/OnboardingLaunchGame1.svg';
import OnboardingLaunchGame2 from '../images/OnboardingLaunchGame2.svg';
import OnboardingShareGameCode1 from '../images/OnboardingShareGameCode1.svg';
import OnboardingShareGameCode2 from '../images/OnboardingShareGameCode2.svg';
import { Pagination } from "swiper";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';


export default function GameModal({ modalOpen, handleModalClose}) {
  const classes = useStyles();

   return (
      <Modal 
           isOpen={modalOpen}
           contentLabel="Game Modal"
           style={{
            content: {
              position: 'absolute',
              margin: 'auto',
              width: '70%',
              height: 'auto',
              backgroundColor: 'rgba(0, 0, 0, 0)',
              border: 'none',
              overflow: "hidden",
              gap: '5%',
              zIndex: 1,
             },
             overlay: {
                height: '100%',
                width: '100%',
                minHeight: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.80)',
                overflow: "hidden"
            }}}
            onRequestClose={() => handleModalClose(false)}
            shouldCloseOnOverlayClick={true}
            appElement={document.getElementById('root') || undefined}
           >
          <Swiper pagination={true} modules={[Pagination]}  spaceBetween={30} style={{alignItems: 'center', paddingBottom: '7%', '--swiper-pagination-bottom':'0', '--swiper-pagination-color': 'linear-gradient(90deg, #22ADFF 100%, #FFFFFF 0%)', '--swiper-pagination-bullet-inactive-color': '#CFCFCF', '--swiper-pagination-bullet-size': '12px'}} >
              <SwiperSlide>
                <div className={classes.carouselItem}>
                  <div className={classes.modalHead}> Welcome to RightOn! </div>
                  <img src={OnboardingLogo} alt="Logo" className={classes.logo} />
                  <div className={classes.modalBody}> Inspire learning by embracing mistakes! 
                  <div className={classes.modalBodyBold}> To learn how to start a game, swipe to the left.</div> </div> 
                  <div className={classes.modalBody}> For more information about us visit {'\n'}
                  <a href="https://www.rightoneducation.com" className={classes.modalBodyLink}> https://www.rightoneducation.com. </a> </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className={classes.carouselItem}>
                  <div className={classes.modalHead}> Get the RightOn! App </div>
                  <div className={classes.imageContainer}>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: "center"}}>
                      <img src={iosQRCode} alt="iOS QR Code" className={classes.qrCode} />
                      <div className={classes.qrText}> https://testflight.apple.com/join/0FwryrId </div>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: "center"}}>
                      <img src={androidQRCode} alt="Android QR Code" className={classes.qrCode} />
                      <div className={classes.qrText}> https://play.google.com/store/apps/details?id=com.rightonnew </div>
                    </div>
                  </div>
                  <div className={classes.modalBody}> To join a game, students need to download the RightOn! app on their phones or Chromebooks. </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className={classes.carouselItem}>
                  <div className={classes.modalHead}> Pick a Game </div>
                  <img src={OnboardingPickAGame} alt="Pick A Game" className={classes.logo} />
                  <div className={classes.modalBody}> After the game list has loaded,  select a game. </div>
                  <div className={classes.modalBody}> During this initial beta, <span className={classes.modalBodyBold}> only the first question </span> from a game will be played </div> 
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className={classes.carouselItem}>
                  <div className={classes.modalHead}> Launch Your Game </div>
                  <div className={classes.imageContainer}>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: "center"}}>
                      <img src={OnboardingLaunchGame1} alt="Launch Game 1" className={classes.qrCode} />
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: "center"}}>
                      <img src={OnboardingLaunchGame2} alt="Launch Game 2" className={classes.qrCode} />
                    </div>
                  </div>
                  <div className={classes.modalBody}> When you've selected a game, press the <span className={classes.modalBodyBold}> Launch Game </span> button to launch a game session. </div> 
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className={classes.carouselItem}>
                  <div className={classes.modalHead}> Share Game Code </div>
                  <div className={classes.imageContainer}>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: "center"}}>
                      <img src={OnboardingShareGameCode1} alt="Share Game Code 1" className={classes.qrCode} />
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: "center"}}>
                      <img src={OnboardingShareGameCode2} alt="Share Game Code 2" className={classes.qrCode} />
                    </div>
                  </div>
                  <div className={classes.modalBody}> After the game is launched, the Game Code will be displayed at the top of the screen. </div>
                  <div className={classes.modalBody}> Once students enter this code on the app, you're all ready to go! </div>
                </div>
              </SwiperSlide>
          </Swiper>
          <div className={classes.modalClose} onClick={() => handleModalClose(false)} >  Skip  </div>
        </Modal> 
  );
}

const useStyles = makeStyles(theme => ({
  carouselItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: "center",
    justifyContent: "center",
    overflow: 'hidden',
    gap: '20px',
  },
  logo: {
    height: '35vh',
  },
  qrCode: {
    height: '20vh',
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
    flexWrap: 'wrap',
    gap: '20px',
  },
  modalHead: {
    fontSize: "30px",
    fontWeight: "700",
    fontFamily: 'Karla',
    color: 'white',
    lineHeight: '23.38px',
    textAlign: 'center'
  },
  modalBody: {
    fontSize: "14px",
    fontFamily: 'Poppins',
    color: '#FFFFFF',
    lineHeight: '25px',
    textAlign: 'center',
  },
  modalBodyLink: {
    fontSize: "14px",
    fontFamily: 'Poppins',
    color: '#FFFFFF',
    lineHeight: '18px',
    textDecoration: 'underline',
    textAlign: 'center',
    whiteSpace: 'pre-line',
  },
  modalBodyBold: {
    fontSize: "14px",
    fontFamily: 'Poppins',
    fontWeight: "700",
    color: '#FFFFFF',
    lineHeight: '18px',
    textAlign: 'center',
    whiteSpace: 'pre-line',
  },
  modalClose: {
    fontSize: "14px",
    fontWeight: "500",
    fontFamily: 'Poppins',
    color: '#FFFFFF',
    lineHeight: '22.5px',
    textDecoration: 'underline',
    textAlign: 'center',
  },
  qrText: {
    fontSize: "10px",
    fontFamily: 'Poppins',
    color: '#FFFFFF',
    lineHeight: '25px',
    textAlign: 'center',
    whiteSpace: 'pre-line',
  },
  mySwiper: {
    swiperPaginationColor: "#FFF",
  },
}));
