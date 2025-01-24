import React from 'react';
import { Typography, RadioGroup, Box, Fade, styled, useTheme, InputAdornment } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { 
  PublicPrivateType,
  CentralQuestionTemplateInput
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
  CCSSIndicator
} from '../../../lib/styledcomponents/CreateQuestionStyledComponents';
import {
  ErrorIcon
} from '../../../lib/styledcomponents/CentralStyledComponents';
import CentralButton from '../../button/Button';
import { ButtonType } from '../../button/ButtonModels';
import { ButtonCCSS } from '../../../lib/styledcomponents/ButtonStyledComponents';
import { ScreenSize } from '../../../lib/CentralModels';
import ImageButton from '../../button/imagebutton/ImageButton';
import { ImageButtonType } from '../../button/imagebutton/ImageButtonModels';
import PublicPrivateButton from '../../button/publicprivatebutton/PublicPrivateButton';
import errorIcon from '../../../images/errorIcon.svg';

interface CreateQuestionCardBaseProps {
  screenSize: ScreenSize;
  draftQuestion: CentralQuestionTemplateInput;
  handleTitleChange: (title: string, draftQuestion: CentralQuestionTemplateInput) => void;
  handleCCSSClick: () => void;
  handleImageUploadClick: () => void;
  handlePublicPrivateChange: (value: PublicPrivateType) => void;
  isHighlight: boolean;
  isCardSubmitted: boolean;
  isCardErrored: boolean;
  isAIError: boolean;
}

type ImagePlaceholderProps = {
  isCardErrored: boolean;
}

export const ImagePlaceholder = styled(Box)<ImagePlaceholderProps>(({ theme, isCardErrored }) => ({
  width: '100%',
  height: '175px',
  background: `${theme.palette.primary.uploadLightGrey}`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
  border: isCardErrored ? `2px solid ${theme.palette.primary.errorColor}` : `2px solid ${theme.palette.primary.uploadDarkGrey}`,
  borderRadius: '8px',
  boxSizing: 'border-box'
}));

interface CreateQuestionTitleBarStyledProps {
  screenSize: ScreenSize;
}

export const CreateQuestionTitleBarStyled = styled(Box)<CreateQuestionTitleBarStyledProps>(({ theme, screenSize }) => ({
  width: '100%',
  height: 'fit-content',
  display: 'flex',
  flexDirection: screenSize === ScreenSize.SMALL ? 'column' : 'row',
  justifyContent: 'space-between',
  alignItems: screenSize === ScreenSize.SMALL ? 'flex-start' : 'center',
  gap: screenSize === ScreenSize.SMALL ? `${theme.sizing.xSmPadding}px` : `${theme.sizing.smPadding}px`,
}));

export const CreateQuestionContentLeftContainerStyled = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: `${theme.sizing.xSmPadding}px`,
}));

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
  isAIError
}: CreateQuestionCardBaseProps) {
  const theme = useTheme();
  const [title, setTitle] = React.useState<string>(draftQuestion.questionCard.title);
  const [questionType, setQuestionType] = React.useState<PublicPrivateType>(PublicPrivateType.PUBLIC);
  const [isImageHovered, setIsImageHovered] = React.useState<boolean>(false);
  const getImage = () => {
    if (draftQuestion.questionCard.image && draftQuestion.questionCard.image instanceof File)
      return URL.createObjectURL(draftQuestion.questionCard.image);
    return draftQuestion.questionCard.imageUrl;
  }
  const imageLink = getImage();

  const handleQuestionTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setQuestionType(event.target.value as PublicPrivateType);
    handlePublicPrivateChange(event.target.value as PublicPrivateType);
  };

  const handleLocalTitleChange = (value: string) => {
    setTitle((prev) => value);
    handleTitleChange(value, draftQuestion);
  }

  const imageContents = [
    imageLink &&
      <Box 
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
        style={{  
          width: '100%',
          height: '175px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          position: 'relative',
      }}>
            <ImageStyled 
              src={imageLink}
              alt="image" 
              style={{
                opacity: isImageHovered ? 0.6: 1,
                transition: 'opacity 0.75s'
              }}
            />
            <Fade in={isImageHovered} >
              <div>
                <CentralButton buttonType={ButtonType.UPLOADIMAGE} isEnabled smallScreenOverride onClick={handleImageUploadClick} />
              </div>
            </Fade>
      </Box>
  ]

  return (
    <BaseCardStyled elevation={6} isHighlight={isHighlight} isCardComplete={draftQuestion.questionCard.isCardComplete}>
      <CreateQuestionTitleBarStyled screenSize={screenSize}>
        <Box style={{display: 'flex', alignItems: 'center', gap: '14px'}}>
          <QuestionTitleStyled>Question</QuestionTitleStyled>
          <ButtonCCSS key={uuidv4()} onClick={handleCCSSClick}>
            {draftQuestion.questionCard.ccss}
          </ButtonCCSS>
        </Box>
        <RadioContainerStyled>
          <RadioGroup
            row
            value={questionType} 
            onChange={handleQuestionTypeChange}
            style={{overflow: 'hidden', flexWrap: 'nowrap'}}
          >
            <RadioLabelStyled
              value={PublicPrivateType.PUBLIC}
              control={<RadioStyled style={{cursor: 'pointer'}}/>}
              label="Multiple Choice"
              isSelected={questionType === PublicPrivateType.PUBLIC}
              style={{cursor: 'pointer'}}
            />
            <RadioLabelStyled
              value={PublicPrivateType.PRIVATE}
              control={<RadioStyled style={{cursor: 'pointer'}}/>}
              label="Short Answer"
              isSelected={questionType === PublicPrivateType.PRIVATE}
              style={{cursor: 'pointer'}}
            />
          </RadioGroup>
        </RadioContainerStyled>
      </CreateQuestionTitleBarStyled>
      <ContentContainerStyled screenSize={screenSize}>
        <CreateQuestionContentLeftContainerStyled>
          <TextContainerStyled 
            multiline 
            variant="outlined" 
            rows='4' 
            placeholder="Enter question here..." 
            error={(isCardSubmitted || isAIError) && (!title || title.length === 0)}
            value={title}
            onChange = {(e) => handleLocalTitleChange(e.target.value)}
            InputProps={{
              startAdornment: 
                (isCardSubmitted || isAIError) && (!title || title.length === 0) &&
                <InputAdornment
                  position="start" 
                  sx={{ 
                    alignSelf: 'flex-start',
                    mt: '10px'
                  }}
                >
                  <ErrorIcon src={errorIcon} alt='error icon'/>
                </InputAdornment>
            }}
          >
            <Typography>{draftQuestion.questionCard.title}</Typography>
          </TextContainerStyled>
          { screenSize !== ScreenSize.SMALL && 
            <Box style={{display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'center'}}>
              <PublicPrivateButton />
            </Box>
          }
        </CreateQuestionContentLeftContainerStyled>
        {imageLink 
          ? imageContents
          : <ImagePlaceholder isCardErrored={isCardErrored}>
              <CentralButton buttonType={ButtonType.UPLOADIMAGE} isEnabled smallScreenOverride onClick={handleImageUploadClick} />
            </ImagePlaceholder>
        }
           { screenSize === ScreenSize.SMALL && 
            <Box style={{display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'center'}}>
              <PublicPrivateButton />
            </Box>
          }
      </ContentContainerStyled>
    </BaseCardStyled>
  );
}
