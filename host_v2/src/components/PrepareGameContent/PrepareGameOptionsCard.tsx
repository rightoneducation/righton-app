import React from 'react';
import { Typography, Switch, Box, Button, ButtonGroup, Tooltip } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import BodyCardContainerStyled from '../../lib/styledcomponents/BodyCardContainerStyled';
import { BodyCardStyledBlue } from '../../lib/styledcomponents/BodyCardStyled';

const TitleContainer = styled(Box)({
  marginTop: '3%',
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
});

const TitleTypography = styled(Typography)({
  color: '#FFF',
  fontFamily: 'Poppins',
  fontSize: '24px',
  fontStyle: 'normal',
  fontWeight: '700',
  lineHeight: 'normal',
  textTransform: 'none',
});

const StyledButtonGroup = styled(ButtonGroup)({
  display: 'flex', 
  justifyContents: 'center', 
  alignItems: 'center', 
  width: '100%',
});

const StyledButton = styled(Button)({
  backgroundColor: '#4994EC',
  width: '50%',
  maxWidth: '300px',
  "&.MuiButton-contained": {
    backgroundColor: '#4994EC',
    color: 'white',
    border: 0,
    "&:hover":{
      backgroundColor: '#4994EC'
    },
    "&.Mui-focusVisible, &:active, &:focus": {
      outlineColor: '#4994EC',
      borderColor: '#4994EC',
    },
  },
  "&.MuiButton-outlined": {
    backgroundColor: 'transparent',
    color: '#4994EC',
    border: '1px solid #4994EC',
    "&:hover":{
      backgroundColor: 'rgba(73,148,236,0.2)'
    },
    "&.Mui-focusVisible, &:active, &:focus": {
      outlineColor: '#4994EC',
      borderColor: '#4994EC',
    },
  },
});

const StyledAnswerContainer = styled(Box)({
  display: "flex",
  justifyContent: "flex-start",
});

const BodyTypography = styled(Typography)({
  color: '#FFF',
  textAlign: 'center',
  fontFamily: 'Rubik',
  fontSize: '14px',
  fontWeight: '400'
});

const HintsSwitch = styled(Switch)({
  '& .MuiSwitch-switchBase': {
    color: "#C0C0C0"
  },
  '& .MuiSwitch-track': {
    backgroundColor: "#EAEAEA",
  },
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#FFFFFF',
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#111111',
  },
});

const ConfidenceSwitch = styled(Switch)({
  '& .MuiSwitch-switchBase': {
    color: "#C0C0C0"
  },
  '& .MuiSwitch-track': {
    backgroundColor: "#EAEAEA",
  },
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#FFFFFF',
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#111111',
  },
});

interface PrepareGameOptionsCardProps {
  isGameSettingMultiChoice: boolean;
  isShortAnswerEnabled: boolean;
  setIsShortAnswerEnabled: (value: boolean) => void;
  isConfidenceEnabled: boolean;
  setIsConfidenceEnabled: (value: boolean) => void;
  isHintEnabled: boolean;
  setIsHintEnabled: (value: boolean) => void;
}

export default function PrepareGameOptionsCard({
  isGameSettingMultiChoice,
  isShortAnswerEnabled,
  setIsShortAnswerEnabled,
  isConfidenceEnabled,
  setIsConfidenceEnabled,
  isHintEnabled,
  setIsHintEnabled,
}: PrepareGameOptionsCardProps) {
  const theme = useTheme(); // eslint-disable-line
  const { t } = useTranslation();
  return (
    <BodyCardStyledBlue elevation={10}>
      <BodyCardContainerStyled style={{gap: `${theme.sizing.mdPadding}px`}}>
        <Box style={{width: '100%', display: 'flex', flexDirection: 'column', gap: `${theme.sizing.smPadding}px`}}>
          <TitleContainer>
            <Typography variant="h3" style={{color: theme.palette.primary.main}}>
              {t('gameoptions.answertypetitle')}
            </Typography>
          </TitleContainer>
          <Box style={{width: '100%'}}>
            <Tooltip 
              title={isGameSettingMultiChoice ? "This game can only be played in Multiple Choice mode" : ""}
              placement="top"
              arrow
              disableHoverListener={!isGameSettingMultiChoice}
              disableFocusListener={!isGameSettingMultiChoice}
              disableTouchListener={!isGameSettingMultiChoice}
            >
              <StyledButtonGroup
                disableRipple
                disableElevation 
                disabled={isGameSettingMultiChoice}
                variant="contained" 
                color="primary"
              >
                <StyledButton 
                  disableRipple
                  disabled={isGameSettingMultiChoice}
                  variant={isShortAnswerEnabled ? 'outlined' : 'contained'} 
                  onClick={() => setIsShortAnswerEnabled(false)}
                >
                  <Typography variant="answerTypeLabel">
                    {t('gameoptions.multiplechoice')}
                  </Typography>
                </StyledButton>
                <StyledButton 
                  disableRipple
                  disabled={isGameSettingMultiChoice}
                  variant={isShortAnswerEnabled ? 'contained' : 'outlined'} 
                  onClick={() => setIsShortAnswerEnabled(true)}
                >
                  <Typography variant="answerTypeLabel">
                    {t('gameoptions.shortanswer')}
                  </Typography>
                </StyledButton>
              </StyledButtonGroup>
            </Tooltip>
          </Box>
          <StyledAnswerContainer>
            <Typography variant="label">
              {isShortAnswerEnabled
                ? t('gameoptions.answertypesubtitleshortanswer')
                : t('gameoptions.answertypesubtitlemultiplechoice')}
            </Typography>
          </StyledAnswerContainer>
        </Box>
        <Box style={{width: '100%', display: 'flex', flexDirection: 'column', gap: `${theme.sizing.smPadding}px`}}>
          <TitleContainer>
            <TitleTypography>{t('gameoptions.confidencetitle')}</TitleTypography>
            <ConfidenceSwitch
              checked={isConfidenceEnabled}
              onChange={() => setIsConfidenceEnabled(!isConfidenceEnabled)}
            />
          </TitleContainer>
          <Box style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Typography variant="label">
              {t('gameoptions.confidencesubtitle')}
            </Typography>
          </Box>
        </Box>
        <Box style={{width: '100%', display: 'flex', flexDirection: 'column', gap: `${theme.sizing.smPadding}px`}}>
          <TitleContainer>
            <TitleTypography>{t('gameoptions.studenthintstitle')}</TitleTypography>
            <HintsSwitch
              checked={isHintEnabled}
              onChange={() => setIsHintEnabled(!isHintEnabled)}
            />
          </TitleContainer>
          <Box style={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant="label">
              {t('gameoptions.studenthintssubtitle')}
            </Typography>
          </Box>
        </Box>
      </BodyCardContainerStyled>
    </BodyCardStyledBlue>
  );
}