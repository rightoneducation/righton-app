import React, { useState } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Link,
} from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { Container, Typography, Box, Paper } from '@mui/material';
import Theme from './lib/Theme';
import {
  StyledTitleText,
  StyledTextField,
  StyledButton,
  StyledSwitch,
  CreateGameMainContainer,
  CreateGameBackground,
  StyledSubtitleText,
} from './lib/StyledComponents';
import './App.css';

function HomePage() {
  const [promptText, setPromptText] = useState('');
  const [rightonSwitch, setRightonSwitch] = useState(true);
  const [cziSwitch, setCziSwitch] = useState(true);
  const [outputTexts, setOutputTexts] = useState<string[]>(['']);
  return (
    <CreateGameMainContainer>
      <CreateGameBackground />
      <Container sx={{ zIndex: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '48px' }}>
        <StyledTitleText sx={{ width: '100%', textAlign: 'center' }}>
          RightOn! + Learning Commons MCP Demo
        </StyledTitleText>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
          <StyledSubtitleText sx={{ width: '100%', textAlign: 'left' }}>
            Input
          </StyledSubtitleText>
          <Paper
            sx={{
              width: '100%',
              minWidth: '600px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: '24px',
              padding: '24px',
              boxSizing: 'border-box',
              borderRadius: '8px',
            }}
            elevation={4}
          >
        
            <StyledTextField
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-input': {
                  paddingBottom: 1,
                },
              }}
              multiline
              rows={4}
              placeholder="Enter your prompt here..."
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
            >
              <Typography>{promptText}</Typography>
            </StyledTextField>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography style={{ fontWeight: 700 }}>MCP Servers</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography style={{ fontWeight: 400 }}>
                      RightOn!
                    </Typography>
                    <StyledSwitch
                      checked={rightonSwitch}
                      onChange={(e: any) => setRightonSwitch(e.target.checked)}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography style={{ fontWeight: 400 }}>
                      Learning Commons
                    </Typography>
                    <StyledSwitch
                      checked={cziSwitch}
                      onChange={(e: any) => setCziSwitch(e.target.checked)}
                    />
                  </Box>
                </Box>
              </Box>
              <StyledButton variant="contained">Submit</StyledButton>
            </Box>
          </Paper>
        </Box>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
          <StyledSubtitleText sx={{ width: '100%', textAlign: 'left' }}>
            Output
          </StyledSubtitleText>
          {outputTexts.map((text, index) => (
            <Paper
              sx={{
                width: '100%',
                minWidth: '600px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                gap: '24px',
                padding: '24px',
                boxSizing: 'border-box',
                borderRadius: '8px',
              }}
              elevation={4}
            >
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  {text !== '' ? (
                  <Typography>{text}</Typography>
                  ) : (
                    <Typography>Output will appear here...</Typography>
                  )}
                  </Box>
                  
              </Box>
            </Paper>
          ))}
        </Box>
        </Box>
      </Container>
    </CreateGameMainContainer>
  );
}
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<HomePage />} />
    ),
  );

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={Theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
