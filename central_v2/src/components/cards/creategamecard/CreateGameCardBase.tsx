import React from 'react';
import {
  Typography,
  Box,
  Fade,
  useTheme,
  InputAdornment,
  Grid,
  Stack,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import {
  PublicPrivateType,
  CentralQuestionTemplateInput,
} from '@righton/networking';
import {
  ContentContainerStyled,
  ImageStyled,
} from '../../../lib/styledcomponents/DetailedQuestionStyledComponents';
import {
  BaseCardStyled,
  TextContainerStyled,
  CCSSIndicator,
} from '../../../lib/styledcomponents/CreateQuestionStyledComponents';
import { ErrorIcon } from '../../../lib/styledcomponents/CentralStyledComponents';
import CentralButton from '../../button/Button';
import { ButtonType } from '../../button/ButtonModels';
import { ButtonCCSS } from '../../../lib/styledcomponents/ButtonStyledComponents';
import { ScreenSize } from '../../../lib/CentralModels';
import ErrorBox from '../createquestion/ErrorBox';
import CreateGameErrorBox from './CreateGameErrorBox';
import PublicPrivateButton from '../../button/publicprivatebutton/PublicPrivateButton';
import errorIcon from '../../../images/errorIcon.svg';
import SelectPhaseButton from './SelectPhaseButton';
import SelectArrowImage from '../../../images/SelectArrow.svg';
import ImageUploadModal from '../../modal/ImageUploadModal';
import {
  CreateGameContentLeftContainerStyled,
  ImagePlaceholder,
  CreateGameTextFieldContainer,
  CreateGameTitleBarStyled,
  CreateGameTitleText,
  GameContentContainerStyled,
} from '../../../lib/styledcomponents/CreateGameStyledComponent';
import { TPhaseTime, TGameTemplateProps } from '../../../pages/CreateGame';

interface CreateGameCardBaseProps {
  draftGame: TGameTemplateProps;
  screenSize: ScreenSize;
  handleImageUploadClick: () => void;
  handlePublicPrivateChange: (value: PublicPrivateType) => void;
  isCardSubmitted: boolean;
  isCardErrored: boolean;
  phaseTime: TPhaseTime;
  handlePhaseTime: (time: TPhaseTime) => void;
  gameTitle: string;
  gameDescription: string;
  onGameTitle: (val: string) => void;
  onGameDescription: (val: string) => void;
  openQuestionBank: boolean;
  openCreateQuestion: boolean;
}

export default function CreateGameCardBase({
  draftGame,
  screenSize,
  handleImageUploadClick,
  handlePublicPrivateChange,
  isCardSubmitted,
  isCardErrored,
  phaseTime,
  handlePhaseTime,
  gameTitle,
  gameDescription,
  onGameTitle,
  onGameDescription,
  openQuestionBank,
  openCreateQuestion,
}: CreateGameCardBaseProps) {
  const theme = useTheme();
  const [isImageHovered, setIsImageHovered] = React.useState<boolean>(false);
  const isSmallerScreen =
    screenSize === ScreenSize.SMALL || screenSize === ScreenSize.MEDIUM;
  
  const getImage = (): string => {
    if (draftGame.image && draftGame.image instanceof File) return URL.createObjectURL(draftGame.image);
    return String(draftGame.imageUrl);
  };
  const [completedCardClicked, setCompletedCardClicked] = React.useState<boolean>(false)
  const imageLink = getImage();
  const imageContents = [
    imageLink && (
      <Box
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
        style={{
          width: '100%',
          height: '196px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          position: 'relative',
        }}
      >
        <ImageStyled
          src={imageLink}
          alt="image"
          style={{
            opacity: isImageHovered ? 0.6 : 1,
            transition: 'opacity 0.75s',
            borderRadius: '8px',
          }}
        />
        <Fade in={isImageHovered}>
          <div>
            <CentralButton
              buttonType={ButtonType.UPLOADIMAGE}
              isEnabled
              smallScreenOverride
              onClick={handleImageUploadClick}
            />
          </div>
        </Fade>
      </Box>
    ),
  ];

  const responsiveHeight =
    screenSize === ScreenSize.LARGE && !isCardErrored ? '100%' : '100%';
  const responsiveGap =
    screenSize === ScreenSize.LARGE || screenSize === ScreenSize.MEDIUM
      ? '24px'
      : '8px';

  const handlePhaseOneTime = (val: string) => {
    handlePhaseTime({ phaseOne: val, phaseTwo: phaseTime.phaseTwo });
  };

  const handlePhaseTwoTime = (val: string) => {
    handlePhaseTime({ phaseOne: phaseTime.phaseOne, phaseTwo: val });
  };

  const isTitleFieldError =
    (isCardSubmitted && (!gameTitle || gameTitle.length === 0)) ||
    (isCardErrored && (!gameTitle || gameTitle.length === 0));
  const isDescriptionFieldError =
    (isCardSubmitted && (!gameDescription || gameDescription.length === 0)) ||
    (isCardErrored && (!gameDescription || gameDescription.length === 0));

    // TODO: Add image to validation
    const cardIsComplete = 
    Boolean(draftGame.image || draftGame.imageUrl) &&
    phaseTime.phaseOne !== '' &&
    phaseTime.phaseTwo !== '' &&
    gameDescription !== '' &&
    gameTitle !== '' &&
    (openCreateQuestion || openQuestionBank);

    const handleCardClick = () => {
      if(cardIsComplete) {
        // temp solution for now
        setCompletedCardClicked(true)
      }
    }

  return (
    <BaseCardStyled
    onClick={handleCardClick}
      elevation={6}
      isHighlight={false}
      isCardComplete={completedCardClicked ? false : cardIsComplete}
      sx={{
        height: responsiveHeight,
        gap: responsiveGap,
        width: screenSize === ScreenSize.LARGE ? "680px": "100%",
        padding: screenSize === ScreenSize.LARGE ? '28px' : '24px',
        borderRadius: '8px',
      }}
    >
      <CreateGameTitleBarStyled screenSize={screenSize}>
        <Box
          style={{
            display: 'flex',
            flexDirection: screenSize === ScreenSize.SMALL ? 'column' : 'row',
            justifyContent:
              screenSize === ScreenSize.SMALL ? 'space-between' : 'flex-start',
            alignItems: screenSize === ScreenSize.SMALL ? 'start' : 'center',
            gap: screenSize === ScreenSize.LARGE ? '9px' : '16px',
          }}
        >
          <CreateGameTitleText
            align={screenSize === ScreenSize.SMALL ? 'left' : 'inherit'}
            sx={{ color: '#384466' }}
          >
            Create Game
          </CreateGameTitleText>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent={isSmallerScreen ? 'center' : 'normal'}
          >
            <SelectPhaseButton
              onSetPhaseTime={handlePhaseOneTime}
              phaseTime={phaseTime.phaseOne}
              isCardSubmitted={isCardSubmitted}
              phaseNumber={1}
              screenSize={screenSize}
              isCardError={isCardErrored }
            />
            <SelectPhaseButton
              onSetPhaseTime={handlePhaseTwoTime}
              phaseTime={phaseTime.phaseTwo}
              isCardSubmitted={isCardSubmitted}
              phaseNumber={2}
              screenSize={screenSize}
              isCardError={isCardErrored}
            />
          </Stack>
        </Box>

        {screenSize !== ScreenSize.SMALL && (
          <Box
            sx={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PublicPrivateButton 
            onHandlePublicPrivateChange={handlePublicPrivateChange}  
            isDisabled={false} />
          </Box>
        )}
      </CreateGameTitleBarStyled>
      <GameContentContainerStyled screenSize={screenSize}>
        {/* Create Question Content Left Container */}
        <CreateGameContentLeftContainerStyled
          sx={{
            gap:
              screenSize === ScreenSize.LARGE ||
              screenSize === ScreenSize.MEDIUM
                ? '12px'
                : '8px',
          }}
        >
          {/* Game Title TextField */}
          <CreateGameTextFieldContainer
            isCardError={isCardErrored}
            isTitle
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                height: '54px',
              },
            }}
            placeholder="Game title here.."
            value={gameTitle}
            onChange={(e) => onGameTitle(e.target.value)}
            error={isTitleFieldError}
            InputProps={{
              startAdornment: isTitleFieldError && (
                <InputAdornment
                  position="start"
                  sx={{
                    alignSelf: 'flex-start',
                    margin: 'auto 0',
                  }}
                >
                  <ErrorIcon src={errorIcon} alt="error icon" />
                </InputAdornment>
              ),
            }}
          >
            {gameTitle}
          </CreateGameTextFieldContainer>
          {/* Game Title TextField */}
          <CreateGameTextFieldContainer
            isCardError={isCardErrored}
            variant="outlined"
            sx={{
              '& .MuiInputBase-root': {
                height: '138px',
                fontFamily: 'Rubik',
              },
              '& .MuiOutlinedInput-input': {
                paddingBottom: 2,
              },
            }}
            multiline
            rows={4}
            placeholder="Enter game description here..."
            error={isDescriptionFieldError}
            value={gameDescription}
            onChange={(e) => onGameDescription(e.target.value)}
            InputProps={{
              startAdornment: isDescriptionFieldError && (
                <InputAdornment
                  position="start"
                  sx={{
                    alignSelf: 'flex-start',
                    mt: '10px',
                  }}
                >
                  <ErrorIcon src={errorIcon} alt="error icon" />
                </InputAdornment>
              ),
            }}
          >
            <Typography>{gameDescription}</Typography>
          </CreateGameTextFieldContainer>
        </CreateGameContentLeftContainerStyled>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            width: '100%',
            height:
              screenSize === ScreenSize.LARGE ||
              screenSize === ScreenSize.MEDIUM
                ? '204px'
                : '100%',
          }}
        >
          {/* Image Upload handled here */}
          {imageLink ? (
            imageContents
          ) : (
            <ImagePlaceholder
              isCardErrored={false}
              sx={{
                height:
                  screenSize === ScreenSize.LARGE ||
                  screenSize === ScreenSize.MEDIUM
                    ? '204px'
                    : '202px',
              }}
            >
              <CentralButton
                buttonType={ButtonType.UPLOADIMAGE}
                isEnabled
                smallScreenOverride
                onClick={handleImageUploadClick}
              />
            </ImagePlaceholder>
          )}
          {/* Image Upload handled here */}

          {/* card Error */}
          {screenSize === ScreenSize.SMALL && (
            <>
              {isCardErrored && <CreateGameErrorBox screenSize={screenSize} />}
              <Box
                style={{
                  width: '100%',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PublicPrivateButton 
                onHandlePublicPrivateChange={handlePublicPrivateChange} 
                isDisabled={false} />
              </Box>
            </>
          )}
        </Box>
      </GameContentContainerStyled>

      {screenSize !== ScreenSize.SMALL && isCardErrored && (
        <CreateGameErrorBox screenSize={screenSize} />
      )}
    </BaseCardStyled>
  );
}
