import React from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CentralButton from "../button/Button";
import { ButtonType } from "../button/ButtonModels";
import { TitleText } from "../../lib/styledcomponents/CreateGameStyledComponent";
import { ScreenSize } from "../../lib/CentralModels";

interface CreateQuestionHeaderProps {
  handleSaveQuestion: () => void;
  handleBackClick: () => void;
  label: string;
  screenSize: ScreenSize;
}

export default function CreateQuestionHeader({ handleSaveQuestion, handleBackClick, label, screenSize }: CreateQuestionHeaderProps) {
  const theme = useTheme();
  return(
    <Box style={{ 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      paddingTop: screenSize !== ScreenSize.LARGE ? `${theme.sizing.mdPadding}px` : `${theme.sizing.xLgPadding}px`, 
      paddingBottom: screenSize !== ScreenSize.LARGE ? `${theme.sizing.mdPadding}px` : `${theme.sizing.xLgPadding}px`,
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
          iconOnlyOverride={screenSize !== ScreenSize.LARGE}
          buttonWidthOverride={screenSize !== ScreenSize.LARGE ? '48px' : '127px'}
          onClick={handleBackClick}
        />
        <TitleText screenSize={screenSize}>{label} Question</TitleText>
        <CentralButton
          buttonType={ButtonType.SAVE}
          isEnabled
          iconOnlyOverride={screenSize !== ScreenSize.LARGE}
          buttonWidthOverride={screenSize !== ScreenSize.LARGE ? '48px' : '127px'}
          onClick={handleSaveQuestion}
        />
      </Box>
    </Box>
  )
}
