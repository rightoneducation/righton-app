import React, { useRef, useState } from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import type { SwiperRef } from 'swiper/react';
import 'swiper/css';
import { ScreenSize } from '../../lib/WebsiteModels';
import PaginationContainerStyled from '../../lib/styledcomponents/PaginationContainerStyled';

import positiveZigZagMonster1 from '../../images/positiveZigZagMonster1.svg';
import positiveZigZagMonster2 from '../../images/positiveZigZagMonster2.svg';
import positiveZigZagMonster3 from '../../images/positiveZigZagMonster3.svg';
import zigZagQ1 from '../../images/zigzag/zigzagQ1.svg';
import zigZagQ1S1 from '../../images/zigzag/zigzagQ1S1.svg';
import zigZagQ1S2 from '../../images/zigzag/zigzagQ1S2.svg';
import zigZagQ1S3 from '../../images/zigzag/zigzagQ1S3.svg';
import zigZagQ1S4 from '../../images/zigzag/zigzagQ1S4.svg';
import zigZagQ2 from '../../images/zigzag/zigzagQ2.svg';
import zigZagQ2S1 from '../../images/zigzag/zigzagQ2S1.svg';
import zigZagQ2S2 from '../../images/zigzag/zigzagQ2S2.svg';
import zigZagQ2S3 from '../../images/zigzag/zigzagQ2S3.svg';
import zigZagQ2S4 from '../../images/zigzag/zigzagQ2S4.svg';
import zigZagQ3 from '../../images/zigzag/zigzagQ3.svg';
import zigZagQ3S1 from '../../images/zigzag/zigzagQ3S1.svg';
import zigZagQ3S2 from '../../images/zigzag/zigzagQ3S2.svg';
import zigZagQ3S3 from '../../images/zigzag/zigzagQ3S3.svg';
import zigZagQ3S4 from '../../images/zigzag/zigzagQ3S4.svg';
import zigZagNavLeft from '../../images/zigzag/zigzagNavLeft.svg';
import zigZagNavRight from '../../images/zigzag/zigzagNavRight.svg';

interface ZigZagContainerProps {
  screenSize: ScreenSize;
}

