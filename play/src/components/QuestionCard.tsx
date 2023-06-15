import React from "react";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import BodyCardStyled from "../lib/styledcomponents/BodyCardStyled";
import BodyCardContainerStyled from "../lib/styledcomponents/BodyCardContainerStyled";

interface QuestionCardProps {
  questionText: string[];
  imageUrl: string;
}

export default function QuestionCard({
  questionText,
  imageUrl,
}: QuestionCardProps) {
  const theme = useTheme();
  return (
    <BodyCardStyled elevation={10}>
      <BodyCardContainerStyled>
        <img
          style={{
            width: "75%",
            height: "auto",
            paddingBottom: `${theme.sizing.smallPadding}px`,
          }}
          src={imageUrl}
          alt="Question"
        />
        <Typography variant="body1"> {questionText[0]} </Typography>
        <Typography
          variant="body1"
          sx={{ fontWeight: 700, whiteSpace: "pre-line" }}
        >
          {`\n ${questionText[1]}`}
        </Typography>
      </BodyCardContainerStyled>
    </BodyCardStyled>
  );
}
