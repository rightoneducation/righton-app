import React from 'react';
import { Typography, RadioGroup, Box, TextField, styled, useTheme } from '@mui/material';
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
import { ScreenSize } from '../../../lib/CentralModels';
import ImageButton from '../../button/imagebutton/ImageButton';
import { ImageButtonType } from '../../button/imagebutton/ImageButtonModels';

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

export const TextContainerStyled = styled(TextField)(({ theme }) => ({
  height: '100%',
  margin: 0,
  flexGrow: 1,
  borderRadius: `${theme.sizing.xSmPadding}px`,
  borderColor: `${theme.palette.primary.extraDarkGrey}`,
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: `${theme.palette.primary.extraDarkGrey}`
    }
  }
}));

export default function CreateQuestionCardBase({
  screenSize,
}: CreateQuestionCardBaseProps) {
  const theme = useTheme();
  const [questionType, setQuestionType] = React.useState<string>('A');
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [title, setTitle] = React.useState<string | null>(null);
  const [ccss, setCCSS] = React.useState<string | null>(null);
  const handleQuestionTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuestionType((event.target as HTMLInputElement).value);
  };

  return (
    <BaseCardStyled>
      <TitleBarStyled>
        <QuestionTitleStyled>Question</QuestionTitleStyled>
        <RadioContainerStyled>
          <RadioGroup row value={questionType} style={{overflow: 'hidden', flexWrap: 'nowrap'}}>
            <RadioLabelStyled
              value="A"
              control={<RadioStyled />}
              label={screenSize === ScreenSize.SMALL ? "M.C." : "Multiple Choice"}
              isSelected={questionType === 'A'}
            />
            <RadioLabelStyled
              value="B"
              control={<RadioStyled />}
              label={screenSize === ScreenSize.SMALL ? "S.A." : "Short Answer"}
              isSelected={questionType === 'B'}
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
          { ccss &&
            <CCSSIndicator>
              {ccss}
            </CCSSIndicator>
          }
        </ContentRightContainerStyled>
      </ContentContainerStyled>
    </BaseCardStyled>
  );
}
