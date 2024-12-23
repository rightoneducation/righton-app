import React from 'react';
import { Typography, RadioGroup, Box, Fade, styled, useTheme, InputAdornment } from '@mui/material';
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
import { ScreenSize } from '../../../lib/CentralModels';
import ImageButton from '../../button/imagebutton/ImageButton';
import { ImageButtonType } from '../../button/imagebutton/ImageButtonModels';
import PublicPrivateButton from '../../button/publicprivatebutton/PublicPrivateButton';
import arrow from '../../../images/SelectArrow.svg';
import errorIcon from '../../../images/errorIcon.svg';

interface CreateQuestionCardBaseProps {
  screenSize: ScreenSize;
  draftQuestion: CentralQuestionTemplateInput;
  handleTitleChange: (title: string, draftQuestion: CentralQuestionTemplateInput) => void;
  handleCCSSClick: () => void;
  handleImageUploadClick: () => void;
  handleImageURLClick: () => void;
  handlePublicPrivateChange: (value: PublicPrivateType) => void;
  isHighlight: boolean;
  isCardSubmitted: boolean;
  isCardErrored: boolean;
}

type ImagePlaceholderProps = {
  isCardErrored: boolean;
}

export const ImagePlaceholder = styled(Box)<ImagePlaceholderProps>(({ theme, isCardErrored }) => ({
  width: '100%',
  height: '175px',
  background: `rgba(204,204,204)`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
  border: isCardErrored ? `2px solid ${theme.palette.primary.errorColor}` : '0px',
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

export const CreateQuestionContentRightContainerStyled = styled(Box)(({ theme }) => ({
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
  handleImageURLClick,
  handlePublicPrivateChange,
  isHighlight,
  isCardSubmitted,
  isCardErrored
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
                <ImageButton imageButtonType={ImageButtonType.IMAGEUPLOAD} isEnabled onClick={handleImageUploadClick}/>
                <Box style={{paddingTop: '16px'}}>
                  <ImageButton imageButtonType={ImageButtonType.IMAGEURL} isEnabled onClick={handleImageURLClick}/>
                </Box>
              </div>
            </Fade>
      </Box>
  ]

  return (
    <BaseCardStyled elevation={6} isHighlight={isHighlight} isCardComplete={draftQuestion.questionCard.isCardComplete}>
      <CreateQuestionTitleBarStyled screenSize={screenSize}>
        <QuestionTitleStyled>Question</QuestionTitleStyled>
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
        {imageLink 
          ? imageContents
          : <ImagePlaceholder isCardErrored={isCardErrored}>
              <ImageButton imageButtonType={ImageButtonType.IMAGEUPLOAD} isEnabled onClick={handleImageUploadClick}/>
              <ImageButton imageButtonType={ImageButtonType.IMAGEURL} isEnabled onClick={handleImageURLClick}/>
            </ImagePlaceholder>
        }
        <CreateQuestionContentRightContainerStyled>
          <TextContainerStyled 
            multiline 
            variant="outlined" 
            rows='4' 
            placeholder="Question Contents..." 
            error={isCardSubmitted && (!title || title.length === 0)}
            value={title}
            onChange = {(e) => handleLocalTitleChange(e.target.value)}
            InputProps={{
              startAdornment: 
                isCardSubmitted && (!title || title.length === 0) &&
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
          <Box style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
            <PublicPrivateButton />
            <CCSSIndicator onClick={handleCCSSClick}>
              {draftQuestion.questionCard.ccss}
              <img src={arrow} alt='CCSS' style={{width: '12px', height: '12px'}}/>
            </CCSSIndicator>
          </Box>
        </CreateQuestionContentRightContainerStyled>
      </ContentContainerStyled>
    </BaseCardStyled>
  );
}
