import React from 'react';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { Typography, Container, Button, Theme } from '@mui/material';
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

const useStyles = makeStyles((theme : Theme) => ({
    footer: {
      position: 'sticky',
      bottom: '0',
      width: '100%',
      height: '150px',
      paddingBottom: '40px',
      paddingTop: '16px',
      background: 'linear-gradient(196.21deg, #03295A 0%, #02215F 73.62%)',
    },
    footerContainer: {
      display: 'flex',
      flexDirection: 'column-reverse',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '100%',
      paddingLeft: '16px',
      paddingRight: '16px',
      boxSizing: 'border-box',
      maxWidth: '700px',
      gap: '16px',
    },
    playerNum: {
      fontSize: '16px',
      width: '100%',
      textAlign: 'left',
      color: 'white',
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: '400',
      lineHeight: '24px',
    },
    startGameButton: {
      border: '4px solid #159EFA',
      borderRadius: '34px',
      width: '300px',
      height: '48px',
      color: '#159EFA',
      fontSize: '20px',
      fontWeight: '700',
      lineHeight: '30px',
    },
    nextPhaseButton: {
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
    },
    EndAnsweringButton: {
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
    // const theme = useTheme(); // eslint-disable-line
    const classes = useStyles();

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
                <div style={{ opacity: footerBar === 'CHOOSE_CORRECT_ANSWER' || footerBar === 'CHOOSE_TRICKIEST_ANSWER' ? 0.4 : 1, width: '100%' }}>
                    <AnswerBar
                        inputNum={inputNum}
                        totalNum={totalNum}
                    />
                </div>
                <NextStateButton
                    disabled={isPhaseOneDisabled || isPhaseTwoDisabled}
                    className={footerButtonText === 'End Answering' ? classes.EndAnsweringButton : classes.nextPhaseButton}
                    onClick={handleNextStateButtonClick}
                >
                    {/* <Typography variant="h4" style={{ fontFamily: 'Poppins', background: 'linear-gradient(90deg, #159EFA 0%, #19BCFB 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '20px', lineHeight: '1.2' }}>
                        {t('gamesession.nextStateButton')}
                    </Typography> */}
                    {footerButtonText}
                </NextStateButton>
            </Container>
        </FooterStackContainerStyled>
    );
}

