import React from 'react';
import { Typography, makeStyles, Switch, Paper, Box } from '@mui/material';
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
        <TitleTypography>Confidence</TitleTypography>
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