export const ZigZagContainer = ({ screenSize }: ZigZagContainerProps) => { // eslint-disable-line
  const theme = useTheme();
  const swiperQ1Ref = useRef<SwiperRef>(null);
  const swiperQ2Ref = useRef<SwiperRef>(null);
  const swiperQ3Ref = useRef<SwiperRef>(null);
  const [isQ1Beginning, setIsQ1Beginning] = useState(true);
  const [isQ1End, setIsQ1End] = useState(false);
  const [isQ2Beginning, setIsQ2Beginning] = useState(true);
  const [isQ2End, setIsQ2End] = useState(false);
  const [isQ3Beginning, setIsQ3Beginning] = useState(true);
  const [isQ3End, setIsQ3End] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [previousQuestion, setPreviousQuestion] = useState(0);

  const smallPadding = theme.sizing.containerPadding[ScreenSize.SMALL];
  const medPadding = theme.sizing.containerPadding[ScreenSize.MEDIUM];
  const largePadding = theme.sizing.containerPadding[ScreenSize.LARGE];
  const largestGap = `${theme.sizing.xLgPadding}px`;
  const primaryGap = `${theme.sizing.lgPadding}px`;
  const secondaryGap = `${theme.sizing.mdPadding}px`;
  const tertiaryGap = `${theme.sizing.smPadding}px`;
  const smallGap = `${theme.sizing.xSmPadding}px`;

  const zigZagLg = 1450;
  const isZigZagLarge = useMediaQuery(`(min-width: ${zigZagLg}px)`);

  // Override screenSize for ZigZag: if LARGE but not wide enough, use MEDIUM
  const screenSizeZigZag =
    screenSize === ScreenSize.LARGE && !isZigZagLarge
      ? ScreenSize.MEDIUM
      : screenSize;

  const slides = {
    question1: [zigZagQ1S1, zigZagQ1S2, zigZagQ1S3, zigZagQ1S4],
    question2: [zigZagQ2S1, zigZagQ2S2, zigZagQ2S3, zigZagQ2S4],
    question3: [zigZagQ3S1, zigZagQ3S2, zigZagQ3S3, zigZagQ3S4],
  };

  const questionKeys = ['question1', 'question2', 'question3'] as const;

  const questionTitleSlides = [zigZagQ1, zigZagQ2, zigZagQ3];
  const monsters = [
    positiveZigZagMonster1,
    positiveZigZagMonster2,
    positiveZigZagMonster3,
  ];

  switch (screenSizeZigZag) {
    case ScreenSize.SMALL:
    case ScreenSize.MEDIUM:
      return (
        <Box
          style={{
            width: '100%',
            height: '100%',
            minHeight: '560px',
          }}
        >
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              padding:
                screenSize === ScreenSize.SMALL ? smallPadding : medPadding,
              boxSizing: 'border-box',
              gap: largestGap,
            }}
          >
            <Box
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                boxSizing: 'border-box',
                gap: secondaryGap,
              }}
            >
              {/* TODO: title text */}
              <Typography
                sx={{
                  width: '100%',
                  lineHeight: '1.0',
                  fontSize: '40px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  fontStyle: 'italic',
                  color: '#FF3A6A',
                  textAlign: 'left',
                }}
              >
                ZigZag{' '}
                <Typography
                  sx={{
                    lineHeight: '1.0',
                    fontSize: '40px',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 700,
                    fontStyle: 'normal',
                    color: '#FFFFFF',
                    display: 'inline-block',
                    textAlign: 'left',
                  }}
                >
                  {' '}
                  Meets Positive Culture of Error{' '}
                </Typography>
              </Typography>
              <Typography
                sx={{
                  width: '100%',
                  fontSize: '20px',
                  lineHeight: '20px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 400,
                  color: '#FFFFFF',
                  textAlign: 'left',
                }}
              >
                Start each day with a spark of curiosity! ZigZag is a web-based
                game that delivers a quick, thought-provoking question that will
                get you thinking outside the box. From number puzzles to science
                mysteries to surprising fun facts, each one invites discussion
                and discovery — across math, STEM, and beyond.
              </Typography>
            </Box>
            <Box
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                paddingLeft: screenSize === ScreenSize.SMALL ? '0px' : '60px',
                paddingRight: screenSize === ScreenSize.SMALL ? '0px' : '60px',
                boxSizing: 'border-box',
                gap: secondaryGap,
              }}
            >
              <Box
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'space-between',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  gap: primaryGap,
                }}
              >
                <Box style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', gap: secondaryGap}}>
                  {/* TODO: title text */}
                  <Typography
                    sx={{
                      width: '100%',
                      lineHeight: '1.0',
                      fontSize: '40px',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      textAlign: 'left',
                    }}
                  >
                    Phase 1: Zig for the facts
                  </Typography>
                  <Typography
                    sx={{
                      width: '100%',
                      fontSize: '20px',
                      lineHeight: '20px',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 400,
                      color: '#FFFFFF',
                      textAlign: 'left',
                    }}
                  >
                    Choose the{' '}
                    <Typography
                      sx={{
                        lineHeight: '1.0',
                        fontSize: '20px',
                        fontFamily: 'Poppins, sans-serif',
                        color: '#FF3A6A',
                        display: 'inline-block',
                        textAlign: 'left',
                      }}
                    >
                      {' '}
                      correct{' '}
                    </Typography>{' '}
                    answer.
                  </Typography>
                </Box>
                <Box style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', gap: secondaryGap}}>
                  {/* TODO: title text */}
                  <Typography
                    sx={{
                      width: '100%',
                      lineHeight: '1.0',
                      fontSize: '40px',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      textAlign: 'left',
                    }}
                  >
                    Phase 2: Zag for the fun
                  </Typography>
                  <Typography
                    sx={{
                      width: '100%',
                      fontSize: '20px',
                      lineHeight: '20px',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 400,
                      color: '#FFFFFF',
                      textAlign: 'left',
                    }}
                  >
                    Choose the{' '}
                    <Typography
                      sx={{
                        lineHeight: '1.0',
                        fontSize: '20px',
                        fontFamily: 'Poppins, sans-serif',
                        color: '#FF3A6A',
                        display: 'inline-block',
                        textAlign: 'left',
                      }}
                    >
                      {' '}
                      most popular wrong{' '}
                    </Typography>{' '}
                    answer.
                  </Typography>
                </Box>
              </Box>
            </Box>
            {/* Monster Container */}
            <Box
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                gap: secondaryGap,
              }}
            >
              <Box>
                {monsters.map((monster, index) => (
                  <img
                    key={monster}
                    src={monster}
                    alt={`monster${index + 1}`}
                    style={{
                      opacity: activeQuestion === index ? 1 : 0,
                      transition: 'opacity 0.3s ease-in-out',
                      height: activeQuestion === index ? 'auto' : '0',
                      overflow: 'hidden',
                    }}
                  />
                ))}
              </Box>
              {/* Question Button Container */}
              <Box
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: smallGap,
                }}
              >
                {Array.from({ length: 3 }).map((_, index) => (
                  <Box
                    style={{
                      width: '75px',
                      height: '55px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      borderRadius: '48px',
                      border: '5px solid #494949',
                      background:
                        index === activeQuestion ? '#494949' : 'transparent',
                      boxSizing: 'border-box',
                    }}
                    onClick={() => {
                      setPreviousQuestion(activeQuestion);
                      setActiveQuestion(index);
                      // Reset swiper to first slide when switching questions
                      if (swiperQ1Ref.current?.swiper) {
                        swiperQ1Ref.current.swiper.slideTo(0);
                      }
                      if (swiperQ2Ref.current?.swiper) {
                        swiperQ2Ref.current.swiper.slideTo(0);
                      }
                      if (swiperQ3Ref.current?.swiper) {
                        swiperQ3Ref.current.swiper.slideTo(0);
                      }
                    }}
                  >
                    <Typography
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '40px',
                        fontWeight: 600,
                        color: '#FFFFFF',
                        textAlign: 'center',
                        opacity: index === activeQuestion ? 1 : 0.3,
                      }}
                    >
                      {index + 1}
                    </Typography>
                  </Box>
                ))}
              </Box>
              {/* Question Slides Container */}
              <Box
                style={{
                  width: '100%',
                  maxWidth: '500px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: primaryGap,
                }}
              >
                <Box
                  style={{
                    width: '100%',
                    height: '100%',

                    boxSizing: 'border-box',
                  }}
                >
                  <img
                    src={questionTitleSlides[activeQuestion]}
                    alt="question slide"
                    style={{ width: '100%' }}
                  />
                </Box>
                <Box
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: secondaryGap,
                  }}
                >
                  {screenSizeZigZag === ScreenSize.MEDIUM && (
                    <Box
                      onClick={() => swiperQ1Ref.current?.swiper.slidePrev()}
                      style={{
                        cursor: 'pointer',
                        zIndex: 10,
                        opacity: isQ1Beginning ? 0.3 : 1,
                      }}
                    >
                      <img src={zigZagNavLeft} alt="zigZagNavLeft" />
                    </Box>
                  )}
                  <Box
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: secondaryGap,
                    }}
                  >
                    <Swiper
                      ref={swiperQ1Ref}
                      slidesPerView={1}
                      spaceBetween="60px"
                      onSlideChange={(swiper: any) => {
                        setIsQ1Beginning(swiper.isBeginning);
                        setIsQ1End(swiper.isEnd);
                      }}
                      modules={[Pagination]}
                      pagination={{
                        el: '.swiper-pagination-container',
                        bulletClass: 'swiper-pagination-bullet',
                        bulletActiveClass: 'swiper-pagination-bullet-active',
                        clickable: true,
                        renderBullet(index: number, className: string) {
                          return `<span class="${className}" style="width:12px; height:12px; border-radius:12px;"></span>`;
                        },
                      }}
                      style={{ width: '100%' }}
                    >
                      {slides[questionKeys[activeQuestion]].map(
                        (slide: string, index: number) => (
                          <SwiperSlide
                            key={`question${activeQuestion + 1}-slide-${slide}`}
                          >
                            <img
                              src={slide}
                              alt={`zigZagSlide${index}`}
                              style={{ width: `100%` }}
                            />
                          </SwiperSlide>
                        ),
                      )}
                    </Swiper>
                    <PaginationContainerStyled className="swiper-pagination-container" />
                  </Box>
                  {screenSizeZigZag === ScreenSize.MEDIUM && (
                    <Box
                      onClick={() => swiperQ1Ref.current?.swiper.slideNext()}
                      style={{
                        cursor: 'pointer',
                        zIndex: 10,
                        opacity: isQ1End ? 0.3 : 1,
                      }}
                    >
                      <img src={zigZagNavRight} alt="zigZagNavRight" />
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      );
    case ScreenSize.LARGE:
    default:
      return (
        <Box
          style={{
            width: '100%',
            height: '100%',
            minHeight: '560px',
          }}
        >
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              padding: largePadding,
              boxSizing: 'border-box',
              gap: largestGap,
            }}
          >
            <Box
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                paddingLeft: '166px',
                paddingRight: '166px',
                boxSizing: 'border-box',
                gap: secondaryGap
              }}
            >
              {/* TODO: title text */}
              <Typography
                sx={{
                  width: '100%',
                  lineHeight: '1.0',
                  fontSize: '40px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  fontStyle: 'italic',
                  color: '#FF3A6A',
                  textAlign: 'center',
                }}
              >
                ZigZag{' '}
                <Typography
                  sx={{
                    lineHeight: '1.0',
                    fontSize: '40px',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 700,
                    fontStyle: 'normal',
                    color: '#FFFFFF',
                    display: 'inline-block',
                    textAlign: 'center',
                  }}
                >
                  {' '}
                  Meets Positive Culture of Error{' '}
                </Typography>
              </Typography>
              <Typography
                sx={{
                  width: '100%',
                  fontSize: '20px',
                  lineHeight: '20px',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 400,
                  color: '#FFFFFF',
                  textAlign: 'center',
                }}
              >
                Start each day with a spark of curiosity! ZigZag is a web-based
                game that delivers a quick, thought-provoking question that will
                get you thinking outside the box. From number puzzles to science
                mysteries to surprising fun facts, each one invites discussion
                and discovery — across math, STEM, and beyond.
              </Typography>
            </Box>
            <Box
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                paddingLeft: '166px',
                paddingRight: '166px',
                boxSizing: 'border-box',
                gap: secondaryGap,
              }}
            >
              <Box
                style={{
                  display: 'flex',
                  alignItems: 'space-between',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  gap: primaryGap,
                }}
              >
                <Box display='flex' flexDirection='column' width='100%' gap={secondaryGap}>
                  {/* TODO: title text */}
                  <Typography
                    sx={{
                      width: '100%',
                      lineHeight: '1.0',
                      fontSize: '40px',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      textAlign: 'center',
                    }}
                  >
                    Phase 1: Zig for the facts
                  </Typography>
                  <Typography
                    sx={{
                      width: '100%',
                      fontSize: '20px',
                      lineHeight: '20px',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 400,
                      color: '#FFFFFF',
                      textAlign: 'center',
                    }}
                  >
                    Choose the{' '}
                    <Typography
                      sx={{
                        lineHeight: '1.0',
                        fontSize: '20px',
                        fontFamily: 'Poppins, sans-serif',
                        color: '#FF3A6A',
                        display: 'inline-block',
                        textAlign: 'center',
                      }}
                    >
                      {' '}
                      correct{' '}
                    </Typography>{' '}
                    answer.
                  </Typography>
                </Box>
                <Box display='flex' flexDirection='column' width='100%' gap={secondaryGap}>
                  {/* TODO: title text */}
                  <Typography
                    sx={{
                      width: '100%',
                      lineHeight: '1.0',
                      fontSize: '40px',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      textAlign: 'center',
                    }}
                  >
                    Phase 2: Zag for the fun
                  </Typography>
                  <Typography
                    sx={{
                      width: '100%',
                      fontSize: '20px',
                      lineHeight: '20px',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 400,
                      color: '#FFFFFF',
                      textAlign: 'center',
                    }}
                  >
                    Choose the{' '}
                    <Typography
                      sx={{
                        lineHeight: '1.0',
                        fontSize: '20px',
                        fontFamily: 'Poppins, sans-serif',
                        color: '#FF3A6A',
                        display: 'inline-block',
                        textAlign: 'center',
                      }}
                    >
                      {' '}
                      most popular wrong{' '}
                    </Typography>{' '}
                    answer.
                  </Typography>
                </Box>
              </Box>
            </Box>
            {/* ZigZag Slide Container 1 */}
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                gap: primaryGap,
              }}
            >
              <Box>
                <img
                  src={positiveZigZagMonster1}
                  alt="positiveZigZagMonster1"
                />
              </Box>
              <Box>
                <img src={zigZagQ1} alt="zig zag q1" />
              </Box>
              <Box
                style={{
                  width: '100%',
                  height: '100%',
                  maxWidth: '600px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <Box
                  onClick={() => swiperQ1Ref.current?.swiper.slidePrev()}
                  style={{
                    cursor: 'pointer',
                    zIndex: 10,
                    opacity: isQ1Beginning ? 0.3 : 1,
                  }}
                >
                  <img src={zigZagNavLeft} alt="zigZagNavLeft" />
                </Box>
                <Swiper
                  ref={swiperQ1Ref}
                  slidesPerView={1}
                  spaceBetween="60px"
                  onSlideChange={(swiper: any) => {
                    setIsQ1Beginning(swiper.isBeginning);
                    setIsQ1End(swiper.isEnd);
                  }}
                >
                  {slides.question1.map((slide: string, index: number) => (
                    <SwiperSlide key={`question1-slide-${slide}`}>
                      <img src={slide} alt={`zigZagSlide${index}`} />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <Box
                  onClick={() => swiperQ1Ref.current?.swiper.slideNext()}
                  style={{
                    cursor: 'pointer',
                    zIndex: 10,
                    opacity: isQ1End ? 0.3 : 1,
                  }}
                >
                  <img src={zigZagNavRight} alt="zigZagNavRight" />
                </Box>
              </Box>
            </Box>
            {/* horizontal line */}
            <Box
              style={{
                width: '100%',
                height: '1px',
                background: '#FFF',
              }}
            />
            {/* ZigZag Slide Container 2 */}
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                gap: primaryGap,
              }}
            >
              <Box>
                <img
                  src={positiveZigZagMonster2}
                  alt="positiveZigZagMonster2"
                />
              </Box>
              <Box>
                <img src={zigZagQ2} alt="zig zag q2" />
              </Box>
              <Box
                style={{
                  width: '100%',
                  height: '100%',
                  maxWidth: '600px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <Box
                  onClick={() => swiperQ2Ref.current?.swiper.slidePrev()}
                  style={{
                    cursor: 'pointer',
                    zIndex: 10,
                    opacity: isQ2Beginning ? 0.3 : 1,
                  }}
                >
                  <img src={zigZagNavLeft} alt="zigZagNavLeft" />
                </Box>
                <Swiper
                  ref={swiperQ2Ref}
                  slidesPerView={1}
                  spaceBetween="60px"
                  onSlideChange={(swiper: any) => {
                    setIsQ2Beginning(swiper.isBeginning);
                    setIsQ2End(swiper.isEnd);
                  }}
                >
                  {slides.question2.map((slide: string, index: number) => (
                    <SwiperSlide key={`question1-slide-${slide}`}>
                      <img src={slide} alt={`zigZagSlide${index}`} />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <Box
                  onClick={() => swiperQ2Ref.current?.swiper.slideNext()}
                  style={{
                    cursor: 'pointer',
                    zIndex: 10,
                    opacity: isQ2End ? 0.3 : 1,
                  }}
                >
                  <img src={zigZagNavRight} alt="zigZagNavRight" />
                </Box>
              </Box>
            </Box>
            {/* horizontal line */}
            <Box
              style={{
                width: '100%',
                height: '1px',
                background: '#FFF',
              }}
            />
            {/* ZigZag Slide Container 3 */}
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                gap: primaryGap,
              }}
            >
              <Box>
                <img
                  src={positiveZigZagMonster3}
                  alt="positiveZigZagMonster3"
                />
              </Box>
              <Box>
                <img src={zigZagQ3} alt="zig zag q3" />
              </Box>
              <Box
                style={{
                  width: '100%',
                  height: '100%',
                  maxWidth: '600px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <Box
                  onClick={() => swiperQ3Ref.current?.swiper.slidePrev()}
                  style={{
                    cursor: 'pointer',
                    zIndex: 10,
                    opacity: isQ3Beginning ? 0.3 : 1,
                  }}
                >
                  <img src={zigZagNavLeft} alt="zigZagNavLeft" />
                </Box>
                <Swiper
                  ref={swiperQ3Ref}
                  slidesPerView={1}
                  spaceBetween="60px"
                  onSlideChange={(swiper: any) => {
                    setIsQ3Beginning(swiper.isBeginning);
                    setIsQ3End(swiper.isEnd);
                  }}
                >
                  {slides.question3.map((slide: string, index: number) => (
                    <SwiperSlide key={`question1-slide-${slide}`}>
                      <img src={slide} alt={`zigZagSlide${index}`} />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <Box
                  onClick={() => swiperQ3Ref.current?.swiper.slideNext()}
                  style={{
                    cursor: 'pointer',
                    zIndex: 10,
                    opacity: isQ3End ? 0.3 : 1,
                  }}
                >
                  <img src={zigZagNavRight} alt="zigZagNavRight" />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      );
  }
};
