import React from "react";
import { makeStyles} from "@material-ui/core";
import { Grid } from '@material-ui/core';
import Modal from 'react-modal';
import OnboardingLogo from '../images/OnboardingLogo.svg';
import iosQRCode from '../images/iosQRCode.svg';
import androidQRCode from '../images/androidQRCode.svg';
import { Pagination } from "swiper";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';


export default function GameModal({ modalOpen}) {
  const classes = useStyles();

   return (
      <Modal 
           isOpen={modalOpen}
           contentLabel="Game Modal"
           style={{
            content: {
              position: 'fixed',
              top: '10vh',
              left: '0',
              margin: '0',
              padding: '0',
              backgroundColor: 'rgba(0, 0, 0, 0)',
              border: 'none',
              width: '100%',
              height: '100%',
              //overflow: "break-word",
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
           <Grid container spacing={0} >
            <Grid item xs={0} md={3}></Grid>
            <Grid item xs={12} md={6} className={classes.gridItem}> 
                <Swiper pagination={true} modules={[Pagination]} style={{ '--swiper-pagination-color': 'linear-gradient(90deg, #22ADFF 100%, #FFFFFF 0%)', '--swiper-pagination-bullet-inactive-color': '#CFCFCF', '--swiper-pagination-bullet-size': '12px'}} >
                    <SwiperSlide>
                      <div className={classes.carouselItem}>
                        <div className={classes.modalHead}> Welcome to RightOn! </div>
                        <img src={OnboardingLogo} alt="Logo" className={classes.logo} />
                        <div className={classes.modalBody}> Inspire learning by embracing mistakes! 
                        <div className={classes.modalBodyBold}> To learn how to start a game, {'\n'} swipe to the left.</div> </div> 
                        <div className={classes.modalBody}> For more information about us visit {'\n'}
                        <a href="https://www.rightoneducation.com" className={classes.modalBodyLink}> https://www.rightoneducation.com. </a> </div>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div className={classes.carouselItem}>
                        <div className={classes.modalHead}> Get the RightOn! App </div>
                        <Grid container spacing={1}>
                          <Grid item xs={12} md={6}>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: "center"}}>
                              <img src={iosQRCode} alt="iOS QR Code" className={classes.qrCode} />
                              <div className={classes.qrText}> https://testflight.apple.com/join/0FwryrId </div>
                            </div>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: "center"}}>
                              <img src={androidQRCode} alt="Android QR Code" className={classes.qrCode} />
                              <div className={classes.qrText}> https://play.google.com/store/apps/details?id=com.rightonnew </div>
                            </div>
                          </Grid>
                        </Grid>
                        <div className={classes.modalBody}> To join a game, students need to download the RightOn! {'\n'} app on their phones or Chromebooks. </div>
                      </div>
                    </SwiperSlide>
                </Swiper>
                <div> <a href="https://www.rightoneducation.com" className={classes.modalClose}> Skip </a> </div>
             </Grid>
          </Grid> 
        </Modal> 
  );
}

const useStyles = makeStyles(theme => ({
  gridItem: {
    height: '90vh',
  },
  carouselItem: {
    height: '80vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: "center",
    justifyContent: "center",
    gap: '20px',
  },
  logo: {
    height: '35vh',
  },
  qrCode: {
    height: 'auto',
    maxWidth: '70%',
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
    whiteSpace: 'pre-line',
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
