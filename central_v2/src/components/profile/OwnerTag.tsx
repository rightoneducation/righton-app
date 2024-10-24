import React from 'react';
import { Typography, Box, styled } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import placeHolderProfilePicture from '../../images/placeholderProfilePic.png';
import OwnerNamePill from './OwnerNamePill';

const OwnerTagContainer = styled(Box)(({ theme }) => ({
  width: 'fit-content',
  height: 'fit-content',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: `${theme.sizing.xSmPadding}px`,
}));

const OwnerTagProfilePicture = styled('img')(({theme}) => ({
  height: '128px',
  width: '128px',
  borderRadius: '50%',
  objectFit: 'cover',
}));

const OwnerTagHeader = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 700,
  color: '#FFF',
}));

const OwnerTagBody = styled(OwnerTagHeader)(({ theme }) => ({
  fontWeight: 300
}));

export default function OwnerTag () {
  const theme = useTheme();
  const modifiedDate = '06/08/2024';
  const gamesUsed = '234';
  const userName = 'Mr. J. Jiminez';
  return (
    <OwnerTagContainer>
      <OwnerTagProfilePicture src={placeHolderProfilePicture}/>
      <OwnerTagHeader>
        Created By: 
      </OwnerTagHeader>
      <OwnerNamePill ownerName={userName}/>
      <OwnerTagHeader>
        Last Modified: 
      </OwnerTagHeader>
      <OwnerTagBody>
        {modifiedDate}
      </OwnerTagBody>
      <OwnerTagHeader>
        Games Used: 
      </OwnerTagHeader>
      <OwnerTagBody>
        {gamesUsed}
      </OwnerTagBody>
    </OwnerTagContainer>
  );
}