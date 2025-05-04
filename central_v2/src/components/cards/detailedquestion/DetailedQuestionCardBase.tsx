import React from 'react';
import { Typography, RadioGroup, Box, styled } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { PublicPrivateType, IQuestionTemplate, CloudFrontDistributionUrl  } from '@righton/networking';
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
} from '../../../lib/styledcomponents/CreateQuestionStyledComponents';
import { ButtonCCSS } from '../../../lib/styledcomponents/ButtonStyledComponents';
import { ScreenSize} from '../../../lib/CentralModels';
import PublicPrivateButton from '../../button/publicprivatebutton/PublicPrivateButton';

interface DetailedQuestionCardBaseProps {
  screenSize: ScreenSize;
  question: IQuestionTemplate;
  dropShadow?: boolean;
  isCreateGame?: boolean;
}

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

export default function DetailedQuestionCardBase({
  screenSize,
  question,
  dropShadow,
  isCreateGame,
}: DetailedQuestionCardBaseProps) {
  const [questionType, setQuestionType] = React.useState<string>('A');
  const [isPublic, setIsPublic] = React.useState<boolean>(false);

    const isCreateGamePage = 
    isCreateGame && screenSize === ScreenSize.LARGE ||
    isCreateGame && screenSize === ScreenSize.MEDIUM ||
    isCreateGame && screenSize === ScreenSize.SMALL;

  const handleQuestionTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuestionType((event.target as HTMLInputElement).value);
  };

  const handlePublicPrivateChange = () => {
    setIsPublic((prev) => !prev);
  }

  return (
    <BaseCardStyled sx={{
      ...(isCreateGame && {  
        boxShadow: "0px 8px 16px -4px rgba(92, 118, 145, 0.4)", 
        padding: screenSize === ScreenSize.LARGE ? "28px" : (theme) => `${theme.sizing.mdPadding}px`,
      })
    }} elevation={6} isHighlight={false} isCardComplete={false} dropShadow={dropShadow}>
    <CreateQuestionTitleBarStyled screenSize={screenSize}>
      <Box style={{width: '100%', display: 'flex', justifyContent: screenSize === ScreenSize.SMALL ? 'space-between' : 'flex-start', alignItems: 'center', gap: '14px'}}>
        <QuestionTitleStyled>Question</QuestionTitleStyled>
        <ButtonCCSS key={uuidv4()}>
          {question.ccss}
        </ButtonCCSS>
      </Box>
      { screenSize !== ScreenSize.SMALL && !isCreateGame &&
        <Box style={{display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'center'}}>
          <PublicPrivateButton isPublic={isPublic} isDisabled/>
        </Box>
      }
      {isCreateGame && (
         <RadioContainerStyled>
         <RadioGroup
           row
           value={questionType} 
           onChange={handleQuestionTypeChange}
           style={{ overflow: 'hidden', flexWrap: 'nowrap' }}
         >
           <RadioLabelStyled
             disabled
             value={PublicPrivateType.PUBLIC}
             control={<RadioStyled style={{ cursor: 'pointer' }}/>}
             label="Multiple Choice"
             isSelected={questionType === PublicPrivateType.PUBLIC}
             style={{cursor: 'pointer', ...(isCreateGamePage && { whiteSpace: 'nowrap'})}}
           />
           <RadioLabelStyled
             disabled
             value={PublicPrivateType.PRIVATE}
             control={<RadioStyled style={{ cursor: 'pointer' }}/>}
             label="Short Answer"
             isSelected={questionType === PublicPrivateType.PRIVATE}
             style={{cursor: 'pointer', ...(isCreateGamePage && { whiteSpace: 'nowrap' })}}
           />
         </RadioGroup>
       </RadioContainerStyled>
      )}
    </CreateQuestionTitleBarStyled>
    <ContentContainerStyled screenSize={screenSize}>
      <Box
        style={{
          width: '100%',
          height: 'auto',
          margin: 0,
          boxSizing: 'border-box',
        }}
      >
        <img src={`${CloudFrontDistributionUrl}${question.imageUrl ?? ''}`} alt='question' style={{width: '100%', height: '200px', objectFit: 'cover', borderRadius: isCreateGame ? "8px" : "0px",}}/>
      </Box>
      <CreateQuestionContentRightContainerStyled>
        {!isCreateGame && <RadioContainerStyled>
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
        </RadioContainerStyled>}
        <Box
          style={{
            width: '100%',
            margin: 0,
            padding: '8px',
            boxSizing: 'border-box',
          }}
        >
          <Typography>{question.title}</Typography>
        </Box>
      </CreateQuestionContentRightContainerStyled>
      { screenSize === ScreenSize.SMALL && !isCreateGame &&
        <Box style={{display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
          <PublicPrivateButton isPublic={isPublic} isDisabled={false}/>
        </Box>
      }
    </ContentContainerStyled>
  </BaseCardStyled>
  );
}
