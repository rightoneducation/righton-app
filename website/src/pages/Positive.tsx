import React from 'react';
import { Box, Typography, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MathSymbolsBackground } from '../lib/styledcomponents/StyledComponents';
import { ScreenSize } from '../lib/WebsiteModels';
import positiveSpace1 from '../images/positiveSpace1.svg';
import positiveSpace2 from '../images/positiveSpace2.svg';
import positivePlanets from '../images/positivePlanets.svg';
import positiveBloopyInSpace from '../images/positiveBloopyInSpace.svg';
import positiveZigZagMonster1 from '../images/positiveZigZagMonster1.svg';
import positiveZigZagMonster2 from '../images/positiveZigZagMonster2.svg';
import positiveZigZagMonster3 from '../images/positiveZigZagMonster3.svg';
import positiveWannaPlayPhone from '../images/positiveWannaPlayPhone.svg';
import positiveEmailArrow from '../images/positiveEmailArrow.svg';
import positiveBloopyRocket from '../images/positiveBloopyRocket.svg';

const PositiveContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100vw',
  boxSizing: 'border-box',
  background: 'transparent',
  transform: 'translateZ(0)',
  overflow: 'hidden',
  gap:0
}));

interface PostiveContainerInterface {
  screenSize: ScreenSize;
}

