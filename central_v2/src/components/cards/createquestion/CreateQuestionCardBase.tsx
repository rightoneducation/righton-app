import React from 'react';
import { Typography, RadioGroup, Box, styled, useTheme } from '@mui/material';
import { IQuestionTemplate } from '@righton/networking';
import {
  BaseCardStyled,
  TitleBarStyled,
  QuestionTitleStyled,
  RadioContainerStyled,
  RadioLabelStyled,
  RadioStyled,
  ContentContainerStyled,
  ImageStyled,
  ContentRightContainerStyled,
  CCSSIndicator,
} from '../../../lib/styledcomponents/DetailedQuestionStyledComponents';
import { TextContainerStyled } from '../../../lib/styledcomponents/CreateQuestionStyledComponents';
import { ScreenSize } from '../../../lib/CentralModels';
import ImageButton from '../../button/imagebutton/ImageButton';
import { ImageButtonType } from '../../button/imagebutton/ImageButtonModels';
import PublicPrivateButton from '../../button/publicprivatebutton/PublicPrivateButton';
import arrow from '../../../images/SelectArrow.svg';

interface CreateQuestionCardBaseProps {
  screenSize: ScreenSize;
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

export default function CreateQuestionCardBase({
  screenSize,
}: CreateQuestionCardBaseProps) {
  const theme = useTheme();
  const [questionType, setQuestionType] = React.useState<string>('A');
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [title, setTitle] = React.useState<string | null>(null);
  const [ccss, setCCSS] = React.useState<string | null>('CCSS');
  const handleQuestionTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setQuestionType((event.target as HTMLInputElement).value);
  };
console.log(questionType);
  return (
    <BaseCardStyled>
      <TitleBarStyled>
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
              label={screenSize === ScreenSize.SMALL ? "M.C." : "Multiple Choice"}
              isSelected={questionType === 'A'}
              style={{cursor: 'pointer'}}
            />
            <RadioLabelStyled
              value="B"
              control={<RadioStyled style={{cursor: 'pointer'}}/>}
              label={screenSize === ScreenSize.SMALL ? "S.A." : "Short Answer"}
              isSelected={questionType === 'B'}
              style={{cursor: 'pointer'}}
            />
          </RadioGroup>
        </RadioContainerStyled>
      </TitleBarStyled>
      <ContentContainerStyled screenSize={screenSize}>
        {imageUrl 
          ? <ImageStyled src={imageUrl ?? ''} alt="image" />
          : <ImagePlaceholder>
              <ImageButton imageButtonType={ImageButtonType.IMAGEUPLOAD} isEnabled/>
              <ImageButton imageButtonType={ImageButtonType.IMAGEURL} isEnabled/>
            </ImagePlaceholder>
        }
        <ContentRightContainerStyled>
          <TextContainerStyled multiline variant="outlined" rows='4'>
            <Typography>{title}</Typography>
          </TextContainerStyled>
          <Box style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
            <PublicPrivateButton />
            <CCSSIndicator>
              {ccss}
              <img src={arrow} alt='CCSS' style={{width: '12px', height: '12px'}}/>
            </CCSSIndicator>
          </Box>
        </ContentRightContainerStyled>
      </ContentContainerStyled>
    </BaseCardStyled>
  );
}
