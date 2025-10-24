import React from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CentralButton from "../button/Button";
import { ButtonType } from "../button/ButtonModels";
import { TitleText } from "../../lib/styledcomponents/CreateGameStyledComponent";
import { ScreenSize } from "../../lib/CentralModels";

interface ViewGameHeaderProps {
  handleBackClick: () => void;
  handleEditGame: () => void;
  handleLaunchGame: () => void;
  label: string;
  screenSize: ScreenSize;
}

export default function ViewGameHeader({handleBackClick, handleEditGame, handleLaunchGame,  label, screenSize }: ViewGameHeaderProps) {
  const theme = useTheme();
  return(
    <Box style={{ 
      height: '48px',
      width: '100%', 
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: `${theme.sizing.xLgPadding}px`, 
      paddingBottom: `${theme.sizing.xLgPadding}px`,
      }}>
      <Box style={{ position: 'absolute', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <TitleText style={{lineHeight: '48px'}} screenSize={screenSize}>{label} Game</TitleText>
      </Box>
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
        
        <Box style={{ display: 'flex', gap: `${theme.sizing.xSmPadding}px` }}>
          <CentralButton
            buttonType={ButtonType.EDIT}
            isEnabled
            buttonWidthOverride="127px"
            onClick={handleEditGame}
          />
          <CentralButton
            buttonType={ButtonType.LAUNCH}
            isEnabled
            buttonWidthOverride="127px"
            onClick={handleLaunchGame}
          />
        </Box>
      </Box>
    </Box>
  )
}