export function Positive({ screenSize }: PostiveContainerInterface) {// eslint-disable-line
  const navigate = useNavigate();
  return (
    <PositiveContainer>
      <MathSymbolsBackground style={{height: '100%'}}/>
      <Box 
        style={{
          width: '100%',
          height: '100%',
          minHeight: '560px',
          background: 'lavender'
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
            padding: '96px 72px',
            boxSizing: 'border-box',
            gap: '72px'
          }}
        >
          {/* TODO: title text */}
          <Typography sx={{ width: '100%', lineHeight: '1.2', fontSize: '40px', fontFamily: 'Poppins, sans-serif', fontWeight: 700,   color: '#FFFFFF', textAlign: 'center'}}>What is a Positive Culture of Error?</Typography>
          <img 
            src={positiveBloopyInSpace} 
            alt="positiveBloopyInSpace"
            style={{
              width: '100%',
              height: 'auto',
              border: 0,
              outline: 'none',
              display: 'block',
            }}
          />
        </Box>
      </Box>
      {/* The Righton! Universe */}
      <Box 
        style={{
          width: '100%',
          height: '100%',
          minHeight: '560px',
          background: 'lightgrey'
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
            padding: '96px 222px',
            boxSizing: 'border-box',
            gap: '72px'
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
              gap: '24px'
            }}
          > 
            {/* TODO: title text */}
            <Typography sx={{ width: '100%', lineHeight: '1.2', fontSize: '40px', fontFamily: 'Poppins, sans-serif', fontWeight: 700,   color: '#FFFFFF', textAlign: 'center'}}>
              The <Typography sx={{lineHeight: '1.2', fontSize: '40px', fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontStyle: 'italic', color: '#FF3A6A', display: 'inline-block', textAlign: 'center'}}> RightOn! </Typography> Universe
            </Typography>
            <Typography 
              sx={{ 
                width: '100%',
                fontSize: screenSize === ScreenSize.MEDIUM || screenSize === ScreenSize.SMALL? '20px' 
                : '24px',
                lineHeight: screenSize === ScreenSize.MEDIUM || screenSize === ScreenSize.SMALL? '100%' 
                : '130%',
                fontFamily: 'Poppins, sans-serif', fontWeight: 400,   color: '#FFFFFF', textAlign: 'center'
              }}
            >
              At the center of the RightOn! universe is a Positive Culture of Error—our sun—around which all our products and learning practices revolve, fueling growth through curiosity, iteration, and continuous improvement.
            </Typography>
          </Box>
          <img 
            src={positivePlanets} 
            alt="positivePlanets"
            style={{
              width: '100%',
              height: 'auto',
              border: 0,
              outline: 'none',
              display: 'block',
            }}
          />
        </Box>
      </Box>
      <Box 
        style={{
          width: '100%',
          height: '100%',
          minHeight: '560px',
          background: 'grey'
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
            padding: '96px 72px',
            boxSizing: 'border-box',
            gap: '72px'
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
              gap: '24px'
            }}
          >
            {/* TODO: title text */}
            <Typography sx={{ width: '100%', lineHeight: '1.2', fontSize: '40px', fontFamily: 'Poppins, sans-serif', fontWeight: 700,  fontStyle: 'italic', color: '#FF3A6A', textAlign: 'center'}}>
              ZigZag <Typography sx={{lineHeight: '1.2', fontSize: '40px', fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontStyle: 'normal',  color: '#FFFFFF', display: 'inline-block', textAlign: 'center'}}> Meets Positive Culture of Error </Typography>
            </Typography>
            <Typography 
              sx={{ 
                width: '100%',
                fontSize: screenSize === ScreenSize.MEDIUM || screenSize === ScreenSize.SMALL? '20px' 
                : '24px',
                lineHeight: screenSize === ScreenSize.MEDIUM || screenSize === ScreenSize.SMALL? '100%' 
                : '130%',
                fontFamily: 'Poppins, sans-serif', fontWeight: 400,   color: '#FFFFFF', textAlign: 'center'
              }}
            >
              Start each day with a spark of curiosity! ZigZag is a web-based game that delivers a quick, thought-provoking question that will get you thinking outside the box. From number puzzles to science mysteries to surprising fun facts, each one invites discussion and discovery—across math, STEM, and beyond.
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
              gap: '24px'
            }}
          >
            <Box
              style={{
                display: 'flex',
                alignItems: 'space-between',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                gap: '72px'
              }}
            >
              <Box>
                {/* TODO: title text */}
                <Typography sx={{ width: '100%', lineHeight: '1.2', fontSize: '40px', fontFamily: 'Poppins, sans-serif', fontWeight: 700,   color: '#FFFFFF', textAlign: 'center'}}>
                  Phase 1: Zig for the facts
                </Typography>
                <Typography 
                  sx={{ 
                    width: '100%',
                    fontSize: screenSize === ScreenSize.MEDIUM || screenSize === ScreenSize.SMALL? '20px' 
                    : '24px',
                    lineHeight: screenSize === ScreenSize.MEDIUM || screenSize === ScreenSize.SMALL? '100%' 
                    : '130%',
                    fontFamily: 'Poppins, sans-serif', fontWeight: 400,   color: '#FFFFFF', textAlign: 'center'
                  }}
                >
                  Choose the <Typography sx={{lineHeight: '1.2', fontSize: '20px', fontFamily: 'Poppins, sans-serif', color: '#FF3A6A', display: 'inline-block', textAlign: 'center'}}> correct </Typography> answer.
                </Typography>
              </Box>
              <Box>
                {/* TODO: title text */}
                <Typography sx={{ width: '100%', lineHeight: '1.2', fontSize: '40px', fontFamily: 'Poppins, sans-serif', fontWeight: 700,   color: '#FFFFFF', textAlign: 'center'}}>
                  Phase 2: Zag for the fun
                </Typography>
                <Typography 
                  sx={{ 
                    width: '100%',
                    fontSize: screenSize === ScreenSize.MEDIUM || screenSize === ScreenSize.SMALL? '20px' 
                    : '24px',
                    lineHeight: screenSize === ScreenSize.MEDIUM || screenSize === ScreenSize.SMALL? '100%' 
                    : '130%',
                    fontFamily: 'Poppins, sans-serif', fontWeight: 400,   color: '#FFFFFF', textAlign: 'center'
                  }}
                >
                  Choose the <Typography sx={{lineHeight: '1.2', fontSize: '20px', fontFamily: 'Poppins, sans-serif', color: '#FF3A6A', display: 'inline-block', textAlign: 'center'}}> most popular wrong </Typography> answer.
                </Typography>
              </Box>
            </Box>
          </Box>
          {/* ZigZag Slide Container 1 */}
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              height: '100%',
              gap: '48px'
            }}
          >
            <Box>
              <img src={positiveZigZagMonster1} alt="positiveZigZagMonster1" />
            </Box>
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '450px',
                height: '420px',
                background: 'lightgrey'
              }}
            /> 
             <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '450px',
                height: '420px',
                background: 'lightgrey'
              }}
            /> 
          </Box>
          {/* horizontal line */}
          <Box style={{
            width: '100%',
            height: '1px',
            background: '#FFF'
          }}/>
          {/* ZigZag Slide Container 2 */}
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              height: '100%',
              gap: '48px'
            }}
          >
            <Box>
              <img src={positiveZigZagMonster2} alt="positiveZigZagMonster2" />
            </Box>
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '450px',
                height: '420px',
                background: 'lightgrey'
              }}
            /> 
             <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '450px',
                height: '420px',
                background: 'lightgrey'
              }}
            /> 
          </Box>
          {/* horizontal line */}
          <Box style={{
            width: '100%',
            height: '1px',
            background: '#FFF'
          }}/>
          {/* ZigZag Slide Container 3 */}
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              height: '100%',
              gap: '48px'
            }}
          >
            <Box>
              <img src={positiveZigZagMonster3} alt="positiveZigZagMonster3" />
            </Box>
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '450px',
                height: '420px',
                background: 'lightgrey'
              }}
            /> 
             <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '450px',
                height: '420px',
                background: 'lightgrey'
              }}
            /> 
          </Box>
        </Box>
      </Box>  
      <Box 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          minHeight: '560px',
          paddingTop: '96px',
          paddingBottom: '96px',
          background: 'black',
          zIndex:0,
          gap: '96px'
        }}
      >
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            gap: '96px'
          }}
        >
          <Box style={{position: 'relative'}}>
            <img src={positiveWannaPlayPhone} alt="positiveWannaPlayPhone" style={{position: 'relative',zIndex: 21}}/>
            <Box 
              style={{
                width: '350px',
                height: '350px',
                borderRadius: '50%',
                background: 'rgba(210, 210, 210, 0.5)',
                filter: 'blur(24px)',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: -1
              }}
            />
          </Box>
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '48px'
            }}
          >
            {/* TODO: Wanna Play top text */}
            <Box
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '24px'
              }}
            >
              <Typography sx={{ lineHeight: '1.2', fontSize: '40px', fontFamily: 'Poppins, sans-serif', fontWeight: 700,   color: '#FFFFFF', textAlign: 'center'}}>
                Wanna Play?
              </Typography>
              <Typography 
                sx={{ 
                  fontSize: screenSize === ScreenSize.MEDIUM || screenSize === ScreenSize.SMALL? '20px' 
                  : '24px',
                  lineHeight: screenSize === ScreenSize.MEDIUM || screenSize === ScreenSize.SMALL? '100%' 
                  : '130%',
                  fontFamily: 'Poppins, sans-serif', fontWeight: 400,   color: '#FFFFFF', textAlign: 'center'
                }}
              >
                Coming Soon
              </Typography>
            </Box>
            {/* TODO: join email button */}
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #FFF',
                borderRadius: '24px',
                padding: '16px 24px',
                gap: '12px'
              }}
            >
              <Typography sx={{ lineHeight: '1.2', fontSize: '18px', fontFamily: 'Poppins, sans-serif', color: '#FFFFFF', textAlign: 'center'}}>
                Join our Email List
              </Typography>
              <img src={positiveEmailArrow} alt="positiveEmailArrow" />
            </Box>
          </Box>
        </Box>
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%'
          }}
        >
          <Typography sx={{ lineHeight: '1.2', fontSize: '18px', fontFamily: 'Poppins, sans-serif', color: '#FFFFFF', textAlign: 'center'}}>
            Got questions? Contact us at zigzag@rightoneducation.com
          </Typography>
        </Box>
      </Box>
      <Box 
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          minHeight: '560px',
          paddingTop: '96px',
          paddingBottom: '96px',
          background: 'grey',
          zIndex:0,
          gap: '96px'
        }}
      >
        <Box style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingLeft: '144px',
          paddingRight: '144px',
          gap: '24px'
        }}>
          <Typography sx={{ width: '100%', lineHeight: '1.0', fontSize: '40px', fontFamily: 'Poppins, sans-serif', fontWeight: 700,   color: '#FFFFFF', textAlign: 'center'}}>
            Positive Culture of Error: From Ideas to Impact
          </Typography>
          <Typography 
            sx={{ 
              width: '100%',
              fontSize: screenSize === ScreenSize.MEDIUM || screenSize === ScreenSize.SMALL? '20px' 
              : '20px',
              lineHeight: '20px',
              fontFamily: 'Poppins, sans-serif', fontWeight: 400,   color: '#FFFFFF', textAlign: 'center'
            }}
          >
            Discover how mistakes become momentum—through classrooms, media, and more.
          </Typography>
        </Box>
        {/* Youtube container */}
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '48px'
          }}
        >
          {/* TODO: remove video link hardcode */}
          <iframe
            src={`https://www.youtube.com/embed/_dNfmPa6CRo?si=kxQYH7rn3yYtwlzX`} // eslint-disable-line
            allow="encrypted-media"
            title="Youtube Video"
            style={{
              width: '640px',
              height: '480px',
              border: 0,
              borderRadius: '8px'
            }}  
          />
          
          <Box
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              maxWidth: '640px',
              gap: '48px'
            }}
          >
            <Box
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}
            >
              {/* TODO: Heading text */}
              <Box>            
                <Typography sx={{fontSize: '24px', lineHeight: '24px', fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#FF3A6A',  display: 'inline'}}> RightOn! </Typography> 
                <Typography sx={{ fontSize: '24px', lineHeight: '24px',  fontFamily: 'Poppins, sans-serif', fontWeight: 700,   color: '#FFFFFF', display: 'inline'}}> Game Show </Typography>
              </Box>
              <Typography 
                sx={{ 
                  width: '100%',
                  fontSize: screenSize === ScreenSize.MEDIUM || screenSize === ScreenSize.SMALL? '20px' 
                  : '20px',
                  lineHeight: '20px',
                  fontFamily: 'Poppins, sans-serif', fontWeight: 400,   color: '#FFFFFF'
                }}
              >
                Students across the country met online to compete in a live-stream game show where the best wrong answers win!
              </Typography>
            </Box>
             {/* TODO: view game shows button */}
             <Box
              style={{
                width: 'fit-content',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #FFF',
                borderRadius: '24px',
                padding: '16px 24px',
                gap: '12px'
              }}
            >
              <Typography sx={{ lineHeight: '1.2', fontSize: '18px', fontFamily: 'Poppins, sans-serif', color: '#FFFFFF', textAlign: 'center'}}>
                View Game Shows
              </Typography>
              <img src={positiveEmailArrow} alt="positiveEmailArrow" />
            </Box>
          </Box>
        </Box>
         {/* Bloopy rocket container */}
         <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '48px'
          }}
        >
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}
          >
            <Typography 
                sx={{ 
                  width: '100%',
                  fontSize: screenSize === ScreenSize.MEDIUM || screenSize === ScreenSize.SMALL? '20px' 
                  : '20px',
                  lineHeight: '20px',
                  fontFamily: 'Poppins, sans-serif', fontWeight: 400,   color: '#FFFFFF'
                }}
              >
                Want to build a culture of error at your school?
              </Typography>
            {/* view resource library button */}
            {/* TODO: add hover effect and styled component */}
            <Box
              style={{
                width: 'fit-content',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #FFF',
                borderRadius: '24px',
                padding: '16px 24px',
                gap: '12px',
                cursor: 'pointer',
              }}
              onClick={() => {
                navigate('/library');
              }}
            >
              <Typography sx={{ lineHeight: '1.2', fontSize: '18px', fontFamily: 'Poppins, sans-serif', color: '#FFFFFF', textAlign: 'center'}}>
                View Resource Library
              </Typography>
              <img src={positiveEmailArrow} alt="positiveEmailArrow" />
            </Box>
          </Box>
          <Box style={{position: 'relative'}}>
            <img src={positiveBloopyRocket} alt="positiveBloopyRocket" style={{position: 'relative',zIndex: 21}}/>
            <Box 
              style={{
                width: '350px',
                height: '350px',
                borderRadius: '90% 50%',
                background: 'rgba(210, 210, 210, 0.5)',
                filter: 'blur(24px)',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: -1
              }}
            />
          </Box>
        </Box>
      </Box>
    </PositiveContainer>
  );
}
