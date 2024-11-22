import React from 'react';
import { Typography, RadioGroup, Box, Fade, styled, useTheme, InputAdornment } from '@mui/material';
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
import { CreateQuestionTemplateInput, ScreenSize } from '../../../lib/CentralModels';
import ImageButton from '../../button/imagebutton/ImageButton';
import { ImageButtonType } from '../../button/imagebutton/ImageButtonModels';
import PublicPrivateButton from '../../button/publicprivatebutton/PublicPrivateButton';
import arrow from '../../../images/SelectArrow.svg';
import errorIcon from '../../../images/errorIcon.svg';

interface CreateQuestionCardBaseProps {
  screenSize: ScreenSize;
  draftQuestion: CreateQuestionTemplateInput;
  handleTitleChange: (title: string, draftQuestion: CreateQuestionTemplateInput) => void;
  handleCCSSClick: () => void;
  handleImageUploadClick: () => void;
  handleImageURLClick: () => void;
  isHighlight: boolean;
  isCardSubmitted: boolean;
}

export const ImagePlaceholder = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '175px',
  background: `rgba(204,204,204)`,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px'
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
  isHighlight,
  isCardSubmitted
}: CreateQuestionCardBaseProps) {
  const theme = useTheme();
  const [title, setTitle] = React.useState<string>('');
  const [questionType, setQuestionType] = React.useState<string>('A');
  const [isImageHovered, setIsImageHovered] = React.useState<boolean>(false);
  const handleQuestionTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setQuestionType((event.target as HTMLInputElement).value);
  };

  const handleLocalTitleChange = (value: string) => {
    setTitle((prev) => value);
    handleTitleChange(value, draftQuestion);
  }

  const imageContents = [
    draftQuestion.questionCard.image &&
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
          position: 'relative'
      }}>
            <ImageStyled 
              src={URL.createObjectURL(draftQuestion.questionCard.image) ?? ''} 
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
              value="A"
              control={<RadioStyled style={{cursor: 'pointer'}}/>}
              label="Multiple Choice"
              isSelected={questionType === 'A'}
              style={{cursor: 'pointer'}}
            />
            <RadioLabelStyled
              value="B"
              control={<RadioStyled style={{cursor: 'pointer'}}/>}
              label="Short Answer"
              isSelected={questionType === 'B'}
              style={{cursor: 'pointer'}}
            />
          </RadioGroup>
        </RadioContainerStyled>
      </CreateQuestionTitleBarStyled>
      <ContentContainerStyled screenSize={screenSize}>
        {draftQuestion.questionCard.image 
          ? imageContents
          : <ImagePlaceholder>
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
            error={isCardSubmitted && (!draftQuestion.questionCard.title || draftQuestion.questionCard.title.length === 0)}
            value={title}
            onChange = {(e) => handleLocalTitleChange(e.target.value)}
            InputProps={{
              startAdornment: 
                isCardSubmitted && (!draftQuestion.questionCard.title || draftQuestion.questionCard.title.length === 0) &&
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
