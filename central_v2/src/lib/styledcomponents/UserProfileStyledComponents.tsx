import React from 'react';
import { styled, Grid, Box, Typography, TextField } from '@mui/material';
import { ScreenSize } from '../CentralModels';

export const UserProfileMainContainer = styled(Grid)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: `${theme.palette.primary.creamBackgroundColor}`,
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  '-ms-overflow-style': 'none',
  // justifyContent: 'center',
  paddingTop: '40px',
  gap: '40px',
  overflow: 'auto',
  flexGrow: 1,
  boxSizing: 'border-box',
  // border: '1px solid red'
}));

export const UserProfileGridContainer = styled(Grid)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  gap: `${theme.sizing.smPadding}px`,
}));

type UserProfileGridItemProps = { screenSize: ScreenSize };

export const UserProfileGridItem = styled(Grid, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<UserProfileGridItemProps>(({ theme, screenSize }) => ({
  width: '100%',
  maxWidth: '672px',
  minWidth: screenSize !== ScreenSize.SMALL ? '672px' : '0px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: `${theme.sizing.smPadding}px`,
}));

export const TitleText = styled(Typography)(({ theme }) => ({
    fontFamily: 'Poppins',
    fontWeight: 700, 
    fontSize: '40px', 
    color: '#02215F',
    textAlign: 'center', 
    lineHeight: '40px'
}));

export const UsernameTextContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center'
}));

export const SubHeadingText = styled(Typography)(({ theme }) => ({
    fontFamily: 'Poppins',
    fontWeight: 600, 
    fontSize: '16px', 
    color: '#02215F',
}));

export const SubHeadingTextLight = styled(SubHeadingText)(({ theme }) => ({
    fontWeight: 400, 
}));
  
export const BodyText = styled(Typography)(({ theme }) => ({
    fontFamily: 'Poppins',
    fontWeight: 400,
    fontSize: '16px',
    color: '#02215F',
}));  

export const ImageText = styled(BodyText)(({ theme }) => ({
    color: '#FFFFFF',
}));

export const UserInfoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  width: '100%',
}));

export const UserInfoItemContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: '12px',
  }));

export const UsernameInputContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    display: 'flex',
}));

export const TitleField = styled(TextField)(({ theme }) => ({
    border: '2px solid #CCCCCC', 
    borderRadius: '8px', 
    backgroundColor: '#FFFFFF',
    minWidth: '108px',
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px', // Ensure consistent border radius
    },
    '& .MuiSelect-select': {
      color: '#384466',
    },
    '& .MuiSelect-icon': {
      transition: 'transform 0.2s ease', // Smooth transition for rotation
      marginRight: '10px',
    },
    '&.Mui-focused .MuiSelect-icon': {
      transform: 'rotate(-180deg)', // Rotate upward when focused
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none', // Remove the default border
    },
  }));

export const UploadImagesContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '16px',
  justifyContent: 'flex-start'
}));

export const ImageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  backgroundColor: '#02215F', 
  border: '1px solid #000000', 
  borderRadius: '8px',        
  flexDirection: 'column',
  alignItems: 'center',       
  justifyContent: 'center',    
  width: '100%',
  minHeight: '148px',
  gap: '10px',
  paddingTop: '10px',
  paddingBottom: '10px',
  boxSizing: 'border-box'
}));

export const ImagePlaceHolder = styled('img')(({ theme }) => ({
  width: '80%', 
  height: 148, 
  borderRadius: 4, 
  border: '2px solid #ccc', 
  objectFit: 'cover'
}));