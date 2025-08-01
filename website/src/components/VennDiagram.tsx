import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';

import Handup from '../images/monsterhandup.png';

const OuterContainer = styled(Box)<{ clicked: boolean }>(({ clicked }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '48px',
  padding: '48px',
  transition: 'width 0.3s ease-in-out, height 0.3s ease-in-out',
  // border: '1px solid pink', // debug
}));
/* CHANGE: add single grid area + anchor children to top/left so margins become offsets */
const VennContainer = styled(Box)<{ clicked: boolean }>(({ clicked }) => ({
  display: 'grid',
  gridTemplateAreas: '"stack"',
  justifyContent: 'start',
  alignItems: 'start',
  // border: '1px solid red', // debug
  transition: 'width 0.3s ease-in-out, height 0.3s ease-in-out',
}));
const vennData = [
  { label: 'Curriculum', color: 'rgba(204, 153, 204, 0.85)', z: 2 },
  { label: 'Assessment', color: 'rgba(102, 102, 204, 0.85)', z: 2 },
  { label: 'Tech-Enabled Supplemental Learning', color: 'rgba(102, 204, 221, 0.85)', z: 1 },
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
function getCircleBox(idx: number, clicked: boolean) {
  const g = circleGeom[idx];
  return {
    d: clicked ? g.dClicked : g.dDefault,
    x: clicked ? g.xClicked : g.xDefault,
    y: clicked ? g.yClicked : g.yDefault,
  };
}
/* CHANGE: Circle now just the visual; no transform */
const Circle = styled(Box)<{ selected: boolean; clicked: boolean; idx: number }>(({ selected, clicked, idx }) => ({
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
  textShadow: '0 2px 8px #0008',
  pointerEvents: 'none',
  userSelect: 'none',
  lineHeight: '1.2',
}));
export type VennSelection = 0 | 1 | 2 | null;
export default function VennDiagram({
  onSelect,
  selected,
}: {
  onSelect?: (idx: VennSelection) => void;
  selected?: VennSelection;
}) {
  const [internalSelected, setInternalSelected] = useState<VennSelection>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [resetPhase, setResetPhase] = useState<'idle' | 'fadingOut' | 'fadingIn'>('idle');
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
      setContainerKey(k => k + 1); // force remount for fade-in
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

  return (
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
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
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
                <Box sx={{display: 'flex', flexDirection: 'column', gap: '24px',}}>
                  <Typography sx={{lineHeight: '1.3', fontSize: '24px', fontFamily:'Poppins, sans-serif', fontWeight: 700, color: '#FFFFFF'}}>
                    Curriculum: Standards-Aligned & Searchable
                  </Typography>
                  <Typography sx={{lineHeight: '1.0', fontSize: '16px', fontFamily:'Rubik, sans-serif', fontWeight: 400, color: '#FFFFFF'}}>
                    Shorten the time spent on lesson creation by utilizing our collection of<span style={{color: '#FF3A6A', fontStyle: 'Regular'}}> teacher-developed </span>
                    and<span style={{color: '#FF3A6A', fontStyle: 'Regular'}}> standards-aligned </span>games. Alternatively, you can design 
                    your own game from scratch or incoporate questions you prefer from other games.
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
                <Box sx={{display: 'flex', flexDirection: 'column', gap: '24px',}}>
                  <Typography sx={{lineHeight: '1.3', fontSize: '24px', fontFamily:'Poppins, sans-serif', fontWeight: 700, color: '#FFFFFF'}}>
                    Assessment: Embrace Learning Through Mistakes
                  </Typography>
                  <Typography sx={{lineHeight: '1.0', fontSize: '16px', fontFamily:'Rubik, sans-serif', fontWeight: 400, color: '#FFFFFF'}}>
                    Link your lessions to<span style={{color: '#FF3A6A', fontStyle: 'Regular'}}> error-based learning </span>approaches. RightOn promotes essential<span style={{color: '#FF3A6A', fontStyle: 'Regular'}}> SEL </span>
                    outcomes in math, such as self-efficacy, a sense of belonging, and growth mindsets, which foster long-term 
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
                <Box sx={{display: 'flex', flexDirection: 'column', gap: '24px',}}>
                  <Typography sx={{lineHeight: '1.3', fontSize: '24px', fontFamily:'Poppins, sans-serif', fontWeight: 700, color: '#FFFFFF'}}>
                    Tech-Enabled Supplemental Learning: Leveraging AI
                  </Typography>
                  <Typography sx={{lineHeight: '1.0', fontSize: '16px', fontFamily:'Rubik, sans-serif', fontWeight: 400, color: '#FFFFFF'}}>
                    We collaborate closely with math educators and<span style={{fontWeight: 700, color: '#FF3A6A', fontFamily:'Poppins, sans-serif'}}> leverage AI </span>to reveal
                    and respond to student thinking. Our approach supports both teachers and students by shifting the focus from quick recall
                    and recognition to<span style={{fontWeight: 700, color: '#FF3A6A', fontFamily:'Poppins, sans-serif'}}> meaningful engagement </span>with mathematical reasoning 
                    and conceptual understanding.
                  </Typography>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </OuterContainer>
    </motion.div>
  );
}