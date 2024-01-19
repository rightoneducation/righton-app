import React from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { Typography, Grid, Box, Stack, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import FooterStackContainerStyled from '../../lib/styledcomponents/layout/FooterStackContainerStyled';
import AnswerBar from './AnswerBar';
import NextStateButton from '../../lib/styledcomponents/footer/NextStateButton';

interface FooterContentProps {
    inputNum: number;
    totalNum: number;
} // eslint-disable-line

export default function FooterContent({
    inputNum,
    totalNum
}: FooterContentProps) {
    const theme = useTheme(); // eslint-disable-line
    const { t } = useTranslation();

    const handleNextStateButtonClick = () => {
        console.log('NextStateButton clicked!');
    };

    return (
        <FooterStackContainerStyled>
            <Container maxWidth="md">
                <Typography variant="body1" style={{ fontFamily: 'Rubik', textAlign: 'left' }}>
                    {t('gamesession.answerbar')}
                </Typography>
                <AnswerBar
                    inputNum={inputNum}
                    totalNum={totalNum}
                />
                <NextStateButton onClick={handleNextStateButtonClick}>
                    <Typography variant="h4" style={{ fontFamily: 'Poppins', background: 'linear-gradient(90deg, #159EFA 0%, #19BCFB 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '20px', lineHeight: '1.2' }}>
                        {t('gamesession.nextStateButton')}
                    </Typography>
                </NextStateButton>
            </Container>
        </FooterStackContainerStyled>
    );
}