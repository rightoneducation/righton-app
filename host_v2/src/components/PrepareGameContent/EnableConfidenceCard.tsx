import React from 'react';
import { Typography, makeStyles, Switch, Paper, Box } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';

const StyledContainer = styled(Paper)(({theme})=>({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: '24px',
  backgroundColor: theme.palette.primary.darkBlueCardColor,
  boxShadow: '0px 8px 16px -4px rgba(92, 118, 145, 0.4)',
  width: '100%', 
  gap: '16px',
  boxSizing: 'border-box',
  elevation: 0,
  padding: '16px'
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

const BodyTypography = styled(Typography)({
  color: '#FFF',
  textAlign: 'center',
  fontFamily: 'Rubik',
  fontSize: '14px',
  fontWeight: '400',
});

interface EnableConfidenceCardProps {
  isConfidenceEnabled: boolean;
  setIsConfidenceEnabled: (value: boolean) => void;
}

export default function EnableConfidenceCard({
  isConfidenceEnabled,
  setIsConfidenceEnabled
}: EnableConfidenceCardProps) {
  return (
    <StyledContainer>
      <TitleContainer>
        <TitleTypography>Confidence Meter</TitleTypography>
        <ConfidenceSwitch
          checked={isConfidenceEnabled}
          onChange={() => setIsConfidenceEnabled(!isConfidenceEnabled)}
        />
      </TitleContainer>
      <Box style={{ display: 'flex', justifyContent: 'center' }}>
        <BodyTypography>
          You may allow players to indicate how sure they are of their answer.
        </BodyTypography>
      </Box>
    </StyledContainer>
  );
}
