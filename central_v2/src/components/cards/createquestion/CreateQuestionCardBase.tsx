import React from 'react';
import {
  Typography,
  RadioGroup,
  Box,
  Fade,
  styled,
  useTheme,
  InputAdornment,
  Button,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  PublicPrivateType,
  CentralQuestionTemplateInput,
  AnswerType,
  CloudFrontDistributionUrl,
} from '@righton/networking';
import {
  QuestionTitleStyled,
  RadioContainerStyled,
  RadioLabelStyled,
  RadioStyled,
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
import ErrorBox from './ErrorBox';
import PublicPrivateDropdown from '../../button/publicprivatebutton/PublicPrivateDropdown';
import errorIcon from '../../../images/errorIcon.svg';
import { SelectArrowContainer } from '../../../lib/styledcomponents/SelectGrade';
import SelectArrow from '../../../images/SelectArrow.svg';

interface CreateQuestionCardBaseProps {
  screenSize: ScreenSize;
  isClone: boolean;
  isEdit: boolean;
  isCloneImageChanged: boolean;
  label: string;
  draftQuestion: CentralQuestionTemplateInput;
  handleTitleChange: (title: string) => void;
  handleCCSSClick: () => void;
  handleImageUploadClick: () => void;
  handleAnswerType: () => void;
  handlePublicPrivateChange: (value: PublicPrivateType) => void;
  isHighlight: boolean;
  isCardSubmitted: boolean;
  isDraftCardErrored?: boolean;
  isCardErrored: boolean;
  isAIError: boolean;
  isPublic: boolean;
  isMultipleChoice: boolean;
  isCreateGame?: boolean;
}

type ImagePlaceholderProps = {
  isCardErrored: boolean;
};

export const ImagePlaceholder = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isCardErrored',
})<ImagePlaceholderProps>(({ theme, isCardErrored }) => ({
  width: '100%',
  height: '196px',
  background: `${theme.palette.primary.uploadLightGrey}`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
  border: isCardErrored
    ? `2px solid ${theme.palette.primary.errorBorder}`
    : `2px solid ${theme.palette.primary.uploadDarkGrey}`,
  borderRadius: '8px',
  boxSizing: 'border-box',
}));

interface CreateQuestionTitleBarStyledProps {
  screenSize: ScreenSize;
}

export const CreateQuestionTitleBarStyled = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'screenSize',
})<CreateQuestionTitleBarStyledProps>(({ theme, screenSize }) => ({
  width: '100%',
  height: 'fit-content',
  display: 'flex',
  flexDirection: 'column' ,
  gap: '32px'
}));

export const CreateQuestionContentRightContainerStyled = styled(Box)(
  ({ theme }) => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: `${theme.sizing.xSmPadding}px`,
  }),
);

