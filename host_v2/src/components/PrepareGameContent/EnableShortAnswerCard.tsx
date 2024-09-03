import React from 'react';
import { Typography, makeStyles, Paper, Box, Button, ButtonGroup } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';

const StyledContainer = styled(Paper)(({theme})=>({
  display: 'flex',
  padding: `${theme.sizing.smPadding}px`,
  marginLeft: `${theme.sizing.xSmPadding}px`,
  marginRight: `${theme.sizing.xSmPadding}px`,
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: `${theme.sizing.smPadding}px`,
  alignSelf: 'stretch',
  backgroundColor: theme.palette.primary.darkBlueCardColor,
  borderRadius: `${theme.sizing.mdPadding}px`,
  boxShadow: '0px 4px 10px 0px rgba(15, 27, 40, 0.45)',
}));

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
  justifyContent: "center",
});

const BodyTypography = styled(Typography)({
  color: '#FFF',
  textAlign: 'center',
  fontFamily: 'Rubik',
  fontSize: '14px',
  fontWeight: '400'
});

interface EnableShortAnswerCardProps {
  isShortAnswerEnabled: boolean;
  setIsShortAnswerEnabled: (value: boolean) => void;
}

export default function EnableShortAnswerCard ({ 
  isShortAnswerEnabled,
  setIsShortAnswerEnabled
} : EnableShortAnswerCardProps) {
  const theme = useTheme();
  return (
    <StyledContainer>
      <TitleContainer>
        <TitleTypography>
          Responses
        </TitleTypography>
      </TitleContainer>
      <Box style={{width: '100%'}}>
        <StyledButtonGroup
          disableRipple
          disableElevation 
          variant="contained" 
          color="primary"
        >
          <StyledButton 
            disableRipple
            variant={isShortAnswerEnabled ? 'outlined' : 'contained'} 
            onClick={() => setIsShortAnswerEnabled(false)}
          > 
            MULTIPLE CHOICE 
          </StyledButton>
          <StyledButton 
            disableRipple
            variant={isShortAnswerEnabled ? 'contained' : 'outlined'} 
            onClick={() => setIsShortAnswerEnabled(true)}
          >
            SHORT ANSWER
          </StyledButton>
        </StyledButtonGroup>
      </Box>
      <StyledAnswerContainer>
        <BodyTypography>
          {isShortAnswerEnabled ? 
              `Players will be asked to provide a short answer.`
            : `Players will be asked to pick from a list of possible answers.`}
        </BodyTypography>
      </StyledAnswerContainer>
   </StyledContainer>
  );
}
