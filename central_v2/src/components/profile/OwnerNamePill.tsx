import React from 'react';
import { Typography, Box, styled } from '@mui/material';

const OwnerNamePillContainer = styled(Box)(({ theme }) => ({
  width: 'fit-content',
  height: 'fit-content',
  borderRadius: '20px',
  background: `${theme.palette.primary.buttonGradientRed}`,
  paddingTop: `${theme.sizing.xxSmPadding}px`,
  paddingBottom: `${theme.sizing.xxSmPadding}px`,
  paddingLeft: `${theme.sizing.xSmPadding}px`,
  paddingRight: `${theme.sizing.xSmPadding}px`,
}));

const OwnerNamePillText = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 800,
  color: '#FFFFFF',
}));

interface OwnerNamePillProps {
  ownerName: string;
}

export default function OwnerNamePill({ ownerName }: OwnerNamePillProps) {
  return (
    <OwnerNamePillContainer>
      <OwnerNamePillText>{ownerName}</OwnerNamePillText>
    </OwnerNamePillContainer>
  );
}
