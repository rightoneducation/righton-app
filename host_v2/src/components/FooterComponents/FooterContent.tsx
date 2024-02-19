import React from 'react';
import { styled } from '@mui/material/styles';
import { Typography, Container, Button, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import FooterStackContainerStyled from '../../lib/styledcomponents/layout/FooterStackContainerStyled';
import AnswerBar from './AnswerBar';
import NextStateButton from '../../lib/styledcomponents/footer/NextStateButton';

interface FooterContentProps {
    inputNum: number;
    totalNum: number;
    footerBar: string
    footerButtonText: string ,
    phaseOneTime: number,
    phaseTwoTime: number
} // eslint-disable-line


const EndStyled = styled(Button)(({ theme }) => ({
  border: '4px solid #159EFA',
  borderRadius: '34px',
  width: '300px',
  height: '48px',
  color: '#159EFA',
  fontSize: '20px',
  bottom: '0',
  textTransform: 'none',
  fontWeight: '700',
  lineHeight: '30px',
  boxShadow: '0px 5px 22px 0px #47D9FF4D',
  '&:disabled': {
    background: 'transparent',
    border: '4px solid #159EFA',
    borderRadius: '34px',
    width: '300px',
    height: '48px',
    color: '#159EFA',
    fontSize: '20px',
    fontWeight: '700',
    lineHeight: '30px',
    opacity: '25%',
    cursor: 'not-allowed',
  },
}));

const NextStyled = styled(Button)(({ theme }) => ({
  border: '4px solid #159EFA',
  background: 'linear-gradient(#159EFA 100%,#19BCFB 100%)',
  borderRadius: '34px',
  width: '300px',
  height: '48px',
  color: 'white',
  fontSize: '20px',
  bottom: '0',
  fontWeight: '700',
  lineHeight: '30px',
  textTransform: 'none',
  boxShadow: '0px 5px 22px 0px #47D9FF4D',
  '&:disabled': {
    background: 'transparent',
    border: '4px solid #159EFA',
    borderRadius: '34px',
    width: '300px',
    height: '48px',
    color: '#159EFA',
    fontSize: '20px',
    fontWeight: '700',
    lineHeight: '30px',
    opacity: '25%',
    cursor: 'not-allowed',
  },
}));
  
export default function FooterContent({
    inputNum,
    totalNum,
    footerBar,
    footerButtonText,
    phaseOneTime,
    phaseTwoTime
}: FooterContentProps) {
    const { t } = useTranslation();

    const handleNextStateButtonClick = () => {
        console.log('NextStateButton clicked!');
    };
    const isPhaseOneDisabled = phaseOneTime < 0;
    const isPhaseTwoDisabled = phaseTwoTime < 0;

    return (
        <FooterStackContainerStyled>
            <Container maxWidth="md">
                <Typography variant="body1" style={{ fontFamily: 'Rubik', textAlign: 'left' }}>
                    {t('gamesession.answerbar')}
                </Typography>
                <Box style={{ opacity: footerBar === 'CHOOSE_CORRECT_ANSWER' || footerBar === 'CHOOSE_TRICKIEST_ANSWER' ? 1 : 0.4, width: '100%' }}>
                    <AnswerBar
                        inputNum={inputNum}
                        totalNum={totalNum}
                    />
                </Box>
                <NextStateButton>
                  {footerButtonText === 'End Answering' ? (
                      <EndStyled
                          disabled={isPhaseOneDisabled || isPhaseTwoDisabled}
                          onClick={handleNextStateButtonClick}
                      >
                          {footerButtonText}
                      </EndStyled>
                  ) : (
                      <NextStyled
                          disabled={isPhaseOneDisabled || isPhaseTwoDisabled}
                          onClick={handleNextStateButtonClick}
                      >
                          {footerButtonText}
                      </NextStyled>
                  )}
                </NextStateButton>
                
            </Container>
        </FooterStackContainerStyled>
    );
}