export default function CreateQuestionCardBase({
  screenSize,
  isClone,
  isEdit,
  isCloneImageChanged,
  label,
  draftQuestion,
  handleTitleChange,
  handleCCSSClick,
  handleImageUploadClick,
  handlePublicPrivateChange,
  handleAnswerType,
  isMultipleChoice,
  isHighlight,
  isCardSubmitted,
  isDraftCardErrored,
  isCardErrored,
  isAIError,
  isPublic,
  isCreateGame,
}: CreateQuestionCardBaseProps) {
  const theme = useTheme();
  const { imageUrl, image } = draftQuestion.questionCard;
  const [questionType, setQuestionType] = React.useState<PublicPrivateType>(
    PublicPrivateType.PUBLIC,
  );
  const [isImageHovered, setIsImageHovered] = React.useState<boolean>(false);
  const [CCSSIsOpen, setCCSSIsOpen] = React.useState<boolean>(false);

  const isCreateGamePage =
    (isCreateGame && screenSize === ScreenSize.LARGE) ||
    (isCreateGame && screenSize === ScreenSize.MEDIUM) ||
    (isCreateGame && screenSize === ScreenSize.SMALL);

  const CCSSIsErrored =
    (isCardErrored && draftQuestion.questionCard.ccss === 'CCSS') ||
    (isCardErrored && draftQuestion.questionCard.ccss === '');

  let imageLink: string | null = null;
  if (imageUrl) {
    imageLink = imageUrl;
    if ((isClone || isEdit) && !isCloneImageChanged)
      imageLink = `${CloudFrontDistributionUrl}${imageUrl}`;
  } else if (image && image instanceof File)
    imageLink = URL.createObjectURL(image);

  const handleQuestionTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuestionType(event.target.value as PublicPrivateType);
    handlePublicPrivateChange(event.target.value as PublicPrivateType);
  };

  const handleCCSSButtonClick = () => {
    handleCCSSClick();
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
      sx={{
        ...(isCreateGame && {
          boxShadow: '0px 8px 16px -4px rgba(92, 118, 145, 0.4)',
          padding:
            isCreateGame && screenSize === ScreenSize.LARGE
              ? `28px`
              : `${theme.sizing.mdPadding}`,
        }),
      }}
      elevation={6}
      isHighlight={isHighlight}
      isCardComplete={draftQuestion.questionCard.isCardComplete}
      isClone={isClone}
    >
      <CreateQuestionTitleBarStyled screenSize={screenSize}>
        <Box
          style={{
            width: '100%',
            display: 'flex',
            justifyContent:'flex-start',
            flexDirection: 'column',
            gap: '32px'
          }}
        >
          <QuestionTitleStyled sx={{ color: '#384466' }}>
            {label} Question
          </QuestionTitleStyled>
          <Box sx={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
            <Typography sx ={{fontFamily: 'Rubik', fontSize: '14px', fontWeight: '400', color: '#384466'}}>
              Enter your question*
            </Typography>
            <TextContainerStyled
              multiline
              variant="outlined"
              rows={isCreateGamePage ? '7' : '5'}
              sx={{
                '& .MuiInputBase-root': {
                  fontFamily: 'Rubik',
                  ...(isCreateGamePage && { height: '196px' }),
                },
                '& .MuiInputBase-input': {
                  color: '#384466',
                  opacity: isCardErrored ? 1 : 0.5,
                  '&::placeholder': {
                    color: isCardErrored ? '#D0254D' : '#384466',
                    opacity: isCardErrored ? 1 : 0.5,
                  },
                  '&:focus': {
                    color: '#384466',
                    opacity: 1,
                  },
                  '&:focus::placeholder': {
                    color: '#384466',
                    opacity: 1,
                  },
                },
              }}
              placeholder="Enter your question..."
              error={
                (isCardSubmitted || isDraftCardErrored || isAIError) &&
                (!draftQuestion.questionCard.title ||
                  draftQuestion.questionCard.title.length === 0)
              }
              value={draftQuestion.questionCard.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              InputProps={{
                startAdornment: (isCardSubmitted || isDraftCardErrored || isAIError) &&
                  (!draftQuestion.questionCard.title ||
                    draftQuestion.questionCard.title.length === 0) && (
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
            />
          </Box>
        </Box>
        <Box sx={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
          <Typography sx={{fontFamily: 'Rubik', fontSize: '14px', fontWeight: '400', color: '#384466'}}>
            Choose your answer type
          </Typography>
          {!isCreateGamePage && screenSize !== ScreenSize.SMALL && (
            <RadioContainerStyled>
              <RadioGroup
                row
                value={isMultipleChoice ? 'multiple' : 'short'}
                onChange={handleAnswerType}
                style={{ overflow: 'hidden', flexWrap: 'nowrap' }}
              >
                <RadioLabelStyled
                  value="multiple"
                  control={<RadioStyled style={{ cursor: 'pointer' }} />}
                  label="Multiple Choice"
                  isSelected={isMultipleChoice}
                  style={{ cursor: 'pointer' }}
                />
                <RadioLabelStyled
                  value="short"
                  control={<RadioStyled style={{ cursor: 'pointer' }} />}
                  label="Short Answer"
                  isSelected={!isMultipleChoice}
                  style={{ cursor: 'pointer' }}
                />
              </RadioGroup>
            </RadioContainerStyled>
          )}
            {(isCreateGamePage || screenSize === ScreenSize.SMALL) && (
            <RadioContainerStyled>
              <RadioGroup
                row
                value={isMultipleChoice ? 'multiple' : 'short'}
                onChange={handleAnswerType}
                style={{ overflow: 'hidden', flexWrap: 'nowrap' }}
              >
                <RadioLabelStyled
                  value="multiple"
                  control={<RadioStyled style={{ cursor: 'pointer' }} />}
                  label="Multiple Choice"
                  isSelected={isMultipleChoice}
                  style={{
                    cursor: 'pointer',
                    ...(isCreateGamePage && { whiteSpace: 'nowrap' }),
                  }}
                />
                <RadioLabelStyled
                  value="short"
                  control={<RadioStyled style={{ cursor: 'pointer' }} />}
                  label="Short Answer"
                  isSelected={!isMultipleChoice}
                  style={{
                    cursor: 'pointer',
                    ...(isCreateGamePage && { whiteSpace: 'nowrap' }),
                  }}
                />
              </RadioGroup>
            </RadioContainerStyled>
          )}
        </Box>
        <Box sx={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
          <Typography sx={{fontFamily: 'Rubik', fontSize: '14px', fontWeight: '400', color: '#384466'}}>
            Include a helpful visual or diagram (optional) 
          </Typography>
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
        </Box>
      </CreateQuestionTitleBarStyled>
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px'}}>
          <Typography sx={{fontFamily: 'Rubik', fontSize: '14px', fontWeight: '400', color: '#384466'}}>
            Choose a standard for your question
          </Typography>
          <Box >
            <ButtonCCSS
              onClickCapture={(e: React.MouseEvent) => {
                e.stopPropagation();
                handleCCSSButtonClick();
              }}
              CCSSIsErrored={CCSSIsErrored}
              sx={{
                gap: '3px',
                boxShadow:
                  screenSize === ScreenSize.SMALL
                    ? '0px 2px 9px 0px rgb(149, 0, 35, 30%)'
                    : 'none',
              }}
            >
              {draftQuestion.questionCard.ccss}
              <Box>
                <img
                  src={SelectArrow}
                  alt="select-arrow"
                  width={9}
                  height={9}
                />
              </Box>
            </ButtonCCSS>
          </Box>
      </Box>
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '20px'}}>
        <Typography sx={{fontFamily: 'Rubik', fontSize: '14px', fontWeight: '400', color: '#384466',}}>
          Make your question available to the public*
          (Other users can use it in their games)        
        </Typography>
        <CreateQuestionContentRightContainerStyled>
          {screenSize !== ScreenSize.SMALL && !isCreateGame && (
            <Box
              style={{
                width: '100%',
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
            >
              <PublicPrivateDropdown
                isPublic={isPublic}
                onHandlePublicPrivateChange={handlePublicPrivateChange}
                isDisabled={false}
              />
            </Box>
          )}
          {screenSize === ScreenSize.SMALL && (
            <>
              {(isCardErrored || isDraftCardErrored) && <ErrorBox />}
              {!isCreateGame && !isEdit && (
                <Box
                  style={{
                    width: '100%',
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <PublicPrivateDropdown
                    isPublic={isPublic}
                    onHandlePublicPrivateChange={handlePublicPrivateChange}
                    isDisabled={false}
                  />
                </Box>
              )}
            </>
          )}
        </CreateQuestionContentRightContainerStyled>
      </Box>
      {screenSize !== ScreenSize.SMALL && (isCardErrored || isDraftCardErrored)  && <ErrorBox />}
    </BaseCardStyled>
  );
}
