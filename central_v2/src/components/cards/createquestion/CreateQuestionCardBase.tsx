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
  ImageStyled,
} from '../../../lib/styledcomponents/DetailedQuestionStyledComponents';
import {
  BaseCardStyled,
  TextContainerStyled,
  CCSSIndicator,
} from '../../../lib/styledcomponents/CreateQuestionStyledComponents';
import { TitleText, HeaderText, CreateGameTitleText, CreateGameTextFieldContainer } from '../../../lib/styledcomponents/CreateGameStyledComponent';
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
import SelectPublicPrivateDropdown from '../creategamecard/SelectPublicPrivateDropdown';

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

const ImagePlaceholder = styled(Box, {
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

const CreateQuestionTitleBarStyled = styled(Box, {
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

const ContentContainerStyled = styled(Box)(
  ({ theme }) => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: `${theme.sizing.smPadding}px`,
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

  const isTitleFieldError =
    (!draftQuestion.questionCard.title ||
      draftQuestion.questionCard.title.length === 0);

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
        width: '100%',
        maxWidth: screenSize !== ScreenSize.LARGE ? '100%' : '410px',
        gap: `${theme.sizing.mdPadding}px`,
        padding:`${theme.sizing.mdPadding}px`,
      }}
      elevation={6}
      isCardComplete={draftQuestion.questionCard.isCardComplete}
      isClone={isClone}
    >
      <CreateQuestionTitleBarStyled screenSize={screenSize}>
        <CreateGameTitleText
          align={screenSize === ScreenSize.SMALL ? 'left' : 'inherit'}
          sx={{ color: '#384466' }}
        >
          Your Question
        </CreateGameTitleText>
      </CreateQuestionTitleBarStyled>
      <ContentContainerStyled>
      <HeaderText>
        Enter your question*
      </HeaderText>
      <CreateGameTextFieldContainer
        isCardError={isCardErrored && isCardSubmitted}
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-input': {
            paddingBottom: screenSize === ScreenSize.SMALL ? 2 : 1,
          },
        }}
        multiline
        rows={6}
        placeholder="Enter your question here..."
        error={isTitleFieldError && (isCardSubmitted || isAIError)}
        value={draftQuestion.questionCard.title}
        onChange={(e) => handleTitleChange(e.target.value)}
        InputProps={{
          startAdornment: (isTitleFieldError && (isCardSubmitted || isAIError)) && (
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
        <Typography>{draftQuestion.questionCard.title}</Typography>
      </CreateGameTextFieldContainer>
      </ContentContainerStyled>
      <ContentContainerStyled>
        <Box style={{ display: 'flex', flexDirection: 'column', gap: `${theme.sizing.smPadding}px` }}>
          <HeaderText>
            Choose your answer type*
          </HeaderText>
          <RadioContainerStyled>
            <RadioGroup
              row
              value={isMultipleChoice ? 'multiple' : 'short'}
              onChange={handleAnswerType}
              style={{ overflow: 'hidden', flexWrap: 'nowrap', gap: `${theme.sizing.xSmPadding}px` }}
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
        </Box>
      </ContentContainerStyled>
      <ContentContainerStyled>
        <HeaderText>
          Include a helpful visual or diagram (optional)
        </HeaderText>
        {imageLink ? (
          imageContents
        ) : (
          <ImagePlaceholder isCardErrored={false}>
            <CentralButton
              buttonType={ButtonType.UPLOADIMAGE}
              isEnabled
              smallScreenOverride
              onClick={handleImageUploadClick}
            />
          </ImagePlaceholder>
        )}
        </ContentContainerStyled>
        <ContentContainerStyled style={{ gap: `${theme.sizing.mdPadding}px` }}>

        <Box style={{ display: 'flex', flexDirection: 'column', gap: `${theme.sizing.smPadding}px` }}>
        <HeaderText>
          Choose a standard for your question*
        </HeaderText>
            <ButtonCCSS
              key={uuidv4()}
              onClickCapture={(e: React.MouseEvent) => {
                e.stopPropagation();
                handleCCSSButtonClick();
              }}
              CCSSIsErrored={CCSSIsErrored && isCardSubmitted}
              sx={{
                gap: '3px',
                boxShadow:
                  screenSize === ScreenSize.SMALL
                    ? '0px 2px 9px 0px rgb(149, 0, 35, 30%)'
                    : 'none',
                width: 'fit-content',
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
          <Box style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '20px' }}>
            {/* Public Private Dropdown */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0px',
              }}
            >
              <HeaderText>
                Make your question available to the public*
              </HeaderText>
              <HeaderText>
                Other users can launch it
              </HeaderText>  
            </Box>
            <SelectPublicPrivateDropdown
              publicPrivateType={draftQuestion.publicPrivateType}
              onHandlePublicPrivateChange={handlePublicPrivateChange}
              isCardSubmitted={isCardSubmitted}
              screenSize={screenSize}
              isCardError={isCardErrored}
            />
          </Box>
          </ContentContainerStyled>
      {screenSize !== ScreenSize.SMALL && ((isCardErrored && isCardSubmitted) || isDraftCardErrored)  && <ErrorBox />}
    </BaseCardStyled>
  );
}
