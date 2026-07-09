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
  height: '36px',
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

// 50x26 track with the thumb inset 3px from the track's outer edge (thumb 20px,
// checked transform = 50 - 3 - 20 - 3 = 24px). Track is black when off and
// surface.play when on; thumb keeps the existing grey/white styling.
const ToggleSwitch = styled(Switch)(({ theme }) => ({
  width: 50,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 3,
    color: theme.palette.designSystem.surface.play,
    '&.Mui-checked': {
      transform: 'translateX(24px)',
      color: '#FFFFFF',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.designSystem.surface.play,
        opacity: 1,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 20,
    height: 20,
  },
  '& .MuiSwitch-track': {
    borderRadius: 13,
    backgroundColor: '#C0C0C0',
    opacity: 1,
  },
}));

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
  // zero BodyCardStyled's 8px side margin so the card aligns to the column's padding
  // outline (24/32px); the ScrollBox already bleeds 8px for shadow room, matching the
  // marginless QuestionCardGameplayStyled used by the question card
  return (
    <BodyCardStyledBlue elevation={10} sx={{ marginLeft: 0, marginRight: 0 }}>
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
                  style={{borderRight: '0px'}}
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
            <ToggleSwitch
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
            <ToggleSwitch
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