import React from "react";
import { useTheme } from "@mui/material/styles";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  OverlayContainerStyled,
  OverlayImageStyled,
  ScreenshotImageStyled,
} from "../../../lib/styledcomponents/CarouselElementsStyled";
import HowToPlay_BlueMonster from "../../../img/HowToPlay_BlueMonster.svg";
import HowToPlay_Screenshot4 from "../../../img/HowToPlay_Screenshot4.png";

export default function HowToPlaySlide4Content() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <>
      <OverlayContainerStyled>
        <OverlayImageStyled
          src={HowToPlay_BlueMonster}
          alt="monster"
          sx={{
            top: "30px",
            left: "370px",
            width: "140px",
            height: "auto",
            zIndex: -1,
          }}
        />
      </OverlayContainerStyled>
      <ScreenshotImageStyled src={HowToPlay_Screenshot4} alt="monster" />
      <Typography
        variant="h2"
        sx={{
          textAlign: "center",
          paddingTop: `${theme.sizing.mediumPadding}px`,
          width: "350px",
        }}
      >
        {t("howtoplay.slide4")}
      </Typography>
    </>
  );
}
