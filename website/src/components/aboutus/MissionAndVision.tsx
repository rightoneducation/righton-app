import React from 'react';
import { Box, Typography, Divider } from '@mui/material'
import { ScreenSize } from '../../lib/WebsiteModels';
import { StyledFlexBox, StyledText } from '../../lib/styledcomponents/StyledHomePageComponents/StyledHomePageComponents';
import pinkOneEyedMonster from '../../images/pinkOneEyedMonster.svg';
import teamworkMonsters from '../../images/teamworkMonsters.svg';

interface IMissionAndVision {
    screenSize: ScreenSize
}
export default function MissionAndVision({ screenSize }: IMissionAndVision) {
    return (
          <StyledFlexBox
          direction={screenSize === ScreenSize.LARGE ? 'row': 'column'}
          align="start"
          justify="center"
          gap={48}
          height={ screenSize === ScreenSize.LARGE ? "341px": "100%"}
          // account for absolute position of image height.
          sx={{ paddingBottom:screenSize === ScreenSize.LARGE ? 0 : '159px'  }}
        >
          <Box
            sx={{
              borderRadius: '24px',
              background: 'rgb(128,13,21)',
              width: screenSize === ScreenSize.SMALL ? '369px':'526px',
              height:screenSize === ScreenSize.SMALL ?'229px' :'326px',
              position: 'relative',
            }}
          >
            <StyledFlexBox sx={{ padding: '32px 0px 12px 19px' }} gap={6}>
              <Typography
                fontSize="48px"
                fontFamily="Roboto"
                fontWeight={700}
                lineHeight="44px"
                sx={{ color: 'white' }}
              >
                Mission
              </Typography>
              <Divider
                orientation="horizontal"
                sx={{
                  borderBottomWidth: '6px',
                  borderColor: 'rgb(226, 155, 93)',
                  width: '100%',
                  maxWidth: '462px',
                }}
              />
            </StyledFlexBox>
            {/* Monster and content */}
            <Box
              sx={{
                display: 'flex',
                direction: 'row',
                justifyContent: 'flex-end',
                width: '100%',
              }}
            >
              <StyledFlexBox
                sx={{
                  padding: '0px 32px 32px 32px',
                  width:  screenSize === ScreenSize.SMALL ? '295px':'421px',
                  height: screenSize === ScreenSize.SMALL ? '110px':'157px',
                }}
              >
                <Typography
                  textAlign="right"
                  fontFamily="Roboto"
                  fontSize={screenSize === ScreenSize.SMALL ? "16px":"24px"}
                  fontWeight={200}
                  lineHeight={screenSize === ScreenSize.SMALL ? "22px":"31px"}
                  letterSpacing={screenSize === ScreenSize.SMALL ? 0.16:0.22}
                  sx={{ color: '#fff' }}
                >
                  Transforming how students think and feel about math, helping
                  them see mistakes as learning opportunities
                </Typography>
              </StyledFlexBox>
            </Box>
            {/* pink monster inside card */}
            <Box
              sx={{ position: 'absolute', bottom: 0, left: 0 }}
              height={ screenSize === ScreenSize.SMALL ? "97px":"138px"} // 97px
              width={screenSize === ScreenSize.SMALL ? "123px":"176px"} // 123px
              component="img"
              src={pinkOneEyedMonster}
              alt="pink-monster"
            />
          </Box>

          <Box
            sx={{
              borderRadius: '24px',
              background: 'rgb(57,74,153)',
              width: screenSize === ScreenSize.SMALL ? '369px':'526px',
              height: screenSize === ScreenSize.SMALL ? '127px':'182px',
              position: 'relative',
            }}
          >
            <Box sx={{ paddingBottom: '24px ' }}>
              <StyledFlexBox sx={{ padding: '32px 0px 12px 19px' }} gap={6}>
                <Typography
                  fontSize={screenSize === ScreenSize.SMALL ? '30px':"48px"}
                  fontFamily="Roboto"
                  fontWeight={700}
                  lineHeight={screenSize === ScreenSize.SMALL ? '30.8px':"44px"}
                  sx={{ color: 'white' }}
                >
                  Vision
                </Typography>
                <Divider
                  orientation="horizontal"
                  sx={{
                    borderBottomWidth: '6px',
                    borderColor: 'rgb(226, 155, 93)',
                    width: '100%',
                    maxWidth: '462px',
                  }}
                />
              </StyledFlexBox>

              <StyledFlexBox>
                <Typography
                  textAlign="center"
                  fontFamily="Roboto"
                  fontSize={screenSize === ScreenSize.SMALL ? '16px':"24px"}
                  fontWeight={200}
                  lineHeight={ screenSize === ScreenSize.SMALL ? '22px':"31px"}
                  letterSpacing={ screenSize === ScreenSize.SMALL ? 0 : 0.22}
                  sx={{ color: '#fff' }}
                >
                  Unlocking STEM potential in all youth.
                </Typography>
              </StyledFlexBox>
              <StyledFlexBox align="center">
                <Box
                  sx={{  position: 'absolute', bottom: '-158px' }}
                  width="360px"
                  height="159px"
                  component="img"
                  src={teamworkMonsters}
                  alt="teamwork-righton-monsters"
                />
              </StyledFlexBox>
            </Box>
          </Box>
        </StyledFlexBox>
    )
}