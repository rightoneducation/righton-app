import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { StyledEngineProvider } from "@mui/material/styles"; // change to mui v5 see CSS Injection Order section of https://mui.com/material-ui/guides/interoperability/
import GameSessionContainer from "./containers/GameSessionContainer";

const theme = createTheme({
  palette: {
    primary: {
      main: "#307583",
    },
    secondary: {
      main: "#8e2e9d",
    },
  },
  typography: {
    fontFamily: "Poppins",
    button: {
      textTransform: "none",
    },
  },
});

const RedirectToCentralIfMissing = () => {
  window.location.href = "http://central.rightoneducation.com/";
  return null;
};

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/" element={<GameSessionContainer />} />
            <Route element={<RedirectToCentralIfMissing />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
