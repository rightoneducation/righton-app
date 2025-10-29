import React from "react";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CentralButton from "../button/Button";
import { ButtonType } from "../button/ButtonModels";
import { TitleText } from "../../lib/styledcomponents/CreateGameStyledComponent";
import { ScreenSize } from "../../lib/CentralModels";

interface ViewQuestionHeaderProps {
  handleBackClick: () => void;
  handleEditQuestion: () => void;
  handleCloneQuestion: () => void;
  handleDeleteQuestion: () => void;
  isEditEnabled: boolean;
  screenSize: ScreenSize;
}

export default function ViewQuestionHeader({
  handleBackClick,
  handleEditQuestion,
  handleCloneQuestion,
  handleDeleteQuestion,
  isEditEnabled,
  screenSize
}: ViewQuestionHeaderProps) {
  const theme = useTheme();
  return (
    <Box style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: `${theme.sizing.mdPadding}px` }}>
      <Box style={{ 
        height: '48px',
        width: '100%', 
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: screenSize === ScreenSize.SMALL ? `${theme.sizing.mdPadding}px` : `${theme.sizing.xLgPadding}px`, 
        paddingBottom: screenSize === ScreenSize.SMALL ? `${theme.sizing.mdPadding}px` : `${theme.sizing.xLgPadding}px`,
        }}>
        <Box style={{ position: 'absolute', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <TitleText style={{lineHeight: '48px'}} screenSize={screenSize}>View Question</TitleText>
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
            iconOnlyOverride={screenSize === ScreenSize.SMALL}
            buttonWidthOverride={screenSize === ScreenSize.SMALL ? '48px' : '127px'}
            onClick={handleBackClick}
          />
          <Box
            style={{
              display: 'flex',
              gap: `${theme.sizing.xSmPadding}px`,
            }}
          >
            <CentralButton
              buttonType={ButtonType.EDIT}
              isEnabled
              iconOnlyOverride={screenSize === ScreenSize.SMALL}
              buttonWidthOverride={screenSize === ScreenSize.SMALL ? '48px' : '127px'}
              onClick={handleBackClick}
            />
            <CentralButton
              buttonType={ButtonType.ADDTOGAMEPINK}
              isEnabled
              iconOnlyOverride={screenSize === ScreenSize.SMALL}
              buttonWidthOverride={screenSize === ScreenSize.SMALL ? '48px' : 'auto'}
              onClick={handleBackClick}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

