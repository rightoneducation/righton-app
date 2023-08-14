import React from 'react';
import { makeStyles, Box} from '@material-ui/core';
import Modal from 'react-modal';
import OnboardingLogo from '../images/OnboardingLogo.png';
import OnboardingPickAGame from '../images/OnboardingPickAGame.png';
import OnboardingShareYourGame from '../images/OnboardingShareYourGame.png';
import OnboardingPlayOnAnyDevice from '../images/OnboardingPlayOnAnyDevice.png';
import OnboardingJoinTheGame from '../images/OnboardingJoinTheGame.png';
import {useMediaQuery} from 'react-responsive'; 
import { Pagination, Navigation, Mousewheel } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function GameModal({ modalOpen, showModalGetApp, handleModalClose}) {
  const smallBreakPoint = 569;
  const isRotate = useMediaQuery({query: `(max-height: ${smallBreakPoint}px)`});
  const isMobile = useMediaQuery({query: `(max-width: ${smallBreakPoint}px)`});
  const slideHieght = isMobile 
    ? '400px' 
    : ( isRotate 
      ? 'calc(100dvh - 150px)'
      : '473px'
  )
  const titleHeight = isMobile  ? '68px' : '54px';
  const imageContainerWidth = isMobile ? '260px' : '500px';
  const imageContainerHeight = isMobile ? '213px' : '300px';
  const textContainerWidth = isMobile  ? '250px' : '300px';
  const classes = useStyles();
  const slideContents = [
    {
      title: 'Welcome to RightOn!',
      image: OnboardingLogo,
      imageAlt: 'Logo',
      description: (
        <>
          <div className={classes.modalBody}> Inspire learning by embracing mistakes!
          <div className={classes.modalBodyBold}> To learn how to start a game, </div> swipe to the left. </div> 
          <div className={classes.modalBody}> For more information about us visit:
          <a href='https://www.rightoneducation.com' className={classes.modalBodyLink}> https://www.rightoneducation.com </a>  </div>
        </>
      ),
    },
    {
      title: "Pick a Game",
      image: OnboardingPickAGame,
      imageAlt: 'Pick a Game',
      description: (
        <> 
          <div className={classes.modalBody}> After the game list has loaded, pick a game. </div>
          <div className={classes.modalBody}> Each game can have one or more questions. </div> 
        </>
      ),
    },
    {
      title: "Launch and Share Your Game",
      image: OnboardingShareYourGame,
      imageAlt: 'Share Your Game',
      description: (
        <> 
          <div className={classes.modalBody}> When you've selected a game, press the
          <div className={classes.modalBodyBold}> Launch Game </div> button. </div> 
          <div className={classes.modalBody}> The Game Code will be displayed at the top.  </div>
        </>
      ),
    },
    {
      title: "Play On Any Device",
      image: OnboardingPlayOnAnyDevice,
      imageAlt: 'Play On Any Device',
      description: (
        <> 
          <div className={classes.modalBody}> Students join through any browser by going to the link below:</div>
          <div><a href='https://play.rightoneducation.com' className={classes.modalBodyLink}> https://play.rightoneducation.com </a> </div>
        </>
      ),
    },
    {
      title: "Join the Game",
      image: OnboardingJoinTheGame,
      imageAlt: 'Join the Game',
      description: (
        <> 
          <div className={classes.modalBody}> Once students enter the Game Code, you're all ready to go! </div>
        </>
      ),
    },
  ]

  const footerContents = (
    <div className={classes.modalFooterContainer} style={{
      width: imageContainerWidth,
      bottom: isRotate ? 0 : 20,
    }}>
      <div className="swiper-custom-pagination" style={{
        display: 'flex',
        justifyContent: 'center',
        '--swiper-pagination-color': 'linear-gradient(90deg, #22ADFF 100%, #FFFFFF 0%)', 
        '--swiper-pagination-bullet-inactive-color': '#CFCFCF', 
        '--swiper-pagination-bullet-size': '12px',
      }}/> 
      <div className={classes.modalClose} onClick={() => handleModalClose(false)} >  Skip  </div> 
    </div>
  );

  const swiperSlide = (slideContent, index) => {
    return (
      <SwiperSlide className={classes.slide} key={index} >
        <Box>
          <div className={classes.modalHead} style={{height: titleHeight}}> {slideContent.title} </div>
        </Box>
        <Box className={classes.imageContainer} style={{height: imageContainerHeight, width: imageContainerWidth}}>
          <img src={slideContent.image} alt={slideContent.imageAlt} className={classes.screenshots} style={{height: '100%'}}/>
        </Box>
        <Box style={{width: textContainerWidth}}>
          {slideContent.description}
        </Box>
      </SwiperSlide>
    )
  }

   return (
    <div className={classes.container}>
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
              maxWidth: isMobile ? '500px' : '800px',
              minWidth: '260px',
              height: slideHieght,
              border: 'none',
              padding: 0,
              touchAction: 'pan-x', // Prevents swipe from scrolling page
              '&::-webkit-scrollbar': {
                // Chrome and Safari
                display: 'none',
              },
              scrollbarWidth: 'none', // Firefox
              '-ms-overflow-style': 'none', // IE and Edge
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
          <div style={{minWidth:0, height: '100%', overflow: 'hidden'}} >
            <Swiper 
              initialSlide={(showModalGetApp ? 1 : 0)} 
              navigation={((isMobile) ? false: true)} 
              pagination={{el: '.swiper-custom-pagination' , clickable:true}}
              modules={[Navigation, Pagination, Mousewheel]} 
              spaceBetween={8} 
              className={classes.swiper} 
              mousewheel={true}
              style={{height: '100%'}}
            > 
              {slideContents.map((slideContent, index) => 
                 swiperSlide(slideContent, index))
              }
                
            </Swiper>
          </div>
        </Modal>
          {modalOpen ? footerContents : null}
        </div>
  );
}

