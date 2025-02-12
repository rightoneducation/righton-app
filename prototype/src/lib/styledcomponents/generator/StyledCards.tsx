import { Paper, styled } from '@mui/material';

export const BaseCardStyled = styled(Paper)(({ theme }) => ({
  padding: `${theme.sizing.mdPadding}px`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: `${theme.sizing.smPadding}px`,
  background: '#FFFFFF',
  borderRadius: `${theme.sizing.smPadding}px`,
  boxSizing: 'border-box',
  height: 'fit-content',
  boxShadow: `0px 4px 0px 10px rgaba(0,0,0,0.1)`,
  transition: 'box-shadow 0.6s, opacity  0.6s'
}));

export const ExplanationCardStyled = styled(Paper)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  padding: '20px',
  transition: 'opacity 0.3s ease',
  borderRadius: '20px',
  borderThickness: '2px',
  borderStyle: 'solid',
  borderColor: 'white',
  gap: '10px',
  boxSizing: 'border-box',
}));