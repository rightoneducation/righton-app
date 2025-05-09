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
  CloudFrontDistributionUrl 
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
  TooltipStyled
} from '../../../lib/styledcomponents/CreateGameStyledComponent';
import { TPhaseTime, TGameTemplateProps } from '../../../lib/CreateGameModels';

interface CreateGameCardBaseProps {
  draftGame: TGameTemplateProps;
  isClone: boolean;
  isCloneImageChanged: boolean;
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
  isClone,
  isCloneImageChanged,
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
  const { imageUrl, image } = draftGame;
  const [isImageHovered, setIsImageHovered] = React.useState<boolean>(false);
  const isSmallerScreen =
    screenSize === ScreenSize.SMALL || screenSize === ScreenSize.MEDIUM;
  const [completedCardClicked, setCompletedCardClicked] = React.useState<boolean>(false);
  const [publicPrivateWarning, setPublicPrivateWarning] = React.useState<boolean>(false);
  
  let imageLink: string | null = null;
  if (imageUrl){
    imageLink = imageUrl;
    if (isClone && !isCloneImageChanged)
      imageLink = `${CloudFrontDistributionUrl}${imageUrl}`;
  }
  else if (image && image instanceof File)
    imageLink = URL.createObjectURL(image);

  console.log(imageLink);

  const imageContents = [
    imageLink && (
      <Box
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
        style={{
          width: '100%',
          height: screenSize === ScreenSize.LARGE ||
          screenSize === ScreenSize.MEDIUM
            ? '204px'
            : '202px',
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
    };

    const handleOpenPublicPrivateWarning = () => {
      if(openCreateQuestion || openQuestionBank) {
        setPublicPrivateWarning(true);
      }
    }

    const handleClosePublicPrivateWarning = () => {
      setPublicPrivateWarning(false);
    }

  return (
    <BaseCardStyled
      onClick={handleCardClick}
      elevation={6}
      isHighlight={false}
      isClone={isClone}
      isCardComplete={completedCardClicked ? false : cardIsComplete}
      sx={{
        height: responsiveHeight,
        gap: responsiveGap,
        width: "100%",
        maxWidth: '672px',
        padding: screenSize === ScreenSize.LARGE ? '28px' : '24px',
        borderRadius: '8px',
         boxShadow: "0px 8px 16px -4px rgba(92, 118, 145, 0.4)",
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
              isCardError={isCardErrored}
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
          <TooltipStyled
          placement="top" 
          open={publicPrivateWarning} 
          onOpen={handleOpenPublicPrivateWarning}
          onClose={handleClosePublicPrivateWarning} 
          title="Cannot edit while adding questions"
          arrow
          >
          <Box
            sx={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PublicPrivateButton
            isPublic={draftGame.publicPrivateGame === PublicPrivateType.PUBLIC} 
            onHandlePublicPrivateChange={handlePublicPrivateChange}  
            isDisabled={openCreateQuestion || openQuestionBank} />
          </Box>
            </TooltipStyled>
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
                height: screenSize === ScreenSize.SMALL ? '138px' : '119px',
                fontFamily: 'Rubik',
                padding: '12px 10px'
              },
              '& .MuiOutlinedInput-input': {
                paddingBottom: screenSize === ScreenSize.SMALL ? 2:1,
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
                    alignSelf: "flex-start",
                    mt: screenSize === ScreenSize.SMALL ? "12px" : "7px",
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
                ? '185px'
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
                    ? '185px'
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
              <TooltipStyled
                open={publicPrivateWarning} 
                onOpen={handleOpenPublicPrivateWarning}
                onClose={handleClosePublicPrivateWarning} 
                title="Cannot edit while adding questions"
                arrow
                >
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
                isPublic={draftGame.publicPrivateGame === PublicPrivateType.PUBLIC} 
                onHandlePublicPrivateChange={handlePublicPrivateChange} 
                isDisabled={openCreateQuestion || openQuestionBank} />
              </Box>
                </TooltipStyled>
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