const useStyles = makeStyles({
  container: {
    display: 'flex', 
    flexDirection: 'column', 
    height: '100%',
    touchAction: 'pan-x', // Prevents swipe from scrolling page
    '&::-webkit-scrollbar': {
      // Chrome and Safari
      display: 'none',
    },
    scrollbarWidth: 'none', // Firefox
    '-ms-overflow-style': 'none', // IE and Edge
  },
  imageContainer: {
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '16px'
  },
  screenshots: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    objectPosition: 'center',
  },
  swiper: {
    paddingBottom: '20px',
    '--swiper-navigation-color': 'white',
  },
  slide: {
    display: 'flex',     
    flexDirection: 'column',      
    justifyContent: 'flex-start', 
    alignItems: 'center',  
    textAlign: 'center',
    width: '100%',
    margin: 0,
    height: '100%',
    gap: '16px',
  },
  modalHead: {
    fontSize: '30px',
    fontWeight: '700',
    fontFamily: 'Karla',
    color: '#FFF',
  },
  modalBody: {
    fontSize: '12px',
    fontFamily: 'Poppins',
    color: '#FFF',
    maxWidth: '400px',
    margin: 'auto',
    marginBottom: '10px',
  },
  modalBodyLink: {
    fontSize: '12px',
    fontFamily: 'Poppins',
    color: '#159EFA',
    fontWeight: 700,
    textDecoration: 'underline',
    whiteSpace: 'pre-line',
  },
  modalBodyBold: {
    fontSize: '12px',
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: '#FFF',
    whiteSpace: 'pre-line',
    display: 'inline'
  },
  modalFooterContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 3,
    gap: 10,
    touchAction: 'none' 
  },
  modalClose: {
    fontSize: '14px',
    fontWeight: '500',
    fontFamily: 'Poppins',
    color: '#FFF',
    lineHeight: '22.5px',
    textDecoration: 'underline',
    textAlign: 'center',
    cursor: 'pointer'
  },
});