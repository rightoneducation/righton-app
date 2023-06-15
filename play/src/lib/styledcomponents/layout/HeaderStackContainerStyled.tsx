import { styled } from "@mui/material/styles";
import { Stack } from "@mui/material";

/* high-level header container for game in progress and phase results 
(stack container -> header stack container, body stack container, footer stack container) */
export default styled(Stack)(({ theme }) => ({
  paddingTop: `${theme.sizing.mediumPadding}px`,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  boxShadow: "0px 2px 4px rgba(0, 141, 239, 0.3)",
  background: theme.palette.primary.backgroundGradient,
  border: "none",
  width: "100vw",
  height: `${theme.sizing.headerHeight}px`,
}));
