import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { ScreenSize } from '../lib/WebsiteModels';

import Handup from '../images/monsterhandup.svg';

import 'swiper/css';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'swiper/css/navigation';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'swiper/css/pagination';

const OuterContainer = styled(Box)<{ clicked: boolean }>(({ clicked }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '48px',
  padding: '48px',
  transition: 'width 0.3s ease-in-out, height 0.3s ease-in-out',
}));
/* CHANGE: add single grid area + anchor children to top/left so margins become offsets */
const VennContainer = styled(Box)<{ clicked: boolean }>(({ clicked }) => ({
  display: 'grid',
  gridTemplateAreas: '"stack"',
  justifyContent: 'start',
  alignItems: 'start',
  transition: 'width 0.3s ease-in-out, height 0.3s ease-in-out',
}));
const vennData = [
  { label: 'Curriculum', color: 'rgba(204, 153, 204, 0.85)', z: 2 },
  { label: 'Assessment', color: 'rgba(102, 102, 204, 0.85)', z: 2 },
  {
    label: 'Tech-Enabled Supplemental Learning',
    color: 'rgba(102, 204, 221, 0.85)',
    z: 1,
  },
];
/* CHANGE: numeric geometry so we can reuse for margins */
const circleGeom = [
  {
    dDefault: 425,
    dClicked: 348.82,
    xDefault: -0.5,
    yDefault: 0,
    xClicked: -0.41,
    yClicked: 0,
  },
  {
    dDefault: 425,
    dClicked: 348.82,
    xDefault: 355.5,
    yDefault: 0,
    xClicked: 291.77,
    yClicked: 0,
  },
  {
    dDefault: 425,
    dClicked: 348.48,
    xDefault: 180.5,
    yDefault: 297,
    xClicked: 148.14,
    yClicked: 243.52,
  },
];

const circleGeomMediumSmall = [
  {
    dMedium: 297,
    dSmall: 155.91,
    xMedium: 0,
    yMedium: 0,
    xSmall: -0.09,
    ySmall: 0,
  },
  {
    dMedium: 297,
    dSmall: 155.91,
    xMedium: 231,
    yMedium: 0,
    xSmall: 121.18,
    ySmall: 0,
  },
  {
    dMedium: 297,
    dSmall: 155.91,
    xMedium: 115,
    yMedium: 191,
    xSmall: 60.28,
    ySmall: 100.27,
  },
];

function getCircleBox(idx: number, clicked: boolean) {
  const g = circleGeom[idx];
  return {
    d: clicked ? g.dClicked : g.dDefault,
    x: clicked ? g.xClicked : g.xDefault,
    y: clicked ? g.yClicked : g.yDefault,
  };
}

function getCircleBoxMediumSmall(idx: number, screensize: ScreenSize) {
  const g = circleGeomMediumSmall[idx];
  return {
    d: screensize === ScreenSize.MEDIUM ? g.dMedium : g.dSmall,
    x: screensize === ScreenSize.MEDIUM ? g.xMedium : g.xSmall,
    y: screensize === ScreenSize.MEDIUM ? g.yMedium : g.ySmall,
  };
}


/* CHANGE: Circle now just the visual; no transform */
const Circle = styled(Box)<{
  selected: boolean;
  clicked: boolean;
  idx: number;
}>(({ selected, clicked, idx }) => ({
  gridArea: 'stack',
  position: 'relative',
  borderRadius: '50%',
  background: vennData[idx].color,
  opacity: selected ? 0.85 : 0.65,
  zIndex: vennData[idx].z,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  // transition: 'box-shadow 0.3s, opacity 0.3s, width 0.3s, height 0.3s, margin 0.3s',
}));
/* CHANGE: MascotImg no transform; position via margins */
const MascotImg = styled('img')<{ clicked: boolean }>(({ clicked }) => ({
  gridArea: 'stack',
  position: 'relative',
  transition: 'width 0.3s, height 0.3s, margin 0.3s',
}));
const Label = styled(Typography)(({ theme }) => ({
  color: '#FFFFFF',
  fontWeight: 700,
  fontSize: '40px',
  textAlign: 'center',
  pointerEvents: 'none',
  userSelect: 'none',
  lineHeight: '1.2',
}));

const SwiperContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  boxSizing: 'border-box',
  gap: '48px',
  '& .swiper-pagination-bullet': {
    width: '30px',
    height: '10px',
    borderRadius: '8px',
    background: 'rgba(255, 255, 255, 0.5)',
    opacity: 1,
  },
  '& .swiper-pagination-bullet-active': {
    background: '#FF3A6A',
  },
}));

export type VennSelection = 0 | 1 | 2 | null;
export default function VennDiagram({
  onSelect,
  selected,
  screensize,
}: {
  onSelect?: (idx: VennSelection) => void;
  selected?: VennSelection;
  screensize: ScreenSize;
}) {
  const [internalSelected, setInternalSelected] = useState<VennSelection>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [resetPhase, setResetPhase] = useState<
    'idle' | 'fadingOut' | 'fadingIn'
  >('idle');
  const [containerKey, setContainerKey] = useState(0); // for remounting container
  const sel = selected !== undefined ? selected : internalSelected;
  const clicked = sel !== null;

  // mascot geometry
  const mascot = {
    w: clicked ? 102.09 : 118.8,
    h: clicked ? 82.79 : 100.97,
    x: clicked ? 270.02 : 329,
    y: clicked ? 203.89 : 245,
  };



  // Animation variants
  const containerVariants = {
    initial: { opacity: 1 },
    fadeOut: { opacity: 0, transition: { duration: 0.5 } },
    fadeIn: { opacity: 1, transition: { duration: 0.5 } },
  };
  const vennVariants = {
    initial: { opacity: 1 },
    fadeOut: { opacity: 0, transition: { duration: 0.5 } },
    fadeIn: { opacity: 1, transition: { duration: 0.5 } },
  };
  const textVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  // Handle circle click
  const handleCircleClick = (idx: VennSelection) => {
    // Deselect: user clicks already-selected circle
    if (hasInteracted && sel === idx) {
      setResetPhase('fadingOut');
      return;
    }
    if (!hasInteracted) {
      setIsFadingOut(true);
      setInternalSelected(idx);
    } else {
      const newSelection = sel === idx ? null : idx;
      setInternalSelected(newSelection);
      onSelect?.(newSelection);
    }
  };

  // When fade out completes, set interaction and selection, then fade in
  const handleVennFadeOutComplete = () => {
    if (!hasInteracted && isFadingOut) {
      setHasInteracted(true);
      setIsFadingOut(false);
      // Set selection to the first clicked circle
      setInternalSelected(sel);
      onSelect?.(sel);
    }
  };

  // Handle container animation complete
  const handleContainerAnimationComplete = () => {
    if (resetPhase === 'fadingOut') {
      setInternalSelected(null);
      setHasInteracted(false);
      setIsFadingOut(false);
      setResetPhase('fadingIn');
      setContainerKey((k) => k + 1); // force remount for fade-in
    } else if (resetPhase === 'fadingIn') {
      setResetPhase('idle');
    }
  };

  // Determine animation state for the container
  let containerInitial = 'initial';
  let containerAnimate = 'fadeIn';
  if (resetPhase === 'fadingOut') {
    containerAnimate = 'fadeOut';
  } else if (resetPhase === 'fadingIn') {
    containerInitial = 'fadeOut';
    containerAnimate = 'fadeIn';
  }

  const renderVennDiagramArray = [
    (screensize === ScreenSize.LARGE) ? (
    <motion.div
      key={containerKey}
      variants={containerVariants}
      initial={containerInitial}
      animate={containerAnimate}
      onAnimationComplete={handleContainerAnimationComplete}
    >
      <OuterContainer clicked={clicked}>
        <AnimatePresence initial={false}>
          {(!hasInteracted || (hasInteracted && !isFadingOut)) && (
            <motion.div
              key="venn"
              variants={vennVariants}
              initial="initial"
              animate={isFadingOut ? 'fadeOut' : 'fadeIn'}
              exit="fadeOut"
              onAnimationComplete={handleVennFadeOutComplete}
              style={{ display: 'flex' }}
            >
              <VennContainer clicked={clicked}>
                {vennData.map((circle, idx) => {
                  const { d, x, y } = getCircleBox(idx, clicked);
                  const adjX = x;
                  const adjY = y;
                  return (
                    <Circle
                      key={circle.label}
                      selected={sel === idx}
                      clicked={clicked}
                      idx={idx}
                      sx={{
                        width: `${d}px`,
                        height: `${d}px`,
                        marginLeft: `${adjX}px`,
                        marginTop: `${adjY}px`,
                      }}
                      onClick={() => {
                        if (!hasInteracted) {
                          setInternalSelected(idx as VennSelection);
                          handleCircleClick(idx as VennSelection);
                        } else {
                          handleCircleClick(idx as VennSelection);
                        }
                      }}
                    >
                      <Label>{circle.label}</Label>
                    </Circle>
                  );
                })}
                <MascotImg
                  src={Handup}
                  alt="Handup"
                  clicked={clicked}
                  style={{
                    width: `${mascot.w}px`,
                    height: `${mascot.h}px`,
                    marginLeft: `${mascot.x}px`,
                    marginTop: `${mascot.y}px`,
                    zIndex: 10,
                  }}
                />
              </VennContainer>
            </motion.div>
          )}
        </AnimatePresence>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AnimatePresence mode="wait">
            {hasInteracted && sel === 0 && !isFadingOut && (
              <motion.div
                key="curriculum"
                variants={textVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ width: '100%' }}
              >
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
                >
                  <Typography
                    sx={{
                      lineHeight: '1.3',
                      fontSize: '24px',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 700,
                      color: '#FFFFFF',
                    }}
                  >
                    Curriculum: Standards-Aligned & Searchable
                  </Typography>
                  <Typography
                    sx={{
                      lineHeight: '1.0',
                      fontSize: '16px',
                      fontFamily: 'Rubik, sans-serif',
                      fontWeight: 400,
                      color: '#FFFFFF',
                    }}
                  >
                    Shorten the time spent on lesson creation by utilizing our
                    collection of
                    <span style={{ color: '#FF3A6A', fontStyle: 'Regular' }}>
                      {' '}
                      teacher-developed{' '}
                    </span>
                    and
                    <span style={{ color: '#FF3A6A', fontStyle: 'Regular' }}>
                      {' '}
                      standards-aligned{' '}
                    </span>
                    games. Alternatively, you can design your own game from
                    scratch or incoporate questions you prefer from other games.
                  </Typography>
                </Box>
              </motion.div>
            )}
            {hasInteracted && sel === 1 && !isFadingOut && (
              <motion.div
                key="assessment"
                variants={textVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ width: '100%' }}
              >
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
                >
                  <Typography
                    sx={{
                      lineHeight: '1.3',
                      fontSize: '24px',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 700,
                      color: '#FFFFFF',
                    }}
                  >
                    Assessment: Embrace Learning Through Mistakes
                  </Typography>
                  <Typography
                    sx={{
                      lineHeight: '1.0',
                      fontSize: '16px',
                      fontFamily: 'Rubik, sans-serif',
                      fontWeight: 400,
                      color: '#FFFFFF',
                    }}
                  >
                    Link your lessions to
                    <span style={{ color: '#FF3A6A', fontStyle: 'Regular' }}>
                      {' '}
                      error-based learning{' '}
                    </span>
                    approaches. RightOn promotes essential
                    <span style={{ color: '#FF3A6A', fontStyle: 'Regular' }}>
                      {' '}
                      SEL{' '}
                    </span>
                    outcomes in math, such as self-efficacy, a sense of
                    belonging, and growth mindsets, which foster long-term
                    learning and resilence.
                  </Typography>
                </Box>
              </motion.div>
            )}
            {hasInteracted && sel === 2 && !isFadingOut && (
              <motion.div
                key="tech"
                variants={textVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ width: '100%' }}
              >
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
                >
                  <Typography
                    sx={{
                      lineHeight: '1.3',
                      fontSize: '24px',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 700,
                      color: '#FFFFFF',
                    }}
                  >
                    Tech-Enabled Supplemental Learning: Leveraging AI
                  </Typography>
                  <Typography
                    sx={{
                      lineHeight: '1.0',
                      fontSize: '16px',
                      fontFamily: 'Rubik, sans-serif',
                      fontWeight: 400,
                      color: '#FFFFFF',
                    }}
                  >
                    We collaborate closely with math educators and
                    <span
                      style={{
                        fontWeight: 700,
                        color: '#FF3A6A',
                        fontFamily: 'Poppins, sans-serif',
                      }}
                    >
                      {' '}
                      leverage AI{' '}
                    </span>
                    to reveal and respond to student thinking. Our approach
                    supports both teachers and students by shifting the focus
                    from quick recall and recognition to
                    <span
                      style={{
                        fontWeight: 700,
                        color: '#FF3A6A',
                        fontFamily: 'Poppins, sans-serif',
                      }}
                    >
                      {' '}
                      meaningful engagement{' '}
                    </span>
                    with mathematical reasoning and conceptual understanding.
                  </Typography>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </OuterContainer>
    </motion.div>

    ): (
    <SwiperContainer sx={{ height: screensize === ScreenSize.MEDIUM?'600px': ''}}>
      <Swiper
          modules={[Pagination]}
          spaceBetween={screensize === ScreenSize.SMALL? 24 : 48}
          slidesPerView={screensize === ScreenSize.SMALL? 1.4: 1.6}
          style={{ 
            width: '100%', height: screensize === ScreenSize.MEDIUM?'100%': '',
            paddingBottom:  screensize === ScreenSize.SMALL? '70px' : '',
            
          }}
          centeredSlides
          grabCursor
          freeMode
          pagination={{
            clickable: true,
          }}
        >
        <SwiperSlide style={{padding: '12px', boxSizing: 'border-box',display: 'flex', justifyContent: 'center', alignItems: 'center', width: screensize === ScreenSize.SMALL?'277px': '528px', height: screensize === ScreenSize.SMALL?'267px': '488px'}}>
          <VennContainer clicked={false}>
            {vennData.map((circle, idx) => {
              const { d, x, y } = getCircleBoxMediumSmall(idx, screensize);
              const adjX = x;
              const adjY = y;
              return (
                <Circle
                  key={circle.label}
                  selected={sel === idx}
                  clicked={clicked}
                  idx={idx}
                  sx={{
                    width: `${d}px`,
                    height: `${d}px`,
                    marginLeft: `${adjX}px`,
                    marginTop: `${adjY}px`,
                  }}
                >
                  <Label style={{fontWeight: 700, fontSize: screensize === ScreenSize.SMALL?'15.84px': '24px', lineHeight: '1.3', fontFamily: 'Poppins, sans-serif'}}>{circle.label}</Label>
                </Circle>
                
              );
            })}
            <MascotImg
              src={Handup}
              alt="Handup"
              clicked={clicked}
              style={{
                width: `${screensize === ScreenSize.MEDIUM ? 0 : 40.48}px`,
                height: `${screensize === ScreenSize.MEDIUM ? 0 : 34.34}px`,
                marginLeft: `${screensize === ScreenSize.MEDIUM ? 0 : 117.92}px`,
                marginTop: `${screensize === ScreenSize.MEDIUM ? 0 : 93.27}px`,
                zIndex: 10,
              }}
            />
          </VennContainer>
        </SwiperSlide>
        <SwiperSlide style={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '12px', boxSizing: 'border-box',  height: '100%'}}>
          <Box sx={{borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center',width: '351px', minHeight:'280px', backgroundColor: '#22499C', padding: '12px 24px', boxSizing: 'border-box',}}>
            <Box sx={{display: 'flex', flexDirection: 'column', gap: '12px', width: '100%'}}>
              <Typography sx={{lineHeight: '1.0', fontSize: '20px', fontFamily:'Poppins, sans-serif', fontWeight: 700, color: '#FFFFFF'}}>
                  Curriculum: Standards-Aligned & Searchable
              </Typography>
                <Typography sx={{lineHeight: '1.0', fontSize: '16px', fontFamily:'Rubik, sans-serif', fontWeight: 400, color: '#FFFFFF'}}>
                Shorten the time spent on lesson creation by utilizing our collection of<span style={{color: '#FF3A6A', fontStyle: 'Regular'}}> teacher-developed </span>
                and<span style={{color: '#FF3A6A', fontStyle: 'Regular'}}> standards-aligned </span>games. Alternatively, you can design 
                your own game from scratch or incoporate questions you prefer from other games.
              </Typography>
            </Box>
          </Box>
        </SwiperSlide>
        <SwiperSlide style={{display: 'flex', justifyContent: 'center', alignItems: 'center',padding: '12px', boxSizing: 'border-box',  height: '100%', }}>
          <Box sx={{borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '351px',  minHeight:'280px', backgroundColor: '#22499C', padding: '12px 24px', boxSizing: 'border-box',}}>
            <Box sx={{display: 'flex', flexDirection: 'column', gap: '12px', width: '100%'}}>
              <Typography sx={{lineHeight: '1.0', fontSize: '20px', fontFamily:'Poppins, sans-serif', fontWeight: 700, color: '#FFFFFF'}}>
                Assessment: Embrace Learning Through Mistakes
              </Typography>
              <Typography sx={{lineHeight: '1.0', fontSize: '16px', fontFamily:'Rubik, sans-serif', fontWeight: 400, color: '#FFFFFF'}}>
                Link your lessions to<span style={{color: '#FF3A6A', fontStyle: 'Regular'}}> error-based learning </span>approaches. RightOn promotes essential<span style={{color: '#FF3A6A', fontStyle: 'Regular'}}> SEL </span>
                outcomes in math, such as self-efficacy, a sense of belonging, and growth mindsets, which foster long-term 
                learning and resilence.
              </Typography>
            </Box>
          </Box>
        </SwiperSlide>
        <SwiperSlide style={{display: 'flex', justifyContent: 'center', alignItems: 'center',padding: '12px', boxSizing: 'border-box', height: '100%',}}>
          <Box sx={{borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '351px',  minHeight:'280px', backgroundColor: '#22499C', padding: '12px 24px', boxSizing: 'border-box',}}>
            <Box sx={{display: 'flex', flexDirection: 'column', gap: '12px', width: '100%'}}>
              <Typography sx={{lineHeight: '1.0', fontSize: '20px', fontFamily:'Poppins, sans-serif', fontWeight: 700, color: '#FFFFFF'}}>
                Tech-Enabled Supplemental Learning: Leveraging AI
              </Typography>
                <Typography sx={{lineHeight: '1.0', fontSize: '16px', fontFamily:'Rubik, sans-serif', fontWeight: 400, color: '#FFFFFF'}}>
                  We collaborate closely with math educators and<span style={{fontWeight: 700, color: '#FF3A6A', fontFamily:'Poppins, sans-serif'}}> leverage AI </span>to reveal
                  and respond to student thinking. Our approach supports both teachers and students by shifting the focus from quick recall
                and recognition to<span style={{fontWeight: 700, color: '#FF3A6A', fontFamily:'Poppins, sans-serif'}}> meaningful engagement </span>with mathematical reasoning 
                and conceptual understanding.
              </Typography>
            </Box>
          </Box>
        </SwiperSlide>
      </Swiper>
    </SwiperContainer>
    )
  ]

  return renderVennDiagramArray[0];
}



