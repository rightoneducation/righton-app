import React from 'react';
import styled from 'styled-components';
import { Box } from '@mui/material';

export const AppContainer = styled(Box)(({ theme }) => ({ // eslint-disable-line
  display: 'flex',
  width: '100%',
  height: '100vh',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
}));