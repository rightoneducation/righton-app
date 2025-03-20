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
  GameContentContainerStyled
} from '../../../lib/styledcomponents/CreateGameStyledComponent';

interface CreateGameCardBaseProps {
  screenSize: ScreenSize;
  handleTitleChange: (
    title: string,
    draftQuestion: CentralQuestionTemplateInput,
  ) => void;
  handleImageUploadClick: () => void;
  handlePublicPrivateChange: (value: PublicPrivateType) => void;
  isHighlight: boolean;
  isCardSubmitted: boolean;
  isCardErrored: boolean;
}

export default function CreateGameCardBase({
  screenSize,
  handleTitleChange,
  handleImageUploadClick,
  handlePublicPrivateChange,
  isHighlight,
  isCardSubmitted,
  isCardErrored,
}: CreateGameCardBaseProps) {
  const theme = useTheme();
  const [title, setTitle] = React.useState<string>("");
  const [questionType, setQuestionType] = React.useState<PublicPrivateType>(
    PublicPrivateType.PUBLIC,
  );
  const [isImageHovered, setIsImageHovered] = React.useState<boolean>(false);
  const isSmallerScreen =
    screenSize === ScreenSize.SMALL || screenSize === ScreenSize.MEDIUM;
  const [image, setImage] = React.useState<File>()
  const getImage = () => {
    if (
      image &&
      image instanceof File
    )
      return URL.createObjectURL(image);
    return image;
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

  const responsiveHeight = screenSize === ScreenSize.LARGE && !isCardErrored ? '100%' : '100%';
  const responsiveGap =
    screenSize === ScreenSize.LARGE || screenSize === ScreenSize.MEDIUM
      ? '24px'
      : '8px';

  return (
    <BaseCardStyled
      elevation={6}
      isHighlight={isHighlight}
      isCardComplete={isCardErrored ?? false}
      sx={{ height: responsiveHeight, gap: responsiveGap, padding: screenSize === ScreenSize.LARGE ? '28px': '24px', }}
    >
      <CreateGameTitleBarStyled screenSize={screenSize}>
        <Box
          style={{
            display: 'flex',
            flexDirection: screenSize === ScreenSize.SMALL ? 'column' : 'row',
            justifyContent:
              screenSize === ScreenSize.SMALL ? 'space-between' : 'flex-start',
            alignItems: screenSize === ScreenSize.SMALL ? 'start' : 'center',
            gap: screenSize === ScreenSize.LARGE ? '9px': '16px',
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
            <SelectPhaseButton isCardSubmitted={isCardSubmitted} phaseNumber={1} screenSize={screenSize} />
            <SelectPhaseButton isCardSubmitted={isCardSubmitted} phaseNumber={2} screenSize={screenSize} />
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
            <PublicPrivateButton isDisabled={false} />
          </Box>
        )}
      </CreateGameTitleBarStyled>
      <GameContentContainerStyled screenSize={screenSize}>
        {/* Create Question Content Left Container */}
        <CreateGameContentLeftContainerStyled sx={{ gap: screenSize === ScreenSize.LARGE || screenSize === ScreenSize.MEDIUM ? '12px' : '8px' }}>
          {/* Game Title TextField */}
          <CreateGameTextFieldContainer
          isCardError={isCardErrored}
            isTitle
            variant="outlined"
           sx={{
            '& .MuiOutlinedInput-root': {
              height: '54px'
            }
           }}
            placeholder="Game title here.."
            error={
              isCardSubmitted && (!title || title.length === 0)
            }
            InputProps={{
              startAdornment: isCardSubmitted &&
                (!title || title.length === 0) && (
                  <InputAdornment
                    position="start"
                    sx={{
                      alignSelf: 'flex-start',
                      margin: "auto 0",
                    }}
                  >
                    <ErrorIcon src={errorIcon} alt="error icon" />
                  </InputAdornment>
                ),
            }}
          >
            {title}
          </CreateGameTextFieldContainer>
          {/* Game Description TextField */}
          <CreateGameTextFieldContainer
          isCardError={isCardErrored}
          variant="outlined"
          sx={{
            '& .MuiInputBase-root': {
              height: '138px',
              fontFamily: 'Rubik'
            },
            '& .MuiOutlinedInput-input': {
            paddingBottom: 2
            }
          }}
            multiline
            rows={4}
            placeholder="Enter game description here..."
            error={
              isCardSubmitted && (!title || title.length === 0)
            }
            value={title}
            onChange={(e) => handleLocalTitleChange(e.target.value)}
            InputProps={{
              startAdornment: isCardSubmitted &&
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
            <Typography>{title}</Typography>
          </CreateGameTextFieldContainer>
        </CreateGameContentLeftContainerStyled>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px', 
          width: '100%',
          height: (screenSize === ScreenSize.LARGE  || screenSize === ScreenSize.MEDIUM) ? '204px' : '100%'
          }}>
        {/* Image Upload handled here */}
        {imageLink ? (
          imageContents
        ) : (
          <ImagePlaceholder isCardErrored={false} sx={{ 
            height: (screenSize === ScreenSize.LARGE  || screenSize === ScreenSize.MEDIUM) ? '204px' : '202px' ,
            }}>
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
              <PublicPrivateButton isDisabled={false} />
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
