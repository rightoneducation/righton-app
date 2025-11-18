import React from "react";
import { Box, Typography } from "@mui/material";
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
  isOwner: boolean;
  isIncompleteDraft: boolean;
}

export default function ViewGameHeader({ handleBackClick, handleEditGame, handleLaunchGame,  label, screenSize, isOwner, isIncompleteDraft }: ViewGameHeaderProps) {
  const theme = useTheme();

  return(
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
          <TitleText style={{lineHeight: '48px'}} screenSize={screenSize}>{label} {isOwner ? 'My' : ''} Game</TitleText>
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
          {screenSize !== ScreenSize.SMALL && (
            <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: `${theme.sizing.xSmPadding}px` }}>
              <Box style={{ display: 'flex', gap: `${theme.sizing.xSmPadding}px` }}>
              {isOwner ? (
                <CentralButton
                  buttonType={ButtonType.EDIT}
                  isEnabled
                  buttonWidthOverride='127px'
                  onClick={handleBackClick}
                />
              ) :(
                <Box style={{ display: 'flex', gap: `${theme.sizing.xSmPadding}px` }}>
                  <CentralButton
                    buttonType={ButtonType.FAVORITE}
                    isEnabled
                    onClick={handleBackClick}
                  />
                  <CentralButton
                    buttonType={ButtonType.DUPLICATE}
                    isEnabled
                    onClick={handleBackClick}
                  />
                </Box>
              )}
                <CentralButton
                  buttonType={ButtonType.LAUNCH}
                  isEnabled={!isIncompleteDraft}
                  buttonWidthOverride="140px"
                  onClick={handleLaunchGame}
                />
              </Box>
              {isIncompleteDraft && (
                <Box style={{ display: 'flex', gap: `${theme.sizing.xSmPadding}px` }}>
                  <Typography style={{ fontSize: '14px', color: '#000', fontFamily: 'Rubik', fontWeight: '400' }}>Finish editing this draft game and publish it in order to launch</Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
      {screenSize === ScreenSize.SMALL && (
        <Box style={{ display: 'flex', gap: `${theme.sizing.xSmPadding}px` }}>
        {isOwner ? (
              <CentralButton
                buttonType={ButtonType.EDIT}
                isEnabled
                iconOnlyOverride={screenSize === ScreenSize.SMALL}
                buttonWidthOverride={screenSize === ScreenSize.SMALL ? '48px' : '127px'}
                onClick={handleBackClick}
              />
            ) :(
              <Box style={{ display: 'flex', gap: `${theme.sizing.xSmPadding}px` }}>
                <CentralButton
                  buttonType={ButtonType.FAVORITE}
                  isEnabled
                  iconOnlyOverride={screenSize === ScreenSize.SMALL}
                  buttonWidthOverride={screenSize === ScreenSize.SMALL ? '48px' : 'auto'}
                  onClick={handleBackClick}
                />
                <CentralButton
                  buttonType={ButtonType.DUPLICATE}
                  isEnabled
                  iconOnlyOverride={screenSize === ScreenSize.SMALL}
                  buttonWidthOverride={screenSize === ScreenSize.SMALL ? '48px' : 'auto'}
                  onClick={handleBackClick}
                />
              </Box>
            )}
          <CentralButton
            buttonType={ButtonType.LAUNCH}
            isEnabled={!isIncompleteDraft}
            onClick={handleLaunchGame}
          />
        </Box>
      )}
    </Box>
  )
}

