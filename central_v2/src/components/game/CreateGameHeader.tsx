import React from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CentralButton from "../button/Button";
import { ButtonType } from "../button/ButtonModels";
import { TitleText } from "../../lib/styledcomponents/CreateGameStyledComponent";
import { ScreenSize } from "../../lib/CentralModels";

interface CreateGameHeaderProps {
  handleSaveGame: () => void;
  handleBackClick: () => void;
  label: string;
  screenSize: ScreenSize;
}

export default function CreateGameHeader({ handleSaveGame, handleBackClick, label, screenSize }: CreateGameHeaderProps) {
  const theme = useTheme();
  return(
    <Box style={{ 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      paddingTop: `${theme.sizing.xLgPadding}px`, 
      paddingBottom: `${theme.sizing.xLgPadding}px`,
      }}>
      <Box
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <CentralButton
          buttonType={ButtonType.BACK}
          isEnabled
          buttonWidthOverride="127px"
          onClick={handleBackClick}
        />
        <TitleText screenSize={screenSize}>{label} Game</TitleText>
        <CentralButton
          buttonType={ButtonType.SAVE}
          isEnabled
          buttonWidthOverride="127px"
          onClick={handleSaveGame}
        />
      </Box>
    </Box>
  )
}

