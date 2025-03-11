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
import PublicPrivateButton from './PublicPrivatePillButton';
import errorIcon from '../../../images/errorIcon.svg';
import SelectPhaseButton from './SelectPhaseButton';
import SelectArrowImage from '../../../images/SelectArrow.svg';
import ImageUploadModal from '../../modal/ImageUploadModal';
import { CreateGameContentLeftContainerStyled, ImagePlaceholder, CreateGameTextFieldContainer } from '../../../lib/styledcomponents/CreateGameStyledComponent';

interface CreateGameCardBase {
  screenSize: ScreenSize;
  draftQuestion: CentralQuestionTemplateInput;
  handleTitleChange: (
    title: string,
    draftQuestion: CentralQuestionTemplateInput,
  ) => void;
  handleCCSSClick: () => void;
  handleImageUploadClick: () => void;
  handlePublicPrivateChange: (value: PublicPrivateType) => void;
  isHighlight: boolean;
  isCardSubmitted: boolean;
  isCardErrored: boolean;
  isAIError: boolean;
}

export default function CreateQuestionCardBase({
  screenSize,
  draftQuestion,
  handleTitleChange,
  handleCCSSClick,
  handleImageUploadClick,
  handlePublicPrivateChange,
  isHighlight,
  isCardSubmitted,
  isCardErrored,
  isAIError,
}: CreateGameCardBase) {
  const theme = useTheme();
  const [title, setTitle] = React.useState<string>(
    draftQuestion.questionCard.title,
  );
  const [questionType, setQuestionType] = React.useState<PublicPrivateType>(
    PublicPrivateType.PUBLIC,
  );
  const [isImageHovered, setIsImageHovered] = React.useState<boolean>(false);
  const isSmallerScreen =
    screenSize === ScreenSize.SMALL || screenSize === ScreenSize.MEDIUM;
  const getImage = () => {
    if (
      draftQuestion.questionCard.image &&
      draftQuestion.questionCard.image instanceof File
    )
      return URL.createObjectURL(draftQuestion.questionCard.image);
    return draftQuestion.questionCard.imageUrl;
  };
  const imageLink = getImage();

  const handleQuestionTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuestionType(event.target.value as PublicPrivateType);
    handlePublicPrivateChange(event.target.value as PublicPrivateType);
  };

  const handleLocalTitleChange = (value: string) => {
    setTitle((prev) => value);
    handleTitleChange(value, draftQuestion);
  };

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

  return (
    <BaseCardStyled
      elevation={6}
      isHighlight={isHighlight}
      isCardComplete={draftQuestion.questionCard.isCardComplete}
    >
      <ContentContainerStyled screenSize={screenSize}>
        {/* Create Question Content Right Container */}
        <CreateGameContentLeftContainerStyled>
          {/* Game Title TextField */}
          <CreateGameTextFieldContainer
            isTitle
            variant="outlined"
            placeholder="Game Title..."
            InputProps={{
              startAdornment: (isCardSubmitted || isAIError) &&
                (!title || title.length === 0) && (
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
            {draftQuestion.questionCard.title}
          </CreateGameTextFieldContainer>
          {/* Game Description TextField */}
          <CreateGameTextFieldContainer
            multiline
            variant="outlined"
            rows="4"
            placeholder="Game Description..."
            error={
              (isCardSubmitted || isAIError) && (!title || title.length === 0)
            }
            value={title}
            onChange={(e) => handleLocalTitleChange(e.target.value)}
            InputProps={{
              startAdornment: (isCardSubmitted || isAIError) &&
                (!title || title.length === 0) && (
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
            <Typography>{draftQuestion.questionCard.title}</Typography>
          </CreateGameTextFieldContainer>
        </CreateGameContentLeftContainerStyled>

        {/* Image Upload handled here */}
        {imageLink ? (
          imageContents
        ) : (
          <ImagePlaceholder isCardErrored={isCardErrored}>
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
        {screenSize === ScreenSize.SMALL && isCardErrored && <ErrorBox />}
      </ContentContainerStyled>
      {/* Grid Container for Phase selection & PublicPrivate Toggle */}
      <Grid
        container
        direction="row"
        alignItems="center"
        spacing={isSmallerScreen ? 2 : 0}
      >
        {/* Grid item for phase selection */}
        <Grid item xs={12} md={6}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent={isSmallerScreen ? 'center' : 'normal'}
          >
            <SelectPhaseButton phaseNumber={1} screenSize={screenSize} />
            <SelectPhaseButton phaseNumber={2} screenSize={screenSize} />
          </Stack>
        </Grid>
        {/* Grid item for PublicPrivate Toggle */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PublicPrivateButton isDisabled={false} />
        </Grid>
      </Grid>
      {screenSize !== ScreenSize.SMALL && isCardErrored && <ErrorBox />}
    </BaseCardStyled>
  );
}
