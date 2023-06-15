import React from "react";
import { useTheme } from "@mui/material/styles";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  OverlayContainerStyled,
  OverlayImageStyled,
  ScreenshotImageStyled,
} from "../../../lib/styledcomponents/CarouselElementsStyled";
import HowToPlay_Phase1Circle from "../../../img/HowToPlay_Phase1Circle.svg";
import HowToPlay_GreenMonster from "../../../img/HowToPlay_GreenMonster.svg";
import HowToPlay_PinkMonster from "../../../img/HowToPlay_PinkMonster.svg";
import HowToPlay_Screenshot2 from "../../../img/HowToPlay_Screenshot2.png";

export default function HowToPlaySlide2Content() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <>
      <OverlayContainerStyled>
        <OverlayImageStyled
          src={HowToPlay_Phase1Circle}
          alt="monster"
          sx={{
            top: "40px",
            left: "210px",
            height: "70px",
            width: "70px",
          }}
        />
        <OverlayImageStyled
          src={HowToPlay_GreenMonster}
          alt="monster"
          sx={{
            bottom: "80px",
            left: "180px",
            width: "90px",
            height: "auto",
            zIndex: -1,
          }}
        />
        <OverlayImageStyled
          src={HowToPlay_PinkMonster}
          alt="monster"
          sx={{
            bottom: "80px",
            left: "430px",
            width: "90px",
            height: "auto",
          }}
        />
      </OverlayContainerStyled>
      <ScreenshotImageStyled src={HowToPlay_Screenshot2} alt="monster" />
      <Typography
        variant="h2"
        sx={{
          textAlign: "center",
          paddingTop: `${theme.sizing.mediumPadding}px`,
          width: "250px",
        }}
      >
        {t("howtoplay.slide2")}
      </Typography>
    </>
  );
}
