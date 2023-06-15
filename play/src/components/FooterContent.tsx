import React from "react";
import { styled, useTheme } from "@mui/material/styles";
import { Typography, Container } from "@mui/material";
import { monsterMap } from "../lib/PlayModels";
import ScoreIndicator from "./ScoreIndicator";

const FooterContainer = styled(Container)(({ theme }) => ({
  width: "100%",
  maxWidth: `${theme.breakpoints.values.sm}px`,
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  color: theme.palette.primary.main,
  paddingLeft: `${theme.sizing.smallPadding}px`,
  paddingRight: `${theme.sizing.smallPadding}px`,
}));

const FooterLeftContainer = styled(Container)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
});

const Avatar = styled("img")({
  height: "42px",
  width: "auto",
  boxShadow: "0px 5px 12px rgba(16, 54, 0, 0.3)",
  borderRadius: "12px",
});

interface FooterContentProps {
  avatar: number;
  teamName: string;
  newPoints?: number;
  score: number;
  handleUpdateScore?: (newScore: number) => void;
}

export default function FooterContent({
  avatar,
  teamName,
  newPoints,
  score,
  handleUpdateScore,
}: FooterContentProps) {
  const theme = useTheme();

  return (
    <FooterContainer>
      <FooterLeftContainer>
        <Avatar src={monsterMap[avatar].icon} alt="avatar" />
        <Typography
          variant="h3"
          sx={{ marginLeft: `${theme.sizing.smallPadding}px` }}
        >
          {teamName}
        </Typography>
      </FooterLeftContainer>
      {handleUpdateScore ? (
        <ScoreIndicator
          newPoints={newPoints}
          score={score}
          handleUpdateScore={handleUpdateScore}
        />
      ) : (
        <ScoreIndicator newPoints={newPoints} score={score} />
      )}
    </FooterContainer>
  );
}
