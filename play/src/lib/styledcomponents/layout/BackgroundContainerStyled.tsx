import { styled } from "@mui/material/styles";
import { Stack } from "@mui/material";

export default styled(Stack)(({ theme }) => ({
  height: "100svh",
  position: "fixed", // 100%, fixed to prevent sizing changes on mobile based on url bar etc
  width: "100%",
  background: `${theme.palette.primary.radialGradient} no-repeat`,
  backgroundSize: `100%`,
  backgroundPosition: "center top",
  backgroundAttachment: "fixed",
  display: "flex",
  alignItems: "center",
}));
