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
  CloudFrontDistributionUrl,
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
import SelectPublicPrivateDropdown from './SelectPublicPrivateDropdown';
import {
  CreateGameContentLeftContainerStyled,
  ImagePlaceholder,
  CreateGameTextFieldContainer,
  CreateGameTitleBarStyled,
  CreateGameTitleText,
  GameContentContainerStyled,
  TooltipStyled,
  HeaderText,
  GameCardBaseItem,
} from '../../../lib/styledcomponents/CreateGameStyledComponent';
import { TPhaseTime, TGameTemplateProps } from '../../../lib/CreateGameModels';

interface CreateGameCardBaseProps {
  draftGame: TGameTemplateProps;
  isClone: boolean;
  isEdit: boolean;
  isEditDraft: boolean;
  isCloneImageChanged: boolean;
  label: string;
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
  isEdit,
  isEditDraft,
  isCloneImageChanged,
  label,
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
  const [completedCardClicked, setCompletedCardClicked] =
    React.useState<boolean>(false);
  const [publicPrivateWarning, setPublicPrivateWarning] =
    React.useState<boolean>(false);

  let imageLink: string | null = null;
  if (imageUrl) {
    imageLink = imageUrl;
    if ((isClone || isEdit) && !isCloneImageChanged)
      imageLink = `${CloudFrontDistributionUrl}${imageUrl}`;
  } else if (image && image instanceof File)
    imageLink = URL.createObjectURL(image);
    
  const imageContents = [
    imageLink && (
      <Box
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
        style={{
          width: '100%',
          height:
            screenSize === ScreenSize.LARGE || screenSize === ScreenSize.MEDIUM
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
      ? '32px'
      : '8px';

  const handlePhaseOneTime = (val: string) => {
    handlePhaseTime({ phaseOne: val, phaseTwo: phaseTime.phaseTwo });
  };

  const handlePhaseTwoTime = (val: string) => {
    handlePhaseTime({ phaseOne: phaseTime.phaseOne, phaseTwo: val });
  };

  const isTitleFieldError =
    (isCardSubmitted && (!gameTitle || gameTitle.length === 0)) ||
    (isCardErrored && (!gameTitle || gameTitle.length === 0)) || 
    (draftGame.isDraftGameErrored && (!gameTitle || gameTitle.length === 0));
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
    if (cardIsComplete) {
      // temp solution for now
      setCompletedCardClicked(true);
    }
  };

  const handleOpenPublicPrivateWarning = () => {
    console.log('here');
    if (draftGame.questionCount !== null && draftGame.questionCount !== undefined && draftGame.questionCount !== 0) {
      setPublicPrivateWarning(true);
    }
  };

  const handleClosePublicPrivateWarning = () => {
    setPublicPrivateWarning(false);
  };


  const displayLabel = label === "Edit" ? 'Your' : label;

  return (
    <BaseCardStyled
      onClick={handleCardClick}
      elevation={6}
      isClone={isClone}
      isCardComplete={completedCardClicked ? false : cardIsComplete}
      sx={{
        gap: `${theme.sizing.mdPadding}px`,
        width: '100%',
        maxWidth: screenSize !== ScreenSize.LARGE ? '100%' : '460px',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0px 8px 16px -4px rgba(92, 118, 145, 0.4)',
      }}
    >
      <CreateGameTitleBarStyled screenSize={screenSize}>
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
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
            {displayLabel} Game
          </CreateGameTitleText>
        </Box>
      </CreateGameTitleBarStyled>
      <GameContentContainerStyled screenSize={screenSize}>
      {screenSize !== ScreenSize.SMALL && (isCardErrored || draftGame.isDraftGameErrored) && (
        <CreateGameErrorBox screenSize={screenSize} />
      )}
        {/* Create Game Card Base Item */}
          <GameCardBaseItem
          >
            {/* Game Title TextField */}
            <HeaderText>
              Enter a title for your game*
            </HeaderText>
            <CreateGameTextFieldContainer
              isCardError={isCardErrored || (draftGame.isDraftGameErrored ?? false)}
              isTitle
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: '43px',
                },
              }}
              placeholder="What do you want to call your game?"
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
          </GameCardBaseItem>
          <GameCardBaseItem>
            {/* Game Description TextField */}
            <HeaderText>
              Describe your game*
            </HeaderText>
            <CreateGameTextFieldContainer
              isCardError={isCardErrored}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-input': {
                  paddingBottom: screenSize === ScreenSize.SMALL ? 2 : 1,
                },
              }}
              multiline
              rows={4}
              placeholder="Give a short description of the game."
              error={isDescriptionFieldError}
              value={gameDescription}
              onChange={(e) => onGameDescription(e.target.value)}
              InputProps={{
                startAdornment: isDescriptionFieldError && (
                  <InputAdornment
                    position="start"
                    sx={{
                      alignSelf: 'flex-start',
                      mt: screenSize === ScreenSize.SMALL ? '12px' : '7px',
                    }}
                  >
                    <ErrorIcon src={errorIcon} alt="error icon" />
                  </InputAdornment>
                ),
              }}
            >
              <Typography>{gameDescription}</Typography>
            </CreateGameTextFieldContainer>
          </GameCardBaseItem>
          <GameCardBaseItem>
            {/* Public Private Dropdown */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0px',
              }}
            >
              <HeaderText>
              Make your game available to the public*
              </HeaderText>
              <HeaderText>
              (Other users can launch it)
              </HeaderText>
            </Box>
            <SelectPublicPrivateDropdown
              publicPrivateType={draftGame.gameTemplate.publicPrivateType}
              onHandlePublicPrivateChange={handlePublicPrivateChange}
              isCardSubmitted={isCardSubmitted}
              screenSize={screenSize}
              isCardError={isCardErrored}
            />
          </GameCardBaseItem>
          <GameCardBaseItem>
            {/* Timing Dropdowns */}
            <HeaderText>
              Select the timing of each phase*
            </HeaderText>
            <Stack
            direction="row"
            spacing={1}
            alignItems="flex-start"
            justifyContent={isSmallerScreen ? 'center' : 'normal'}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <HeaderText>
                Phase 1
              </HeaderText>
              <SelectPhaseButton
                onSetPhaseTime={handlePhaseOneTime}
                phaseTime={phaseTime.phaseOne}
                isCardSubmitted={isCardSubmitted}
                phaseNumber={1}
                screenSize={screenSize}
                isCardError={isCardErrored}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <HeaderText>
                Phase 2
              </HeaderText>
              <SelectPhaseButton
                onSetPhaseTime={handlePhaseTwoTime}
                phaseTime={phaseTime.phaseTwo}
                isCardSubmitted={isCardSubmitted}
                phaseNumber={2}
                screenSize={screenSize}
                isCardError={isCardErrored}
              />
            </Box>
          </Stack>
          </GameCardBaseItem>
          <GameCardBaseItem>
            {/* Timing Supplemental Text */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0px',
              }}
            >
            <HeaderText>
              <i>RightOn!</i> questions are divided into two phases:
            </HeaderText>
            <HeaderText>
              <b>Phase 1:</b> Choose the correct answer
            </HeaderText>
            <HeaderText>
              <b>Phase 2:</b> Choose the most popular incorrect answer
            </HeaderText>
            </Box>
          </GameCardBaseItem>
          <GameCardBaseItem>
            {/* Image Select */}
            <HeaderText>
              Add an image to showcase your game (optional)
            </HeaderText>
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
            </Box>
          </GameCardBaseItem>
      </GameContentContainerStyled>
    </BaseCardStyled>
  );
}
