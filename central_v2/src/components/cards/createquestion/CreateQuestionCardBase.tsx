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
import { v4 as uuidv4 } from 'uuid';
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
import PublicPrivateButton from '../../button/publicprivatebutton/PublicPrivateButton';
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
  flexDirection: screenSize === ScreenSize.SMALL ? 'column' : 'row',
  justifyContent: 'space-between',
  alignItems: screenSize === ScreenSize.SMALL ? 'flex-start' : 'center',
  gap:
    screenSize === ScreenSize.SMALL
      ? `${theme.sizing.xSmPadding}px`
      : `${theme.sizing.smPadding}px`,
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
            justifyContent:
              screenSize === ScreenSize.SMALL ? 'space-between' : 'flex-start',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <QuestionTitleStyled sx={{ color: '#384466' }}>
            {label} Question
          </QuestionTitleStyled>
          <Box>
            <ButtonCCSS
              key={uuidv4()}
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
        {screenSize !== ScreenSize.SMALL && !isCreateGame && (
          <Box
            style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PublicPrivateButton
              isPublic={isPublic}
              onHandlePublicPrivateChange={handlePublicPrivateChange}
              isDisabled={false}
            />
          </Box>
        )}
      </CreateQuestionTitleBarStyled>
      <ContentContainerStyled screenSize={screenSize}>
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
        <CreateQuestionContentRightContainerStyled>
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
            placeholder="Enter question here..."
            error={
              (isCardSubmitted || isAIError) &&
              (!draftQuestion.questionCard.title ||
                draftQuestion.questionCard.title.length === 0)
            }
            value={draftQuestion.questionCard.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            InputProps={{
              startAdornment: (isCardSubmitted || isAIError) &&
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
          >
            <Typography>{draftQuestion.questionCard.title}</Typography>
          </TextContainerStyled>
        </CreateQuestionContentRightContainerStyled>
        {screenSize === ScreenSize.SMALL && (
          <>
            {isCardErrored && <ErrorBox />}
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
                <PublicPrivateButton
                  isPublic={isPublic}
                  onHandlePublicPrivateChange={handlePublicPrivateChange}
                  isDisabled={false}
                />
              </Box>
            )}
          </>
        )}
      </ContentContainerStyled>
      {screenSize !== ScreenSize.SMALL && isCardErrored && <ErrorBox />}
    </BaseCardStyled>
  );
}
