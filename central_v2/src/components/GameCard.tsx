import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import littleButton from '../images/littleButton.svg'
import gym from '../images/gym.svg'
import heart from '../images/heart.svg';
import viewbutton from '../images/viewbutton.svg';
import launchbutton from '../images/launchbutton.svg';

const LittleButtonSVG = styled('img')({
    cursor: 'pointer',
    // marginLeft: 'auto',
});
const GymSVG = styled('img')({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  });
const HeartSVG = styled('img')({
    cursor: 'pointer',
    // marginLeft: 'auto',
});
const ViewSVG = styled('img')({
    cursor: 'pointer',
    // marginLeft: 'auto',
});
const LaunchSVG = styled('img')({
    cursor: 'pointer',
    // marginLeft: 'auto',
});
const GameCard = styled(Box)(() => ({
    width: '438px', // will probs be 100% in a carousal
    height: '236px',
    padding: '12px 16px 12px 16px',
    gap: '16px',
    borderRadius: '16px',
    boxShadow: '0px 8px 16px -4px #5C769166',
    background: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
  }));

  const TextContainer = styled(Box)(() => ({
    width: '100%', 
    height: '182px',
    gap: '16px',
    display: 'flex',
    flexDirection: 'column',
  }));
  const TitleContainer = styled(Box)(() => ({
    width: '100%', 
    height: '130px',
    // gap: '16px',
    display: 'flex',
    justifyContent: 'space-between',
  }));
  const TitleTextTypography = styled(Typography)(() => ({
    width: '100%', 
    lineHeight: '30px',
    gap: '8px',
    fontFamily: 'Poppins', // check this
    fontWeight: '700',
    fontSize: '20px',
    color: '#384466',
    // display: 'flex',
    // flexDirection: 'column',
  }));
  const TextAndImageBox = styled(Box)(() => ({
    width: '50%', 
    height: '136px',
    gap: '8px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  }));
  const SideBySideBox = styled(Box)(() => ({
    width: '100%', 
    height: '136px',
    gap: '8px',
    display: 'flex',
    flexDirection: 'row',
  }));
  const SmallSideBySideBox = styled(Box)(() => ({
    width: '100%', 
    height: '24px',
    gap: '4px',
    display: 'flex',
    flexDirection: 'row',
  }));
  const DescriptionText = styled(Typography)(() => ({
    width: '199px', 
    height: '104px',
    fontFamily: 'Rubik',
    fontWeight: '400',
    fontSize: '16px',
    lineHeight: '18.96px',
    color: '384466',
    // display: 'flex',
    // flexDirection: 'column',
  }));
  const BottomButtonBox = styled(Box)(() => ({
    width: '100%', 
    height: '38px',
    gap: '8px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  }));
  const PrimaryButton1 = styled(Button)(() => ({
    width: 'auto',
    height: '38px',
    padding: '4px 12px',
    gap: '8px',
    borderRadius: '54px',
    background: 'linear-gradient(270.1deg, #1C94C3 0.09%, #2A6AC6 64.33%, #2C62C6 76.27%, #3153C7 99.91%)',
    boxShadow: '0px 5px 22px 0px rgba(71, 217, 255, 0.3)',
    color: '#FFFFFF',
    textTransform: 'none',
  }));
  const SecondaryButton = styled(Button)(() => ({
    width: '42px',
    height: '24px',
    padding: '4px 8px 4px 8px',
    gap: '4px',
    borderRadius: '12px',
    background: 'linear-gradient(90deg, #E81144 0%, #E31C5E 100%)',
    color: '#FFFFFF',
    textTransform: 'none',
    fontFamily: 'Rubik',
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '16.59px',
    textAlign: 'center',
  }));


  export default function StyledGameCard() {
    
    return (
      <GameCard>
        <TextContainer>
            <TitleContainer>
                <TitleTextTypography> Pumping Up: Percents...</TitleTextTypography>
                <HeartSVG src={heart} alt="Tag" />
            </TitleContainer>
            <SideBySideBox>
            <TextAndImageBox>
                <DescriptionText>Use Proportional relationships to solve multi-step ration and percent problems. Examples: simple interes...</DescriptionText>
                <SmallSideBySideBox>
                    <SecondaryButton> 8.NS </SecondaryButton>
                    <SecondaryButton> 8.RP </SecondaryButton>
                </SmallSideBySideBox>
            </TextAndImageBox>
            <TextAndImageBox>
                <GymSVG src={gym} alt="Tag" />
            </TextAndImageBox>
            </SideBySideBox>
        </TextContainer>
        <BottomButtonBox>
            <PrimaryButton1> View </PrimaryButton1>
            <PrimaryButton1> Launch </PrimaryButton1>
        </BottomButtonBox>
      </GameCard>
    );
  }
  