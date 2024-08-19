import React from 'react';
import { Typography, makeStyles, Switch, Paper, Box } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';

const StyledContainer = styled(Paper)(({theme})=>({
  display: 'flex',
  padding: `${theme.sizing.smPadding}px`,
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: `${theme.sizing.smPadding}px`,
  alignSelf: 'stretch',
  backgroundColor: theme.palette.primary.darkBlueCardColor,
  borderRadius: `${theme.sizing.mdPadding}px`,
  boxShadow: '0px 8px 16px -4px rgba(92, 118, 145, 0.4)',
  margin: `${theme.sizing.xSmPadding}px`,
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

const BodyTypography = styled(Typography)({
  color: '#FFF',
  textAlign: 'center',
  fontFamily: 'Rubik',
  fontSize: '14px',
  fontWeight: '400',
});

interface EnableHintsCardProps {
  isHintEnabled: boolean;
  setIsHintEnabled: (value: boolean) => void;
}

export default function EnableHintsCard({
  isHintEnabled,
  setIsHintEnabled,
}: EnableHintsCardProps) {
  const theme = useTheme();
  return (
    <StyledContainer>
      <TitleContainer>
        <TitleTypography>Student Hints</TitleTypography>
        <HintsSwitch
          checked={isHintEnabled}
          onChange={() => setIsHintEnabled(!isHintEnabled)}
        />
      </TitleContainer>
      <Box style={{ display: 'flex', justifyContent: 'center' }}>
        <BodyTypography>
          Players are asked to provide a hint to help others who made the selected mistake.
        </BodyTypography>
      </Box>
    </StyledContainer>
  );
}